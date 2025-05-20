
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // SQL to update the handle_new_user function
    const updateTriggerSQL = `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $$
      BEGIN
        -- Insert into public.users
        INSERT INTO public.users (id, email, username, is_admin, password)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
          false,
          '[PROTECTED]'
        )
        ON CONFLICT (id) DO NOTHING;

        -- Insert into public.user_vote_credits
        INSERT INTO public.user_vote_credits (user_id, total_credits, last_reset_at)
        VALUES (
          NEW.id,
          100, -- Initial credits
          NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;

        -- Insert with INACTIVE subscription status
        INSERT INTO public.subscriptions (user_id, status, payment_details, started_at, expires_at)
        VALUES (
          NEW.id,
          'inactive', -- Changed from 'active' to 'inactive'
          'basic',
          NOW(),
          NOW() + INTERVAL '30 days'
        )
        ON CONFLICT (user_id) DO NOTHING;

        RETURN NEW;
      END;
      $$;
    `;

    // Execute the SQL statement
    const { error } = await supabaseAdmin.rpc("execute_sql", { query: updateTriggerSQL });
    
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "User trigger function updated successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
