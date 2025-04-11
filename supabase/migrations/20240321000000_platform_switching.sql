-- Create enum for platform slugs
CREATE TYPE platform_slug AS ENUM ('hub', 'ascenders', 'neothinkers', 'immortals');

-- Create platform_states table
CREATE TABLE platform_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_slug platform_slug NOT NULL,
  state_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform_slug)
);

-- Create platform_access table
CREATE TABLE platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_slug platform_slug NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'member',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  granted_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, platform_slug)
);

-- Create user_progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform platform_slug NOT NULL,
  week_number INTEGER NOT NULL DEFAULT 1,
  last_sync TIMESTAMPTZ,
  source_platform platform_slug,
  shared_achievements TEXT[] DEFAULT '{}',
  global_level INTEGER DEFAULT 1,
  completed_features TEXT[] DEFAULT '{}',
  sync_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Add RLS policies
ALTER TABLE platform_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Platform states policies
CREATE POLICY "Users can read their own platform states"
  ON platform_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform states"
  ON platform_states FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform states"
  ON platform_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Platform access policies
CREATE POLICY "Users can read their own platform access"
  ON platform_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage platform access"
  ON platform_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        COALESCE(raw_app_meta_data->>'role', '') = 'admin'
        OR COALESCE(raw_user_meta_data->>'role', '') = 'admin'
      )
    )
  );

-- User progress policies
CREATE POLICY "Users can read their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Functions for platform switching
CREATE OR REPLACE FUNCTION sync_platform_progress(
  p_user_id UUID,
  p_from_platform platform_slug,
  p_to_platform platform_slug
) RETURNS BOOLEAN AS $$
DECLARE
  v_source_progress user_progress;
BEGIN
  -- Get source progress
  SELECT * INTO v_source_progress
  FROM user_progress
  WHERE user_id = p_user_id AND platform = p_from_platform;

  -- Update or insert target progress
  INSERT INTO user_progress (
    user_id,
    platform,
    week_number,
    last_sync,
    source_platform,
    shared_achievements,
    global_level,
    completed_features,
    sync_metadata
  ) VALUES (
    p_user_id,
    p_to_platform,
    COALESCE(v_source_progress.week_number, 1),
    now(),
    p_from_platform,
    COALESCE(v_source_progress.shared_achievements, '{}'),
    COALESCE(v_source_progress.global_level, 1),
    COALESCE(v_source_progress.completed_features, '{}'),
    jsonb_build_object(
      'last_sync_from', p_from_platform,
      'sync_timestamp', now(),
      'sync_status', 'success'
    )
  )
  ON CONFLICT (user_id, platform)
  DO UPDATE SET
    last_sync = EXCLUDED.last_sync,
    source_platform = EXCLUDED.source_platform,
    shared_achievements = EXCLUDED.shared_achievements,
    global_level = EXCLUDED.global_level,
    sync_metadata = EXCLUDED.sync_metadata,
    updated_at = now();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check platform access
CREATE OR REPLACE FUNCTION check_platform_access(
  p_user_id UUID,
  p_platform platform_slug
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM platform_access
    WHERE user_id = p_user_id
    AND platform_slug = p_platform
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_states_updated_at
  BEFORE UPDATE ON platform_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 