
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
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Função iniciada");
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY não está definido');
    }

    // Autenticar usuário pelo token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Header de autorização não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Usar cliente Supabase com chave anônima para verificação de autenticação
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) {
      throw new Error(`Erro de autenticação: ${userError.message}`);
    }

    const user = userData.user;
    if (!user?.email) {
      throw new Error('Usuário não autenticado ou email não disponível');
    }

    logStep("Usuário autenticado", { userId: user.id, email: user.email });

    // Inicializar Stripe
    const stripe = new Stripe(stripeKey, { 
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient()
    });

    // Verificar se o cliente já existe no Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Cliente existente encontrado", { customerId });
    }

    // Calcular URL base a partir do request
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { 
              name: 'Assinatura Premium GanjaDAO', 
              description: 'Acesso completo a todos os recursos do GanjaDAO Clube'
            },
            unit_amount: 4990, // R$ 49,90
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/clube/pagamento-sucesso`,
      cancel_url: `${origin}/clube/pagamento-cancelado`,
    });

    logStep("Sessão de checkout criada", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    logStep("ERRO", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
