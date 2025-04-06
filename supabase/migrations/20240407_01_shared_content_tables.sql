-- Create shared content tables for cross-platform content management

-- Shared content table stores content that can be shared across platforms
CREATE TABLE IF NOT EXISTS public.shared_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_type TEXT NOT NULL, -- 'article', 'video', 'course', 'event', 'resource'
  primary_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(slug)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS shared_content_author_id_idx ON public.shared_content(author_id);
CREATE INDEX IF NOT EXISTS shared_content_content_type_idx ON public.shared_content(content_type);
CREATE INDEX IF NOT EXISTS shared_content_status_idx ON public.shared_content(status);
CREATE INDEX IF NOT EXISTS shared_content_published_at_idx ON public.shared_content(published_at);

-- Tenant content table links shared content to specific tenants with customizations
CREATE TABLE IF NOT EXISTS public.tenant_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  custom_title TEXT,
  custom_summary TEXT,
  custom_content JSONB,
  custom_primary_image_url TEXT,
  display_order INTEGER,
  category_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shared_content_id, tenant_slug)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS tenant_content_tenant_slug_idx ON public.tenant_content(tenant_slug);
CREATE INDEX IF NOT EXISTS tenant_content_shared_content_id_idx ON public.tenant_content(shared_content_id);
CREATE INDEX IF NOT EXISTS tenant_content_is_featured_idx ON public.tenant_content(is_featured);
CREATE INDEX IF NOT EXISTS tenant_content_is_enabled_idx ON public.tenant_content(is_enabled);
CREATE INDEX IF NOT EXISTS tenant_content_display_order_idx ON public.tenant_content(display_order);

-- Content categories for organizing content within tenants
CREATE TABLE IF NOT EXISTS public.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  tenant_slug TEXT NOT NULL,
  parent_id UUID REFERENCES public.content_categories(id),
  display_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(slug, tenant_slug)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS content_categories_tenant_slug_idx ON public.content_categories(tenant_slug);
CREATE INDEX IF NOT EXISTS content_categories_parent_id_idx ON public.content_categories(parent_id);
CREATE INDEX IF NOT EXISTS content_categories_display_order_idx ON public.content_categories(display_order);

-- Content reactions for tracking user engagement with content
CREATE TABLE IF NOT EXISTS public.content_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  reaction_type TEXT NOT NULL, -- 'like', 'bookmark', 'share'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(user_id, shared_content_id, tenant_slug, reaction_type)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS content_reactions_user_id_idx ON public.content_reactions(user_id);
CREATE INDEX IF NOT EXISTS content_reactions_shared_content_id_idx ON public.content_reactions(shared_content_id);
CREATE INDEX IF NOT EXISTS content_reactions_tenant_slug_idx ON public.content_reactions(tenant_slug);
CREATE INDEX IF NOT EXISTS content_reactions_reaction_type_idx ON public.content_reactions(reaction_type);

-- Create type for content view sources
CREATE TYPE public.view_source AS ENUM ('feed', 'search', 'recommendation', 'direct', 'external', 'email', 'other');

-- Content views for tracking content performance
CREATE TABLE IF NOT EXISTS public.content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_source public.view_source NOT NULL DEFAULT 'other',
  session_id TEXT,
  duration_seconds INTEGER,
  read_percentage INTEGER CHECK (read_percentage >= 0 AND read_percentage <= 100),
  device_info JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS content_views_shared_content_id_idx ON public.content_views(shared_content_id);
CREATE INDEX IF NOT EXISTS content_views_tenant_slug_idx ON public.content_views(tenant_slug);
CREATE INDEX IF NOT EXISTS content_views_user_id_idx ON public.content_views(user_id);
CREATE INDEX IF NOT EXISTS content_views_view_date_idx ON public.content_views(view_date);

-- RLS policies for shared_content
ALTER TABLE public.shared_content ENABLE ROW LEVEL SECURITY;

-- Policy for selecting shared content - published content is visible to all, drafts only to authors and admins
CREATE POLICY "Published content is visible to all authenticated users"
  ON public.shared_content
  FOR SELECT
  TO authenticated
  USING (
    status = 'published' OR
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for inserting content - authenticated users can create content
CREATE POLICY "Users can create their own content"
  ON public.shared_content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
  );

-- Policy for updating content - only authors and guardians can update content
CREATE POLICY "Authors and guardians can update content"
  ON public.shared_content
  FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for deleting content - only authors and guardians can delete content
CREATE POLICY "Authors and guardians can delete content"
  ON public.shared_content
  FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS policies for tenant_content
ALTER TABLE public.tenant_content ENABLE ROW LEVEL SECURITY;

-- Policy for selecting tenant content - accessible to users with access to that tenant
CREATE POLICY "Users can view tenant content they have access to"
  ON public.tenant_content
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = tenant_content.tenant_slug
        )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for inserting tenant content - users must have admin roles
CREATE POLICY "Tenant admins can create tenant content"
  ON public.tenant_content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = tenant_content.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for updating tenant content - users must have admin roles
