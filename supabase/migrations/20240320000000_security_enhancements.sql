-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create security logs table
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    context JSONB NOT NULL DEFAULT '{}',
    details JSONB NOT NULL DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    platform TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX security_logs_timestamp_idx ON public.security_logs (timestamp DESC);
CREATE INDEX security_logs_user_id_idx ON public.security_logs (user_id);
CREATE INDEX security_logs_event_type_idx ON public.security_logs (event_type);
CREATE INDEX security_logs_severity_idx ON public.security_logs (severity);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for rate limit checks
CREATE INDEX rate_limits_key_timestamp_idx ON public.rate_limits (key, timestamp DESC);

-- Add RLS policies
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow insert for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON public.security_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Only allow view for admin users
CREATE POLICY "Allow select for admin users" ON public.security_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
        )
    );

-- Rate limits can be inserted by any authenticated user
CREATE POLICY "Allow insert for authenticated users" ON public.rate_limits
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Only admins can view rate limits
CREATE POLICY "Allow select for admin users" ON public.rate_limits
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
        )
    );

-- Function to clean up old rate limits
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.rate_limits
    WHERE timestamp < now() - INTERVAL '1 day';
END;
$$;

-- Create a scheduled job to clean up old rate limits
SELECT cron.schedule(
    'clean_rate_limits',
    '0 0 * * *', -- Run at midnight every day
    $$SELECT clean_old_rate_limits();$$
);

-- Function to check if a password has been breached
CREATE OR REPLACE FUNCTION check_password_breach(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    password_hash TEXT;
    breach_count INTEGER;
BEGIN
    -- Hash the password using SHA-1 (same as HaveIBeenPwned API)
    password_hash := encode(digest(password, 'sha1'), 'hex');
    
    -- Check against breached_passwords table
    SELECT COUNT(*) INTO breach_count
    FROM breached_passwords
    WHERE hash_prefix = UPPER(LEFT(password_hash, 5))
    AND hash_suffix = UPPER(RIGHT(password_hash, 35));
    
    RETURN breach_count > 0;
END;
$$;

-- Create table for caching breached password hashes
CREATE TABLE IF NOT EXISTS public.breached_passwords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash_prefix CHAR(5) NOT NULL,
    hash_suffix CHAR(35) NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique index on hash combination
CREATE UNIQUE INDEX breached_passwords_hash_idx ON breached_passwords (hash_prefix, hash_suffix);

-- Function to update breached passwords cache
CREATE OR REPLACE FUNCTION update_breached_passwords_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Implementation will be added in a separate migration
    -- This will fetch from HaveIBeenPwned API and update the cache
    NULL;
END;
$$;

-- Create audit log function
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.security_logs (
        event_type,
        severity,
        context,
        details,
        user_id
    ) VALUES (
        CASE
            WHEN TG_OP = 'INSERT' THEN 'record_created'
            WHEN TG_OP = 'UPDATE' THEN 'record_updated'
            WHEN TG_OP = 'DELETE' THEN 'record_deleted'
        END,
        'low',
        jsonb_build_object(
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
        ),
        jsonb_build_object(
            'old_data', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
            'new_data', CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END
        ),
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$; 