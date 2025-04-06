-- Migration to standardize and enhance the authentication and platform access system
-- This ensures consistent permissions, platform access, and role-based authorization

-- Create an audit_logs table to track authentication events
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  platform TEXT,
  path TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB DEFAULT '{}'
);

-- Create platform_access table for tracking platform subscriptions
CREATE TABLE IF NOT EXISTS public.platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_slug TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'full',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  granted_by UUID REFERENCES auth.users(id),
  comment TEXT,
  UNIQUE (user_id, platform_slug)
);

-- Create access_requests table for tracking platform access requests
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, tenant_id, status)
);

-- Ensure the 'platforms' array exists in profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'platforms'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN platforms TEXT[] DEFAULT '{}';
  END IF;
END
$$;

-- Ensure the 'is_guardian' column exists in profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'is_guardian'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_guardian BOOLEAN NOT NULL DEFAULT false;
  END IF;
END
$$;

-- Create function to check if a user has access to a platform
CREATE OR REPLACE FUNCTION user_has_platform_access(
  _user_id UUID,
  _platform_slug TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
  is_guardian BOOLEAN;
BEGIN
  -- Check if user is a guardian
  SELECT exists(
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND is_guardian = true
  ) INTO is_guardian;
  
  IF is_guardian THEN
    RETURN true;
  END IF;
  
  -- Check main platform_access table
  SELECT exists(
    SELECT 1 FROM public.platform_access
    WHERE
      user_id = _user_id
      AND platform_slug = _platform_slug
      AND access_level IN ('full', 'limited', 'trial')
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO has_access;
  
  -- Return early if they have platform access
  IF has_access THEN
    RETURN true;
  END IF;
  
  -- Check tenant_users table with subquery for tenant_id mapping
  SELECT exists(
    SELECT 1 FROM public.tenant_users tu
    JOIN public.tenants t ON tu.tenant_id = t.id
    WHERE
      tu.user_id = _user_id
      AND t.slug = _platform_slug
      AND tu.status = 'active'
  ) INTO has_access;
  
  -- Return early if they have tenant access
  IF has_access THEN
    RETURN true;
  END IF;
  
  -- Finally, check profiles.platforms array as last resort
  SELECT exists(
    SELECT 1 FROM public.profiles
    WHERE 
      id = _user_id
      AND _platform_slug = ANY(platforms)
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all permissions for a user in a tenant
CREATE OR REPLACE FUNCTION get_user_permissions(
  _user_id UUID,
  _tenant_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  permission_id UUID,
  permission_slug TEXT,
  permission_name TEXT,
  permission_description TEXT,
  permission_category TEXT,
  permission_scope TEXT,
  granted_via TEXT
) AS $$
DECLARE
  tenant_id UUID;
  is_guardian BOOLEAN;
BEGIN
  -- Check if user is a guardian
  SELECT exists(
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND is_guardian = true
  ) INTO is_guardian;
  
  -- If tenant slug is provided, get the tenant ID
  IF _tenant_slug IS NOT NULL THEN
    SELECT id INTO tenant_id FROM public.tenants WHERE slug = _tenant_slug;
  END IF;
  
  -- If user is a guardian, return all permissions
  IF is_guardian THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.slug,
      p.name,
      p.description,
      p.category,
      'all'::TEXT AS permission_scope,
      'guardian'::TEXT AS granted_via
    FROM public.permissions p
    WHERE
      (_tenant_slug IS NULL) OR 
      (p.tenant_id IS NULL) OR 
      (p.tenant_id = tenant_id);
    RETURN;
  END IF;
  
  -- Get permissions from the user's roles in the tenant
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.slug,
    p.name,
    p.description,
    p.category,
    CASE
      WHEN p.tenant_id IS NULL THEN 'global'
      ELSE 'tenant'
    END AS permission_scope,
    'role'::TEXT AS granted_via
  FROM
    public.permissions p
  JOIN
    public.role_permissions rp ON p.id = rp.permission_id
  JOIN
    public.tenant_roles tr ON rp.role_id = tr.id
  JOIN
    public.tenant_users tu ON tr.id = tu.tenant_role_id
  WHERE
    tu.user_id = _user_id
    AND tu.status = 'active'
    AND (_tenant_slug IS NULL OR (
      EXISTS (
        SELECT 1 FROM public.tenants t
        WHERE t.id = tu.tenant_id
        AND t.slug = _tenant_slug
      )
    ));
    
  -- Add directly granted permissions (uncommon but supported)
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.slug,
    p.name,
    p.description,
    p.category,
    CASE
      WHEN p.tenant_id IS NULL THEN 'global'
      ELSE 'tenant'
    END AS permission_scope,
    'direct'::TEXT AS granted_via
  FROM
    public.permissions p
  JOIN
    public.user_permissions up ON p.id = up.permission_id
  WHERE
    up.user_id = _user_id
    AND (_tenant_slug IS NULL OR (
      up.tenant_id IS NULL OR
      EXISTS (
        SELECT 1 FROM public.tenants t
        WHERE t.id = up.tenant_id
        AND t.slug = _tenant_slug
      )
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a procedure to grant a user access to a platform
CREATE OR REPLACE PROCEDURE grant_platform_access(
  _user_id UUID,
  _platform_slug TEXT,
  _access_level TEXT DEFAULT 'full',
  _expires_at TIMESTAMPTZ DEFAULT NULL,
  _granted_by UUID DEFAULT NULL,
  _comment TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  tenant_id UUID;
BEGIN
  -- Get tenant ID from platform slug
  SELECT id INTO tenant_id FROM public.tenants WHERE slug = _platform_slug;
  
  -- If tenant exists, add user to tenant_users
  IF tenant_id IS NOT NULL THEN
    -- Check if user already has access
    IF NOT EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE user_id = _user_id AND tenant_id = tenant_id
    ) THEN
      -- Insert new tenant_user record
      INSERT INTO public.tenant_users (
        tenant_id, 
        user_id, 
        role, 
        status
      ) VALUES (
        tenant_id, 
        _user_id, 
        'member', 
        'active'
      );
    ELSE
      -- Update existing tenant_user record
      UPDATE public.tenant_users
      SET status = 'active'
      WHERE user_id = _user_id AND tenant_id = tenant_id;
    END IF;
  END IF;
  
  -- Add platform access record
  INSERT INTO public.platform_access (
    user_id,
    platform_slug,
    access_level,
    granted_at,
    expires_at,
    granted_by,
    comment
  ) VALUES (
    _user_id,
    _platform_slug,
    _access_level,
    now(),
    _expires_at,
    _granted_by,
    _comment
  )
  ON CONFLICT (user_id, platform_slug) 
  DO UPDATE SET
    access_level = _access_level,
    expires_at = _expires_at,
    granted_by = _granted_by,
    comment = _comment;
    
  -- Ensure the platform is in the user's platforms array
  UPDATE public.profiles
  SET platforms = array_append(
    array_remove(platforms, _platform_slug),
    _platform_slug
  )
  WHERE id = _user_id;

  -- Record the action
  INSERT INTO public.auth_logs (
    user_id,
    action,
    platform,
    details
  ) VALUES (
    _user_id,
    'platform_access_granted',
    _platform_slug,
    jsonb_build_object(
      'access_level', _access_level,
      'granted_by', _granted_by,
      'expires_at', _expires_at
    )
  );
END;
$$;

-- Create a procedure to revoke a user's access to a platform
CREATE OR REPLACE PROCEDURE revoke_platform_access(
  _user_id UUID,
  _platform_slug TEXT,
  _revoked_by UUID DEFAULT NULL,
  _comment TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  tenant_id UUID;
BEGIN
  -- Get tenant ID from platform slug
  SELECT id INTO tenant_id FROM public.tenants WHERE slug = _platform_slug;
  
  -- If tenant exists, update user in tenant_users
  IF tenant_id IS NOT NULL THEN
    UPDATE public.tenant_users
    SET status = 'inactive'
    WHERE user_id = _user_id AND tenant_id = tenant_id;
  END IF;
  
  -- Remove platform access record
  DELETE FROM public.platform_access
  WHERE user_id = _user_id AND platform_slug = _platform_slug;
  
  -- Remove the platform from the user's platforms array
  UPDATE public.profiles
  SET platforms = array_remove(platforms, _platform_slug)
  WHERE id = _user_id;

  -- Record the action
  INSERT INTO public.auth_logs (
    user_id,
    action,
    platform,
    details
  ) VALUES (
    _user_id,
    'platform_access_revoked',
    _platform_slug,
    jsonb_build_object(
      'revoked_by', _revoked_by,
      'comment', _comment
    )
  );
END;
$$;

-- Create RLS policies

-- Auth logs policy
CREATE POLICY "Users can view their own auth logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Guardians can view all auth logs
CREATE POLICY "Guardians can view all auth logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_guardian = true
    )
  );

-- Platform access policy
CREATE POLICY "Users can view their own platform access"
  ON public.platform_access
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Guardians can manage platform access
CREATE POLICY "Guardians can manage platform access"
  ON public.platform_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_guardian = true
    )
  );

-- Access requests policy
CREATE POLICY "Users can view and create their own access requests"
  ON public.access_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own access requests"
  ON public.access_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Guardians can manage access requests
CREATE POLICY "Guardians can manage access requests"
  ON public.access_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_guardian = true
    )
  ); 