-- Create analytics tables for cross-platform tracking

-- Analytics events table for tracking user activities across platforms
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  tenant_slug TEXT NOT NULL,
  platform_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  properties JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS analytics_events_tenant_slug_idx ON public.analytics_events(tenant_slug);
CREATE INDEX IF NOT EXISTS analytics_events_platform_id_idx ON public.analytics_events(platform_id);
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS analytics_events_timestamp_idx ON public.analytics_events(timestamp);

-- RLS policies for analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy for inserting events - anyone can insert events with their own user_id
CREATE POLICY "Users can insert their own events"
  ON public.analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR 
    user_id IS NULL
  );

-- Policy for viewing analytics - only administrators and system services can view analytics
CREATE POLICY "Admins can view analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = analytics_events.tenant_slug
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

-- Create retention analytics materialized view for quick access to retention metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_retention_metrics AS
SELECT
  platform_id,
  tenant_slug,
  date_trunc('day', timestamp) AS day,
  COUNT(DISTINCT user_id) AS total_users,
  COUNT(DISTINCT CASE 
    WHEN event_name = 'login' THEN user_id 
    ELSE NULL 
  END) AS login_users,
  COUNT(DISTINCT CASE 
    WHEN event_name = 'content_viewed' THEN user_id 
    ELSE NULL 
  END) AS content_viewers
FROM public.analytics_events
WHERE user_id IS NOT NULL
GROUP BY platform_id, tenant_slug, date_trunc('day', timestamp);

-- Create index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS user_retention_metrics_idx ON public.user_retention_metrics (platform_id, tenant_slug, day);

-- Function to refresh the retention metrics view
CREATE OR REPLACE FUNCTION refresh_retention_metrics()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_retention_metrics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh the view daily
CREATE TRIGGER refresh_retention_metrics_trigger
AFTER INSERT ON public.analytics_events
REFERENCING NEW TABLE AS inserted
FOR EACH STATEMENT
WHEN (EXISTS (
  SELECT 1 FROM inserted
  WHERE timestamp >= date_trunc('day', now())
))
EXECUTE FUNCTION refresh_retention_metrics();

-- Add reference to the analytics service in the profiles table permissions
COMMENT ON TABLE public.analytics_events IS 'Cross-platform analytics events tracking user activities across all Neothink platforms';

-- Grant necessary permissions
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT SELECT ON public.user_retention_metrics TO authenticated; 