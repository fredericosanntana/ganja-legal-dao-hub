
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
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
    
    // Check the usage for today from Redis
    // First, we'll query user_chat_usage table to see current usage
    const { data: usageData, error: usageError } = await supabase
      .from("user_chat_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single();
    
    if (usageError && usageError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      throw usageError;
    }
    
    // Current usage count - default to 0 if no record exists
    const currentCount = usageData?.count || 0;
    const dailyLimit = 10;
    
    // Calculate reset time (midnight in user's local time, using UTC for now)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const resetTime = tomorrow.toISOString();
    
    return new Response(
      JSON.stringify({
        used: currentCount,
        limit: dailyLimit,
        resetTime: resetTime,
        remaining: Math.max(0, dailyLimit - currentCount)
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error checking chat limit:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to check chat limit" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
