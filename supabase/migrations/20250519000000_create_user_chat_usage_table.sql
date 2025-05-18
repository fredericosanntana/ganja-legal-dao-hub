
-- Create the user_chat_usage table to track daily chat interactions
CREATE TABLE IF NOT EXISTS public.user_chat_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    usage_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT user_chat_usage_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT user_chat_usage_unique_user_date UNIQUE (user_id, usage_date)
);

-- Add row level security
ALTER TABLE public.user_chat_usage ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can only view their own usage"
    ON public.user_chat_usage FOR SELECT
    USING (auth.uid() = user_id);

-- Allow service role and admin full access
CREATE POLICY "Service role can do anything"
    ON public.user_chat_usage
    USING (true)
    WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS user_chat_usage_user_id_idx ON public.user_chat_usage(user_id);
CREATE INDEX IF NOT EXISTS user_chat_usage_date_idx ON public.user_chat_usage(usage_date);
