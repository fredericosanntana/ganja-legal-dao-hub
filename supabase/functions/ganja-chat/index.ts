
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Update webhook URL with the production URL
const N8N_WEBHOOK_URL = "https://n8n.dpo2u.com/webhook/85576a52-a761-4189-afc8-ea5f4d3a5974";
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
    
    // Initialize with a fallback response in case the webhook call fails
    let answer = "Esta é uma resposta de teste enquanto o serviço de processamento está sendo configurado. " +
      "Por favor, entre em contato com o suporte para mais informações sobre o assistente jurídico.";
    
    try {
      console.log("Calling n8n webhook:", N8N_WEBHOOK_URL);
      
      // Attempt to make a request to n8n webhook
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });
      
      console.log("n8n response status:", n8nResponse.status);
      
      if (n8nResponse.ok) {
        const responseText = await n8nResponse.text();
        console.log("Raw webhook response:", responseText);
        
        // Tenta converter o texto para JSON
        try {
          const n8nData = JSON.parse(responseText);
          console.log("Parsed webhook response:", n8nData);
          
          // Verifica especificamente se há um campo output (formato comum em respostas de n8n)
          if (n8nData && n8nData.output) {
            answer = n8nData.output;
          } else if (n8nData && typeof n8nData === 'object') {
            // Verificamos se há uma propriedade com a resposta
            if (n8nData.answer) {
              answer = n8nData.answer;
            } else if (n8nData.response) {
              answer = n8nData.response;
            } else if (n8nData.text) {
              answer = n8nData.text;
            } else if (n8nData.message) {
              answer = n8nData.message;
            } else if (n8nData.data) {
              // Se a resposta está em um campo data
              if (typeof n8nData.data === 'string') {
                answer = n8nData.data;
              } else if (typeof n8nData.data === 'object') {
                answer = JSON.stringify(n8nData.data);
              }
            } else {
              // Se nenhum campo esperado for encontrado
              answer = "Não foi possível processar a resposta do assistente. Por favor, tente novamente.";
            }
          } else if (typeof n8nData === 'string') {
            // Se o retorno já for uma string
            answer = n8nData;
          }
        } catch (parseError) {
          // Se não for JSON, use o texto bruto como resposta
          console.log("Response is not JSON, using raw text");
          if (responseText && responseText.trim() !== "") {
            answer = responseText;
          }
        }
      } else {
        console.error("n8n webhook returned non-OK status:", n8nResponse.status);
        try {
          const errorText = await n8nResponse.text();
          console.error("Error response body:", errorText);
        } catch (e) {
          console.error("Could not read error response body");
        }
      }
    } catch (webhookError) {
      console.error("Failed to connect to n8n webhook:", webhookError);
    }
    
    // Increment usage counter in database
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
