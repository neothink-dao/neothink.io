-- Migration: 202504081610_update_user_journeys.sql

-- Create table for user journeys
CREATE TABLE public.user_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_platforms TEXT[] NOT NULL,
  journey_goals JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add policies for user_journeys
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own journeys"
ON public.user_journeys FOR SELECT, INSERT, UPDATE, DELETE
USING (user_id = auth.uid());

-- Create table for cross-platform preferences
CREATE TABLE public.cross_platform_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  source_platform TEXT NOT NULL,
  target_platform TEXT NOT NULL,
  exploration_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add policies for cross_platform_preferences
ALTER TABLE public.cross_platform_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own cross-platform preferences"
ON public.cross_platform_preferences FOR SELECT, INSERT, UPDATE, DELETE
USING (user_id = auth.uid());

-- Update users table to include active platforms
ALTER TABLE public.users
ADD COLUMN active_platforms TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Enable RLS and add policies for users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own data"
ON public.users FOR SELECT, UPDATE
USING (id = auth.uid()); 