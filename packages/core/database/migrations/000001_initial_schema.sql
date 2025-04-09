-- Initial schema for Neothink monorepo
-- Following the Supabase Launch Week 14 declarative schema approach

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_ascender BOOLEAN DEFAULT FALSE,
  is_neothinker BOOLEAN DEFAULT FALSE,
  is_immortal BOOLEAN DEFAULT FALSE,
  is_guardian BOOLEAN DEFAULT FALSE,
  guardian_since TIMESTAMP WITH TIME ZONE,
  subscription_status TEXT,
  subscription_tier TEXT,
  subscription_period_start TIMESTAMP WITH TIME ZONE,
  subscription_period_end TIMESTAMP WITH TIME ZONE,
  platforms TEXT[] DEFAULT '{}'::TEXT[],
  subscribed_platforms TEXT[] DEFAULT '{}'::TEXT[],
  role TEXT DEFAULT 'user'::TEXT
);

-- Create content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  published BOOLEAN DEFAULT FALSE,
  app TEXT NOT NULL CHECK (app IN ('hub', 'ascenders', 'neothinkers', 'immortals')),
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'course', 'exercise', 'quiz')),
  tags TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, content_id)
);

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('hub', 'ascenders', 'neothinkers', 'immortals')),
  name TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  points INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create user_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  UNIQUE (user_id, achievement_id)
);

-- Create analytics_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('hub', 'ascenders', 'neothinkers', 'immortals')),
  properties JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create rate_limits table for rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  identifier TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  window_seconds INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create index on rate_limits for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_window
ON public.rate_limits (identifier, window_start);

-- Row Level Security setup

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Content RLS policies
DROP POLICY IF EXISTS "Content is viewable by everyone with access" ON public.content;
DROP POLICY IF EXISTS "Admins can manage all content" ON public.content;

CREATE POLICY "Content is viewable by everyone with access" 
ON public.content FOR SELECT USING (
  published = true OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can manage all content" 
ON public.content FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Progress RLS policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.progress;

CREATE POLICY "Users can view their own progress" 
ON public.progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.progress FOR UPDATE USING (auth.uid() = user_id);

-- Achievements RLS policies
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;

CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" 
ON public.achievements FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- User Achievements RLS policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "System can insert user achievements" ON public.user_achievements;

CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements" 
ON public.user_achievements FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Analytics Events RLS policies
DROP POLICY IF EXISTS "Users can insert events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.analytics_events;

CREATE POLICY "Users can insert events" 
ON public.analytics_events FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

CREATE POLICY "Admins can view all events" 
ON public.analytics_events FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Rate Limits RLS policies (only accessible by service role)
DROP POLICY IF EXISTS "Admins can manage rate limits" ON public.rate_limits;

CREATE POLICY "Admins can manage rate limits" 
ON public.rate_limits FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_is_limited BOOLEAN;
BEGIN
  -- Calculate the start of the current window
  v_window_start := timezone('utc'::text, now()) - (p_window_seconds || ' seconds')::INTERVAL;
  
  -- Delete old rate limit records (housekeeping)
  DELETE FROM public.rate_limits
  WHERE window_start < v_window_start - INTERVAL '1 day';
  
  -- Count requests in the current window
  SELECT SUM(count) INTO v_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
  AND window_start >= v_window_start;
  
  v_count := COALESCE(v_count, 0);
  
  -- Check if rate limited
  v_is_limited := v_count >= p_max_requests;
  
  -- If not rate limited, record this request
  IF NOT v_is_limited THEN
    -- Check for an existing record in this window to update
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE identifier = p_identifier
    AND window_start >= v_window_start
    AND window_start <= timezone('utc'::text, now());
    
    -- If no record was updated, insert a new one
    IF NOT FOUND THEN
      INSERT INTO public.rate_limits (
        identifier, 
        count, 
        window_start, 
        window_seconds
      ) VALUES (
        p_identifier,
        1,
        timezone('utc'::text, now()),
        p_window_seconds
      );
    END IF;
  END IF;
  
  RETURN v_is_limited;
END;
$$; 