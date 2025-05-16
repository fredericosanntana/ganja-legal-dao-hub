
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

  // Usar a service role key para operações de escrita (upsert) no Supabase
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    logStep("Função iniciada");

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY não está definido");
    logStep("Chave Stripe verificada");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Header de autorização não fornecido");
    logStep("Header de autorização encontrado");

    const token = authHeader.replace("Bearer ", "");
    logStep("Autenticando usuário com token");
    
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Erro de autenticação: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("Usuário não autenticado ou email não disponível");
    logStep("Usuário autenticado", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient()
    });
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("Nenhum cliente encontrado, atualizando estado não assinado");
      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        status: "inactive",
        payment_details: "basic",
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(), // 30 dias (assinatura básica)
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: "basic",
        expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Cliente Stripe encontrado", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "basic";
    let subscriptionEnd = new Date(Date.now() + 30*24*60*60*1000).toISOString(); // Padrão: 30 dias (assinatura básica)

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Assinatura ativa encontrada", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Determinar o tipo de assinatura com base no preço
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      if (amount <= 2000) {
        subscriptionTier = "basic";
      } else if (amount <= 5000) {
        subscriptionTier = "premium";
      } else {
        subscriptionTier = "enterprise";
      }
      
      logStep("Tipo de assinatura determinado", { priceId, amount, subscriptionTier });
    } else {
      logStep("Nenhuma assinatura ativa encontrada");
    }

    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      status: hasActiveSub ? "active" : "inactive",
      payment_details: subscriptionTier,
      started_at: hasActiveSub ? new Date().toISOString() : undefined,
      expires_at: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    logStep("Banco de dados atualizado com informações da assinatura", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERRO", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
