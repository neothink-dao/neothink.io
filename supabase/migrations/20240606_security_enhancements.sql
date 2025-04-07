-- Migration for security enhancements, database optimizations, and modern patterns
-- This implements best practices for 2025 including:
-- 1. Enhanced security with RLS policies
-- 2. Indexes for performance optimization 
-- 3. Type validation functions
-- 4. Audit logging
-- 5. Realtime broadcasts

-- First ensure the security extensions are enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create security helper functions

-- Function to verify that a user has the required permission
CREATE OR REPLACE FUNCTION has_permission(
  _user_id UUID,
  _permission TEXT,
  _tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  -- First check if user is a guardian (admin)
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = _user_id AND is_guardian = TRUE
  ) INTO has_perm;

  IF has_perm THEN
    RETURN TRUE;
  END IF;

  -- Check if user has this specific permission
  SELECT EXISTS (
    SELECT 1 FROM user_permissions up
    JOIN permissions p ON up.permission_id = p.id
    WHERE up.user_id = _user_id
    AND p.slug = _permission
    AND (_tenant_id IS NULL OR up.tenant_id IS NULL OR up.tenant_id = _tenant_id)
  ) INTO has_perm;

  IF has_perm THEN
    RETURN TRUE;
  END IF;

  -- Check if user has this permission via a role
  SELECT EXISTS (
    SELECT 1 FROM tenant_roles tr
    JOIN tenant_users tu ON tr.id = tu.tenant_role_id
    JOIN role_permissions rp ON tr.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE tu.user_id = _user_id
    AND tu.status = 'active'
    AND p.slug = _permission
    AND (_tenant_id IS NULL OR tu.tenant_id IS NULL OR tu.tenant_id = _tenant_id)
  ) INTO has_perm;

  RETURN has_perm;
END;
$$;

-- Function to get the current user's ID
CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$;

-- Function to log security relevant actions
CREATE OR REPLACE FUNCTION log_security_event(
  _action TEXT,
  _details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- Get current user ID
  _user_id := auth.current_user_id();
  
  -- Insert the log
  INSERT INTO auth_logs (
    user_id,
    action,
    ip_address,
    details
  ) VALUES (
    _user_id,
    _action,
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    _details
  );
EXCEPTION WHEN OTHERS THEN
  -- Log to Postgres log if we can't log to auth_logs
  RAISE NOTICE 'Failed to log security event: %', SQLERRM;
END;
$$;

-- Update auth_logs table with additional security-relevant fields
ALTER TABLE auth_logs 
ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info',
ADD COLUMN IF NOT EXISTS request_id UUID DEFAULT uuid_generate_v4(),
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create index for auth_logs for better query performance
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_action ON auth_logs(action);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_logs_severity ON auth_logs(severity);

-- Add realtime capabilities for auth logs for real-time monitoring
ALTER TABLE auth_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE auth_logs;

-- Setup Realtime Broadcast for notifications
CREATE OR REPLACE FUNCTION notify_new_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_notification', 
    json_build_object(
      'user_id', NEW.user_id,
      'id', NEW.id,
      'title', NEW.title,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_new_notification_trigger ON notifications;
CREATE TRIGGER notify_new_notification_trigger
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION notify_new_notification();

-- Enhance RLS policies with proper error handling

-- Update profiles table RLS with better error messages
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (id = auth.uid());

-- When we're on a specific platform, tenants can see other tenant members
DROP POLICY IF EXISTS "Platform members can view other platform members" ON profiles;
CREATE POLICY "Platform members can view other platform members" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users tu1
      JOIN tenant_users tu2 ON tu1.tenant_id = tu2.tenant_id
      WHERE tu1.user_id = auth.uid() 
      AND tu2.user_id = profiles.id
    )
  );

-- Only self can update profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_platforms ON profiles USING GIN (platforms);

-- Enhance tenant_users table
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_status ON tenant_users(status);

-- Create trigger to log tenant user changes
CREATE OR REPLACE FUNCTION log_tenant_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_security_event(
      'tenant_user_added',
      jsonb_build_object(
        'tenant_id', NEW.tenant_id,
        'user_id', NEW.user_id,
        'role', NEW.role
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      PERFORM log_security_event(
        'tenant_user_status_changed',
        jsonb_build_object(
          'tenant_id', NEW.tenant_id,
          'user_id', NEW.user_id,
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_security_event(
      'tenant_user_removed',
      jsonb_build_object(
        'tenant_id', OLD.tenant_id,
        'user_id', OLD.user_id
      )
    );
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tenant_user_audit_trigger ON tenant_users;
CREATE TRIGGER tenant_user_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON tenant_users
FOR EACH ROW EXECUTE FUNCTION log_tenant_user_changes();

-- Create a function to verify email domain for trusted sources
CREATE OR REPLACE FUNCTION is_trusted_email_domain(email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  domain TEXT;
  trusted_domains TEXT[] := ARRAY['neothink.io', 'ascenders.org', 'neothinkers.com', 'immortals.network'];
BEGIN
  domain := split_part(email, '@', 2);
  RETURN domain = ANY(trusted_domains);
END;
$$ LANGUAGE plpgsql;

-- Create a security utility function to sanitize inputs
CREATE OR REPLACE FUNCTION sanitize_input(input TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Basic sanitization - remove potentially harmful characters
  RETURN regexp_replace(input, '[<>&''"]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- Enhance password reset to prevent abuse
CREATE OR REPLACE FUNCTION rate_limit_password_reset(email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  recent_resets INT;
BEGIN
  SELECT COUNT(*) INTO recent_resets
  FROM auth_logs
  WHERE details->>'email' = email
    AND action = 'password_reset_requested'
    AND created_at > now() - interval '1 hour';
    
  RETURN recent_resets < 3;
END;
$$ LANGUAGE plpgsql;

-- Add geo-based security
CREATE OR REPLACE FUNCTION check_suspicious_login(
  user_id UUID,
  ip_address TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  last_ip TEXT;
  is_suspicious BOOLEAN := FALSE;
BEGIN
  -- Get last known IP
  SELECT details->>'ip_address' INTO last_ip
  FROM auth_logs
  WHERE user_id = check_suspicious_login.user_id
    AND action = 'login_success'
    AND created_at > now() - interval '30 days'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If IP changed and user has high privileges, flag as suspicious
  IF last_ip IS NOT NULL AND last_ip != ip_address THEN
    is_suspicious := EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND is_guardian = TRUE
    );
  END IF;
  
  RETURN is_suspicious;
END;
$$ LANGUAGE plpgsql; 