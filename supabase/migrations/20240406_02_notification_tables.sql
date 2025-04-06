-- Create notification tables for cross-platform notifications

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  platform_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_tenant_slug_idx ON public.notifications(tenant_slug);
CREATE INDEX IF NOT EXISTS notifications_platform_id_idx ON public.notifications(platform_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);

-- RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy for inserting notifications - service roles can create notifications for any user
CREATE POLICY "Service roles can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Check if the user is a service role or creating for themselves
    (auth.uid() = user_id) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Policy for reading notifications - users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Policy for updating notifications - users can only update their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Policy for deleting notifications - users can only delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Create notification settings table for user preferences
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  types_disabled TEXT[] DEFAULT '{}',
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_slug)
);

-- Create indexes for notification settings
CREATE INDEX IF NOT EXISTS notification_settings_user_id_idx ON public.notification_settings(user_id);
CREATE INDEX IF NOT EXISTS notification_settings_tenant_slug_idx ON public.notification_settings(tenant_slug);

-- RLS policies for notification settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Policy for reading notification settings - users can only see their own settings
CREATE POLICY "Users can view their own notification settings"
  ON public.notification_settings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Policy for updating notification settings - users can only update their own settings
CREATE POLICY "Users can update their own notification settings"
  ON public.notification_settings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.notifications
  WHERE expires_at < now();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to clean up expired notifications daily
CREATE TRIGGER cleanup_expired_notifications_trigger
AFTER INSERT ON public.notifications
REFERENCING NEW TABLE AS inserted
FOR EACH STATEMENT
WHEN (EXISTS (
  SELECT 1 FROM inserted
  WHERE expires_at IS NOT NULL
))
EXECUTE FUNCTION cleanup_expired_notifications();

-- Add reference to notifications table
COMMENT ON TABLE public.notifications IS 'User notifications across all Neothink platforms';
COMMENT ON TABLE public.notification_settings IS 'User notification preferences for each tenant';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, UPDATE ON public.notification_settings TO authenticated; 