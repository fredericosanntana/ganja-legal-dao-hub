
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
    if (!stripeKey) {
      logStep("STRIPE_SECRET_KEY não está definido");
      return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY não está definido', subscribed: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    logStep("Chave Stripe verificada");

    // Inicializar cliente Supabase com a service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep("Header de autorização não fornecido");
      return new Response(JSON.stringify({ error: 'Header de autorização não fornecido', subscribed: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    logStep("Header de autorização encontrado");

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      logStep(`Erro de autenticação: ${userError.message}`);
      return new Response(JSON.stringify({ error: `Erro de autenticação: ${userError.message}`, subscribed: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const user = userData.user;
    if (!user) {
      logStep("Usuário não autenticado");
      return new Response(JSON.stringify({ error: 'Usuário não autenticado', subscribed: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    logStep("Usuário autenticado", { userId: user.id });

    // Inicializar cliente Stripe
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
    
    // Definir estado padrão da assinatura
    let subscriptionStatus = {
      subscribed: false,
      subscription_tier: 'basic',
      subscription_end: new Date().toISOString()
    };

    // Se existir assinatura no banco, usar esses dados como fallback
    if (subscriptionData && !subscriptionError) {
      const expiresAt = new Date(subscriptionData.expires_at || subscriptionData.updated_at);
      const now = new Date();
      
      if (expiresAt > now && subscriptionData.status === 'active') {
        subscriptionStatus = {
          subscribed: true,
          subscription_tier: subscriptionData.payment_details || 'basic',
          subscription_end: subscriptionData.expires_at || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      }
      logStep("Dados de assinatura encontrados no banco", subscriptionStatus);
    } else {
      logStep("Nenhum dado de assinatura encontrado no banco ou erro ao buscar", { error: subscriptionError?.message });
    }

    // Tentar verificar no Stripe se o usuário tem email
    if (user.email) {
      try {
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
            const stripeSubscription = subscriptions.data[0];
            logStep("Assinatura Stripe encontrada", { subscriptionId: stripeSubscription.id });
            
            // Verificar produtos e preços para determinar o tier
            const items = stripeSubscription.items.data;
            if (items.length > 0) {
              const priceId = items[0].price.id;
              logStep("Preço da assinatura", { priceId });
              
              // Mapear priceId para tier (isso depende da sua configuração no Stripe)
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
          }
        } else {
          logStep("Nenhum cliente Stripe encontrado para este email");
        }
      } catch (stripeError) {
        // Não falhar a função se houver erro no Stripe, apenas log
        logStep("Erro ao verificar assinatura no Stripe", { error: stripeError.message || String(stripeError) });
      }
    }

    logStep("Retornando status de assinatura", subscriptionStatus);
    return new Response(JSON.stringify(subscriptionStatus), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[CHECK-SUBSCRIPTION ERROR] ${errorMessage}`);
    
    // Retornar um status padrão mesmo em caso de erro para evitar bloqueios no frontend
    return new Response(JSON.stringify({ 
      error: errorMessage,
      subscribed: false,
      subscription_tier: 'basic',
      subscription_end: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
