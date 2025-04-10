-- Create security log table for tracking security events
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  platform_slug VARCHAR(255),
  user_id UUID,
  ip_address VARCHAR(255),
  user_agent TEXT,
  request_path TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by event type and time
CREATE INDEX IF NOT EXISTS idx_security_logs_event ON public.security_logs (event, created_at);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON public.security_logs (user_id);

-- Create index for faster queries by IP address
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON public.security_logs (ip_address);

-- Create index for faster queries by severity
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON public.security_logs (severity, created_at);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL, -- Usually IP address or user ID
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  window_seconds INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by identifier and window start
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_window ON public.rate_limits (identifier, window_start);

-- Create expiration policy to automatically remove old rate limit records
CREATE POLICY "Auto delete rate limits after 1 day" ON public.rate_limits
  USING (created_at > (NOW() - INTERVAL '1 day'));

-- Create RLS policies for these tables
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users with admin role to read security logs
CREATE POLICY "Allow admins to read security logs" ON public.security_logs
  FOR SELECT
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Allow the service role to insert into security logs
CREATE POLICY "Allow service role to insert security logs" ON public.security_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Allow the service role to manage rate limits
CREATE POLICY "Allow service role to manage rate limits" ON public.rate_limits
  USING (auth.role() = 'service_role');

-- Create function to clean up old rate limit records (can be called from a cron job)
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE created_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Comment tables and columns for documentation
COMMENT ON TABLE public.security_logs IS 'Security event logs for tracking potential security issues';
COMMENT ON TABLE public.rate_limits IS 'Rate limiting data to prevent abuse'; 