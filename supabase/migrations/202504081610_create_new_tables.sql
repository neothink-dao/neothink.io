-- Migration: 202504081610_create_new_tables.sql

-- Create table for Ascenders: flow_templates
CREATE TABLE public.flow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add policies for flow_templates
ALTER TABLE public.flow_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ascenders can access flow templates"
ON public.flow_templates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.platform_access
    WHERE user_id = auth.uid()
    AND platform_slug = 'ascenders'
  )
);

-- Create table for Neothinkers: mark_hamilton_content
CREATE TABLE public.mark_hamilton_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add policies for mark_hamilton_content
ALTER TABLE public.mark_hamilton_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Neothinkers can access Mark Hamilton content"
ON public.mark_hamilton_content FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.platform_access
    WHERE user_id = auth.uid()
    AND platform_slug = 'neothinkers'
  )
);

-- Create table for Immortals: supplements
CREATE TABLE public.supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  benefits TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add policies for supplements
ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Immortals can access supplements"
ON public.supplements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.platform_access
    WHERE user_id = auth.uid()
    AND platform_slug = 'immortals'
  )
); 