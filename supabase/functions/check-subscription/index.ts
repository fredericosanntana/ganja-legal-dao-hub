
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@14.14.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função auxiliar para log
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Função iniciada");

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY não está definido');
    logStep("Chave Stripe verificada");

    // Inicializar cliente Supabase com a service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Header de autorização não fornecido');
    logStep("Header de autorização encontrado");

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Erro de autenticação: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error('Usuário não autenticado');
    logStep("Usuário autenticado", { userId: user.id });

    const stripe = new Stripe(stripeKey, { 
      apiVersion: '2023-10-16', 
      httpClient: Stripe.createFetchHttpClient()
    });

    // Verificar assinatura na tabela de subscriptions do Supabase
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Verificar assinaturas no Stripe para este usuário
    let stripeSubscription = null;
    let subscriptionStatus = {
      subscribed: false,
      subscription_tier: 'basic',
      subscription_end: new Date().toISOString()
    };

    // Buscar cliente do Stripe vinculado ao email
    if (user.email) {
      logStep("Buscando cliente Stripe pelo email", { email: user.email });
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      
      if (customers.data.length > 0) {
        const customerId = customers.data[0].id;
        logStep("Cliente Stripe encontrado", { customerId });
        
        // Buscar assinaturas do cliente
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1
        });
        
        if (subscriptions.data.length > 0) {
          stripeSubscription = subscriptions.data[0];
          logStep("Assinatura Stripe encontrada", { subscriptionId: stripeSubscription.id });
          
          // Verificar produtos e preços para determinar o tier
          const items = stripeSubscription.items.data;
          if (items.length > 0) {
            const priceId = items[0].price.id;
            logStep("Preço da assinatura", { priceId });
            
            // Mapear priceId para tier (isso depende da sua configuração no Stripe)
            // Exemplo simplificado
            const tier = priceId.includes('premium') ? 'premium' : 'standard';
            
            subscriptionStatus = {
              subscribed: true,
              subscription_tier: tier,
              subscription_end: new Date(stripeSubscription.current_period_end * 1000).toISOString()
            };
            
            // Atualizar registro de assinatura no Supabase
            const { error: updateError } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: user.id,
                status: 'active',
                payment_details: tier,
                started_at: new Date(stripeSubscription.start_date * 1000).toISOString(),
                expires_at: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString()
              });
            
            if (updateError) {
              logStep("Erro ao atualizar assinatura no Supabase", { error: updateError.message });
            } else {
              logStep("Assinatura atualizada no Supabase com sucesso");
            }
          }
        } else {
          logStep("Nenhuma assinatura ativa encontrada no Stripe");
          
          // Se não há assinatura no Stripe, verificar se temos registro local
          if (subscriptionData && subscriptionData.status === 'active') {
            // Verificar se a assinatura local ainda é válida
            const expiresAt = new Date(subscriptionData.expires_at);
            const now = new Date();
            
            if (expiresAt > now) {
              logStep("Assinatura local válida até", { expiresAt });
              subscriptionStatus = {
                subscribed: true,
                subscription_tier: subscriptionData.payment_details || 'basic',
                subscription_end: subscriptionData.expires_at
              };
            } else {
              logStep("Assinatura local expirada");
              // Atualizar para inativa
              await supabase
                .from('subscriptions')
                .update({ status: 'inactive', updated_at: new Date().toISOString() })
                .eq('user_id', user.id);
            }
          }
        }
      } else {
        logStep("Nenhum cliente Stripe encontrado para este email");
      }
    }

    return new Response(JSON.stringify(subscriptionStatus), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[CHECK-SUBSCRIPTION ERROR] ${errorMessage}`);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
