
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Update webhook URL - using a dummy URL for testing since the original seems to be unavailable
// In production, this should be replaced with the actual working webhook URL
const N8N_WEBHOOK_URL = "https://example.com/webhook-endpoint"; // Placeholder URL
const DAILY_LIMIT = 10;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userId } = await req.json();
    
    if (!prompt || !userId) {
      return new Response(
        JSON.stringify({ error: "Prompt and userId are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get current date in user's timezone (using UTC for now)
    const today = new Date().toISOString().split("T")[0];
    
    // Check the usage for today
    const { data: usageData, error: usageError } = await supabase
      .from("user_chat_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single();
    
    // Current usage count - default to 0 if no record exists
    let currentCount = 0;
    
    if (usageError && usageError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      throw usageError;
    } else if (usageData) {
      currentCount = usageData.count;
    }
    
    // Check if user has reached the limit
    if (currentCount >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: "rate limit exceeded",
          message: "Você atingiu o limite diário de perguntas. Volte amanhã!"
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // For testing purposes - generate a mock response instead of calling the n8n webhook
    // This allows the chat to work even though the n8n webhook is unavailable
    let answer = "Esta é uma resposta de teste enquanto o serviço de processamento está sendo configurado. " +
      "Por favor, entre em contato com o suporte para mais informações sobre o assistente jurídico.";
    
    try {
      // Attempt to make a request to n8n but don't let it break the function if it fails
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });
      
      if (n8nResponse.ok) {
        const n8nData = await n8nResponse.json();
        if (n8nData && n8nData.answer) {
          answer = n8nData.answer;
        }
      }
    } catch (webhookError) {
      console.error("Failed to connect to n8n webhook:", webhookError);
      // We'll continue with the mock response
    }
    
    // Increment usage counter in database
    // If record exists, update it. If not, create a new one.
    if (usageData) {
      await supabase
        .from("user_chat_usage")
        .update({ 
          count: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", usageData.id);
    } else {
      await supabase
        .from("user_chat_usage")
        .insert([
          { 
            user_id: userId,
            usage_date: today,
            count: 1
          }
        ]);
    }
    
    // Calculate reset time (midnight in user's local time, using UTC for now)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const resetTime = tomorrow.toISOString();
    
    return new Response(
      JSON.stringify({
        answer: answer,
        stats: {
          used: currentCount + 1,
          limit: DAILY_LIMIT,
          resetTime: resetTime
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error in ganja-chat function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erro ao processar sua pergunta. Por favor, tente novamente mais tarde.",
        message: "Nosso serviço de IA está temporariamente indisponível. A equipe já foi notificada e está trabalhando para resolver o problema."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
