-- Migration: 202504081611_platform_routes_features.sql
-- This migration adds support for:
-- - Platform-specific routes and features
-- - User progress tracking across platforms
-- - Community forums
-- - Event scheduling
-- - Gamification

-- 1. Update the profiles table to add subscribed_platforms and role
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscribed_platforms TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Update the content table to add route and subroute
-- Note: The content table already has route and subroute columns from
-- the database analysis, so we don't need to add them again

-- 3. Create a user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  route TEXT NOT NULL,
  subroute TEXT,
  progress JSONB DEFAULT '{}',
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Update the discussion_topics table to add route
ALTER TABLE public.discussion_topics 
ADD COLUMN IF NOT EXISTS route TEXT;

-- 5. Create an events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  route TEXT NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 6. Create an event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create a user_points table
CREATE TABLE IF NOT EXISTS public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Apply Row Level Security (RLS) policies

-- For profiles (drop existing policies first to avoid conflicts)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- For content
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view content for subscribed platforms" ON public.content;

CREATE POLICY "Users can view content for subscribed platforms" ON public.content 
  FOR SELECT USING (
    platform = ANY(COALESCE((SELECT subscribed_platforms FROM public.profiles WHERE id = auth.uid()), ARRAY[]::TEXT[]))
    OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- For user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;

CREATE POLICY "Users can view their own progress" ON public.user_progress 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;

CREATE POLICY "Users can view their own registrations" ON public.event_registrations 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON public.event_registrations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For user_points
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own points" ON public.user_points;

CREATE POLICY "Users can view their own points" ON public.user_points 
  FOR SELECT USING (auth.uid() = user_id);

-- For events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view events for subscribed platforms" ON public.events;
DROP POLICY IF EXISTS "Admins can create events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;

CREATE POLICY "Users can view events for subscribed platforms" ON public.events 
  FOR SELECT USING (
    platform = ANY(COALESCE((SELECT subscribed_platforms FROM public.profiles WHERE id = auth.uid()), ARRAY[]::TEXT[]))
    OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can create events" ON public.events 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update events" ON public.events 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- For discussion_topics
ALTER TABLE public.discussion_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view topics for subscribed platforms" ON public.discussion_topics;
DROP POLICY IF EXISTS "Admins can manage topics" ON public.discussion_topics;

CREATE POLICY "Users can view topics for subscribed platforms" ON public.discussion_topics 
  FOR SELECT USING (
    tenant_slug = ANY(COALESCE((SELECT subscribed_platforms FROM public.profiles WHERE id = auth.uid()), ARRAY[]::TEXT[]))
    OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can manage topics" ON public.discussion_topics 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_platform_route ON public.user_progress(platform, route);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_events_platform_route ON public.events(platform, route);
CREATE INDEX IF NOT EXISTS idx_content_platform_route ON public.content(platform, route); 