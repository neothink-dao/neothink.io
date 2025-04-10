-- Migration: 20250410_ai_tables.sql
-- Description: Adds AI integration support tables and extends user profiles
-- Copyright © 2025 Neothink DAO
-- Built with ❤️ by the Neothink+ team

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- For query performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- 1. Feedback Table with enhanced status tracking
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  sentiment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'archived')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Optimized indexes
CREATE INDEX IF NOT EXISTS feedback_app_name_idx ON public.feedback(app_name);
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS feedback_status_idx ON public.feedback(status);
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_sentiment_idx ON public.feedback(sentiment);
CREATE INDEX IF NOT EXISTS feedback_content_trgm_idx ON public.feedback USING GIN (content gin_trgm_ops);

-- Enable Row-Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback table
-- Users can read/write their own feedback
CREATE POLICY feedback_user_select ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY feedback_user_insert ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY feedback_user_update ON public.feedback
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY feedback_user_delete ON public.feedback
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can read/write all feedback
CREATE POLICY feedback_admin_all ON public.feedback
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Update function for the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_updated_at_trigger
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Chat History Table with partitioning support
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  created_at TIMESTAMPTZ DEFAULT now(),
  conversation_id UUID,
  tokens_used INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table partitioning comment for future scaling
COMMENT ON TABLE public.chat_history IS 'Consider partitioning by app_name or created_at (monthly) once volume exceeds 10M rows';

-- Optimized indexes for chat history
CREATE INDEX IF NOT EXISTS chat_history_app_name_idx ON public.chat_history(app_name);
CREATE INDEX IF NOT EXISTS chat_history_user_id_idx ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS chat_history_session_id_idx ON public.chat_history(session_id);
CREATE INDEX IF NOT EXISTS chat_history_conversation_id_idx ON public.chat_history(conversation_id);
CREATE INDEX IF NOT EXISTS chat_history_created_at_idx ON public.chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_history_role_idx ON public.chat_history(role);

-- Enable Row-Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat history table
-- Users can read/write their own chat history
CREATE POLICY chat_history_user_select ON public.chat_history
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY chat_history_user_insert ON public.chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY chat_history_user_update ON public.chat_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY chat_history_user_delete ON public.chat_history
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can read all chat history but can't modify it
CREATE POLICY chat_history_admin_select ON public.chat_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 3. User Profile Extension
-- Extend auth.users with custom columns
ALTER TABLE IF EXISTS auth.users
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  ADD COLUMN IF NOT EXISTS app_subscriptions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{"chat": {"daily": 50, "monthly": 1000}}'::jsonb,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Create a view for user profiles with enhanced security
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' AS full_name,
  role,
  app_subscriptions,
  preferences,
  last_sign_in_at,
  created_at,
  updated_at
FROM auth.users;

-- Enable RLS on the view
ALTER VIEW public.user_profiles SECURITY DEFINER;
ALTER VIEW public.user_profiles SECURITY INVOKER;

-- RLS Policies for user_profiles view
CREATE POLICY user_profiles_user_select ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY user_profiles_admin_select ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 4. Realtime Publication Configuration
-- Enable replication for realtime subscriptions
BEGIN;
  -- Drop existing publication if it exists
  DROP PUBLICATION IF EXISTS ai_realtime;
  
  -- Create publication for tables that should support realtime
  CREATE PUBLICATION ai_realtime FOR TABLE
    public.feedback,
    public.chat_history;
COMMIT;

-- 5. Analytics Views for Admin Dashboard
CREATE OR REPLACE VIEW public.feedback_analytics AS
SELECT
  app_name,
  date_trunc('day', created_at) AS day,
  sentiment,
  count(*) AS feedback_count,
  status
FROM public.feedback
GROUP BY app_name, day, sentiment, status;

CREATE OR REPLACE VIEW public.chat_analytics AS
SELECT
  app_name,
  date_trunc('day', created_at) AS day,
  count(DISTINCT user_id) AS unique_users,
  count(DISTINCT session_id) AS sessions,
  sum(tokens_used) AS total_tokens,
  count(*) AS message_count
FROM public.chat_history
GROUP BY app_name, day;

-- Add comment for future sharding strategy
COMMENT ON DATABASE postgres IS 'Consider implementing application-level sharding by app_name if data volume exceeds 100GB per table'; 