CREATE POLICY "Tenant admins can update tenant content"
  ON public.tenant_content
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = tenant_content.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for deleting tenant content - users must have admin roles
CREATE POLICY "Tenant admins can delete tenant content"
  ON public.tenant_content
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = tenant_content.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS policies for content_categories
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

-- Policy for selecting categories - accessible to authenticated users
CREATE POLICY "Users can view content categories"
  ON public.content_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for inserting categories - users must have admin roles for that tenant
CREATE POLICY "Tenant admins can create categories"
  ON public.content_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = content_categories.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for updating categories - users must have admin roles for that tenant
CREATE POLICY "Tenant admins can update categories"
  ON public.content_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = content_categories.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for deleting categories - users must have admin roles for that tenant
CREATE POLICY "Tenant admins can delete categories"
  ON public.content_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = content_categories.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- RLS policies for content_reactions
ALTER TABLE public.content_reactions ENABLE ROW LEVEL SECURITY;

-- Policy for selecting reactions - users can see all reactions
CREATE POLICY "Users can view all reactions"
  ON public.content_reactions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for inserting reactions - users can only add their own reactions
CREATE POLICY "Users can create their own reactions"
  ON public.content_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

-- Policy for updating reactions - users can only update their own reactions
CREATE POLICY "Users can update their own reactions"
  ON public.content_reactions
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- Policy for deleting reactions - users can only delete their own reactions
CREATE POLICY "Users can delete their own reactions"
  ON public.content_reactions
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- RLS policies for content_views
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;

-- Policy for selecting views - admins can see all views
CREATE POLICY "Admins can view content views"
  ON public.content_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = content_views.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'analyst')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for inserting views - authenticated users can record views
CREATE POLICY "Authenticated users can create views"
  ON public.content_views
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
  );

-- Add comments to tables
COMMENT ON TABLE public.shared_content IS 'Content that can be shared across all Neothink platforms';
COMMENT ON TABLE public.tenant_content IS 'Platform-specific customizations for shared content';
COMMENT ON TABLE public.content_categories IS 'Categories for organizing content within each platform';
COMMENT ON TABLE public.content_reactions IS 'User reactions to content (likes, bookmarks, etc.)';
COMMENT ON TABLE public.content_views IS 'Content view tracking for analytics';

-- Create content analytics view
CREATE OR REPLACE VIEW public.content_performance_summary AS
WITH content_stats AS (
  SELECT
    sc.id AS content_id,
    sc.title,
    sc.content_type,
    tc.tenant_slug,
    COUNT(DISTINCT cv.id) AS total_views,
    COUNT(DISTINCT cv.user_id) AS unique_viewers,
    COUNT(DISTINCT CASE WHEN cr.reaction_type = 'like' THEN cr.id END) AS total_likes,
    COUNT(DISTINCT CASE WHEN cr.reaction_type = 'bookmark' THEN cr.id END) AS total_bookmarks,
    COUNT(DISTINCT CASE WHEN cr.reaction_type = 'share' THEN cr.id END) AS total_shares,
    AVG(COALESCE(cv.duration_seconds, 0)) AS avg_view_duration,
    AVG(COALESCE(cv.read_percentage, 0)) AS avg_read_percentage,
    tc.is_featured,
    tc.is_enabled
  FROM public.shared_content sc
  JOIN public.tenant_content tc ON sc.id = tc.shared_content_id
  LEFT JOIN public.content_views cv ON sc.id = cv.shared_content_id AND tc.tenant_slug = cv.tenant_slug
  LEFT JOIN public.content_reactions cr ON sc.id = cr.shared_content_id AND tc.tenant_slug = cr.tenant_slug
  WHERE sc.status = 'published'
  GROUP BY sc.id, sc.title, sc.content_type, tc.tenant_slug, tc.is_featured, tc.is_enabled
)
SELECT
  content_id,
  title,
  content_type,
  tenant_slug,
  total_views,
  unique_viewers,
  total_likes,
  total_bookmarks,
  total_shares,
  avg_view_duration,
  avg_read_percentage,
  is_featured,
  is_enabled,
  CASE
    WHEN total_views > 0 THEN (total_likes::float / total_views) * 100
    ELSE 0
  END AS like_rate,
  CASE
    WHEN unique_viewers > 0 THEN (total_bookmarks::float / unique_viewers) * 100
    ELSE 0
  END AS bookmark_rate,
  CASE
    WHEN total_views > 0 THEN (total_shares::float / total_views) * 100
    ELSE 0
  END AS share_rate
FROM content_stats;

-- Grant permissions
GRANT SELECT ON public.shared_content TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.shared_content TO authenticated;

GRANT SELECT ON public.tenant_content TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tenant_content TO authenticated;

GRANT SELECT ON public.content_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_categories TO authenticated;

GRANT SELECT ON public.content_reactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_reactions TO authenticated;

GRANT SELECT ON public.content_views TO authenticated;
GRANT INSERT ON public.content_views TO authenticated;

GRANT SELECT ON public.content_performance_summary TO authenticated; 