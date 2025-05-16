
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@14.14.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY não está definido');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use a versão mais recente da API
  httpClient: Stripe.createFetchHttpClient(),
});

// Função auxiliar para log
const logEvent = (message: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${message}${detailsStr}`);
};

serve(async (req) => {
  // Opção CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verificar assinatura do webhook
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('Signature do Stripe não encontrada');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não está definido');
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      logEvent('Erro ao validar webhook', { error: err.message });
      return new Response(`Erro de webhook: ${err.message}`, { status: 400, headers: corsHeaders });
    }

    // Salvar o evento no banco de dados
    const { data: eventData, error: eventSaveError } = await supabase
      .from('stripe_events')
      .insert({
        id: event.id,
        type: event.type,
        object: event.data.object,
      });

    if (eventSaveError) {
      logEvent('Erro ao salvar evento no banco de dados', { error: eventSaveError });
      return new Response(JSON.stringify({ error: 'Erro ao salvar evento' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Processar com base no tipo de evento
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Verificar se este é um pagamento de assinatura
        if (session.mode === 'subscription') {
          const customerId = session.customer;
          const subscriptionId = session.subscription;
          
          logEvent('Processando assinatura concluída', { customerId, subscriptionId });

          // Obter detalhes da assinatura
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerEmail = subscription.customer_email || (await stripe.customers.retrieve(customerId)).email;
          
          if (!customerEmail) {
            throw new Error('Email do cliente não encontrado');
          }

          // Identificar o usuário baseado no email
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', customerEmail)
            .single();

          if (userError || !userData) {
            logEvent('Usuário não encontrado', { email: customerEmail, error: userError });
            throw new Error(`Usuário não encontrado para email: ${customerEmail}`);
          }

          const userId = userData.id;
          
          // Obter plano e informações de preço
          const planDetails = subscription.items.data[0].price;
          const planName = planDetails.nickname || 'premium';
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

          // Atualizar assinatura do usuário
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              status: subscription.status,
              payment_details: planName,
              started_at: new Date().toISOString(),
              expires_at: currentPeriodEnd,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

          if (subscriptionError) {
            logEvent('Erro ao atualizar assinatura', { error: subscriptionError });
            throw new Error(`Erro ao atualizar assinatura: ${subscriptionError.message}`);
          }
          
          logEvent('Assinatura atualizada com sucesso', { userId, status: subscription.status });
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        
        // Verificar se é uma fatura de assinatura
        if (invoice.subscription) {
          const customerId = invoice.customer;
          const subscriptionId = invoice.subscription;
          
          // Obter detalhes do cliente
          const customer = await stripe.customers.retrieve(customerId);
          const customerEmail = typeof customer !== 'string' ? customer.email : null;
          
          if (!customerEmail) {
            throw new Error('Email do cliente não encontrado');
          }

          // Identificar o usuário baseado no email
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', customerEmail)
            .single();

          if (userError || !userData) {
            logEvent('Usuário não encontrado', { email: customerEmail, error: userError });
            throw new Error(`Usuário não encontrado para email: ${customerEmail}`);
          }

          // Obter detalhes da assinatura
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          // Atualizar assinatura
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userData.id,
              status: 'active',
              payment_details: 'premium',
              started_at: new Date().toISOString(),
              expires_at: currentPeriodEnd,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

          if (subscriptionError) {
            logEvent('Erro ao atualizar assinatura', { error: subscriptionError });
            throw new Error(`Erro ao atualizar assinatura: ${subscriptionError.message}`);
          }
          
          logEvent('Assinatura renovada com sucesso', { userId: userData.id });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Obter detalhes do cliente
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = typeof customer !== 'string' ? customer.email : null;
        
        if (!customerEmail) {
          throw new Error('Email do cliente não encontrado');
        }

        // Identificar o usuário baseado no email
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', customerEmail)
          .single();

        if (userError || !userData) {
          logEvent('Usuário não encontrado', { email: customerEmail, error: userError });
          throw new Error(`Usuário não encontrado para email: ${customerEmail}`);
        }

        // Atualizar status da assinatura para cancelada
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userData.id,
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (subscriptionError) {
          logEvent('Erro ao cancelar assinatura', { error: subscriptionError });
          throw new Error(`Erro ao cancelar assinatura: ${subscriptionError.message}`);
        }
        
        logEvent('Assinatura cancelada com sucesso', { userId: userData.id });
        break;
      }

      // Você pode adicionar mais handlers para outros tipos de eventos conforme necessário

      default:
        logEvent(`Evento não processado: ${event.type}`);
    }

    // Marcar evento como processado
    await supabase
      .from('stripe_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('id', event.id);

    return new Response(JSON.stringify({ received: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    logEvent('Erro ao processar webhook', { error: error.message });
    
    // Salvar erro no banco de dados se possível
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );
      
      if (error.event?.id) {
        await supabase
          .from('stripe_events')
          .update({ 
            processing_error: error.message,
            processed_at: new Date().toISOString() 
          })
          .eq('id', error.event.id);
      }
    } catch (dbError) {
      // Ignorar erro ao tentar salvar o erro
    }
    
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
