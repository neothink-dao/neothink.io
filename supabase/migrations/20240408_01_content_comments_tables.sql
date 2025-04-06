-- Migration for Content Comments System
-- Adds tables and functionality for users to comment on shared content across platforms

-- Comments table for storing user comments on content
CREATE TABLE IF NOT EXISTS public.content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  parent_id UUID REFERENCES public.content_comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false, -- For moderation purposes
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS content_comments_shared_content_id_idx ON public.content_comments(shared_content_id);
CREATE INDEX IF NOT EXISTS content_comments_user_id_idx ON public.content_comments(user_id);
CREATE INDEX IF NOT EXISTS content_comments_tenant_slug_idx ON public.content_comments(tenant_slug);
CREATE INDEX IF NOT EXISTS content_comments_parent_id_idx ON public.content_comments(parent_id);
CREATE INDEX IF NOT EXISTS content_comments_created_at_idx ON public.content_comments(created_at);

-- Comment reactions (likes, etc.)
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.content_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- 'like', 'helpful', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id, reaction_type)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS comment_reactions_comment_id_idx ON public.comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS comment_reactions_user_id_idx ON public.comment_reactions(user_id);

-- Comment moderation history
CREATE TABLE IF NOT EXISTS public.comment_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.content_comments(id) ON DELETE CASCADE,
  moderator_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'hide', 'unhide', 'mark_as_spam', etc.
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS comment_moderation_comment_id_idx ON public.comment_moderation(comment_id);

-- Enable RLS on all tables
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_moderation ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_comments

-- View policy: Anyone can view non-hidden comments
CREATE POLICY "Anyone can view non-hidden comments"
  ON public.content_comments
  FOR SELECT
  TO authenticated
  USING (
    NOT is_hidden OR
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = content_comments.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'moderator', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Insert policy: Authenticated users can create comments
CREATE POLICY "Users can create comments"
  ON public.content_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

-- Update policy: Users can edit their own comments
CREATE POLICY "Users can edit their own comments"
  ON public.content_comments
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    NOT is_deleted
  );

-- Update policy: Moderators can moderate comments
CREATE POLICY "Moderators can moderate comments"
  ON public.content_comments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = content_comments.tenant_slug
        ) AND
        tenant_users.role IN ('admin', 'moderator', 'editor')
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Delete policy: Users can soft-delete their own comments
CREATE POLICY "Users can soft-delete their own comments"
  ON public.content_comments
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
  )
  WITH CHECK (
    is_deleted = true
  );

-- RLS Policies for comment_reactions

-- View policy: Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON public.comment_reactions
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert policy: Users can add their own reactions
CREATE POLICY "Users can add their own reactions"
  ON public.comment_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

-- Delete policy: Users can remove their own reactions
CREATE POLICY "Users can remove their own reactions"
  ON public.comment_reactions
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- RLS Policies for comment_moderation

-- View policy: Only moderators can view moderation history
CREATE POLICY "Moderators can view moderation history"
  ON public.comment_moderation
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content_comments
      WHERE 
        content_comments.id = comment_moderation.comment_id AND
        (
          EXISTS (
            SELECT 1 FROM public.tenant_users
            WHERE 
              tenant_users.user_id = auth.uid() AND
              tenant_users.tenant_id IN (
                SELECT id FROM public.tenants
                WHERE tenants.slug = content_comments.tenant_slug
              ) AND
              tenant_users.role IN ('admin', 'moderator', 'editor')
          ) OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE 
              profiles.id = auth.uid() AND
              profiles.is_guardian = true
          )
        )
    )
  );

-- Insert policy: Only moderators can add moderation actions
CREATE POLICY "Moderators can add moderation actions"
  ON public.comment_moderation
  FOR INSERT
  TO authenticated
  WITH CHECK (
    moderator_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.content_comments
      WHERE 
        content_comments.id = comment_id AND
        (
          EXISTS (
            SELECT 1 FROM public.tenant_users
            WHERE 
              tenant_users.user_id = auth.uid() AND
              tenant_users.tenant_id IN (
                SELECT id FROM public.tenants
                WHERE tenants.slug = content_comments.tenant_slug
              ) AND
              tenant_users.role IN ('admin', 'moderator', 'editor')
          ) OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE 
              profiles.id = auth.uid() AND
              profiles.is_guardian = true
          )
        )
    )
  );

-- Function to get comment counts for shared content
CREATE OR REPLACE FUNCTION get_comment_count(content_id UUID, tenant_slug TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.content_comments
  WHERE 
    shared_content_id = content_id AND
    tenant_slug = tenant_slug AND
    NOT is_hidden AND
    NOT is_deleted;
$$ LANGUAGE SQL STABLE;

-- Function to get reaction counts for a comment
CREATE OR REPLACE FUNCTION get_comment_reaction_counts(comment_id UUID)
RETURNS JSONB AS $$
  SELECT jsonb_object_agg(reaction_type, count)
  FROM (
    SELECT 
      reaction_type,
      COUNT(*) as count
    FROM public.comment_reactions
    WHERE comment_id = $1
    GROUP BY reaction_type
  ) as counts;
$$ LANGUAGE SQL STABLE;

-- Trigger to update shared_content updated_at when comments are added
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.shared_content
  SET updated_at = NOW()
  WHERE id = NEW.shared_content_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_update_content_timestamp
  AFTER INSERT ON public.content_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_content_updated_at();

-- Add notification types for comments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type 
    WHERE typname = 'notification_types' 
    AND typarray = 0
  ) THEN
    ALTER TABLE public.notifications
    ALTER COLUMN type TYPE TEXT;
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.content_comments TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.comment_reactions TO authenticated;
GRANT SELECT ON public.comment_moderation TO authenticated;
GRANT INSERT ON public.comment_moderation TO authenticated;

-- Add comment fields to the notification system
COMMENT ON TABLE public.content_comments IS 'User comments on shared content across platforms';
COMMENT ON TABLE public.comment_reactions IS 'User reactions to comments';
COMMENT ON TABLE public.comment_moderation IS 'Moderation history for comments'; 