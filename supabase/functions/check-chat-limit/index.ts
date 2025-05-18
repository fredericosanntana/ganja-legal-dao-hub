
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DAILY_LIMIT = 10; // Same as in ganja-chat function

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
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
    
    let currentCount = 0;
    
    try {
      // Check the usage for today
      const { data, error } = await supabase
        .from("user_chat_usage")
        .select("count")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .single();
      
      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        throw error;
      }
      
      if (data) {
        currentCount = data.count;
      }
    } catch (dbError) {
      console.error("Error checking chat limit:", dbError);
      // Continue with count=0 so the user can still use the chat
    }
    
    // Calculate reset time (midnight in user's local time, using UTC for now)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const resetTime = tomorrow.toISOString();
    
    return new Response(
      JSON.stringify({
        used: currentCount,
        limit: DAILY_LIMIT,
        resetTime: resetTime
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error in check-chat-limit function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Error checking chat limit",
        used: 0,
        limit: DAILY_LIMIT
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
