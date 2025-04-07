-- Role Utility Functions
-- This migration adds PostgreSQL functions for checking user roles and permissions

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION user_has_role(
  _user_id UUID,
  _role_slug TEXT,
  _tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_role BOOLEAN;
BEGIN
  IF _tenant_id IS NULL THEN
    -- Check across all tenants
    SELECT EXISTS (
      SELECT 1 FROM profiles p
      JOIN tenant_roles tr ON p.role_id = tr.id
      WHERE 
        p.user_id = _user_id AND
        tr.slug = _role_slug
    ) INTO has_role;
  ELSE
    -- Check for specific tenant
    SELECT EXISTS (
      SELECT 1 FROM profiles p
      JOIN tenant_roles tr ON p.role_id = tr.id
      WHERE 
        p.user_id = _user_id AND
        p.tenant_id = _tenant_id AND
        tr.slug = _role_slug
    ) INTO has_role;
  END IF;
  
  RETURN has_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION user_is_admin(
  _user_id UUID,
  _tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  IF _tenant_id IS NULL THEN
    -- Check across all tenants
    SELECT EXISTS (
      SELECT 1 FROM profiles p
      JOIN tenant_roles tr ON p.role_id = tr.id
      WHERE 
        p.user_id = _user_id AND
        tr.role_category = 'admin'
    ) INTO is_admin;
  ELSE
    -- Check for specific tenant
    SELECT EXISTS (
      SELECT 1 FROM profiles p
      JOIN tenant_roles tr ON p.role_id = tr.id
      WHERE 
        p.user_id = _user_id AND
        p.tenant_id = _tenant_id AND
        tr.role_category = 'admin'
    ) INTO is_admin;
  END IF;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user has a certain role priority or higher
CREATE OR REPLACE FUNCTION user_has_min_role_priority(
  _user_id UUID,
  _min_priority INTEGER,
  _tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_priority BOOLEAN;
BEGIN
  IF _tenant_id IS NULL THEN
    -- Check across all tenants
    SELECT EXISTS (
      SELECT 1 FROM profiles p
      JOIN tenant_roles tr ON p.role_id = tr.id
      WHERE 
        p.user_id = _user_id AND
        tr.priority >= _min_priority
    ) INTO has_priority;
  ELSE
    -- Check for specific tenant
    SELECT EXISTS (
      SELECT 1 FROM profiles p
      JOIN tenant_roles tr ON p.role_id = tr.id
      WHERE 
        p.user_id = _user_id AND
        p.tenant_id = _tenant_id AND
        tr.priority >= _min_priority
    ) INTO has_priority;
  END IF;
  
  RETURN has_priority;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user has access to a feature
CREATE OR REPLACE FUNCTION user_can_access_feature(
  _user_id UUID,
  _feature_name TEXT,
  _tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  tenant_id UUID;
  role_slug TEXT;
  can_access BOOLEAN;
BEGIN
  -- Get user's tenant and role
  IF _tenant_id IS NULL THEN
    -- Use the first tenant found (most common case)
    SELECT p.tenant_id, tr.slug 
    INTO tenant_id, role_slug
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    WHERE p.user_id = _user_id
    LIMIT 1;
  ELSE
    -- Use specified tenant
    SELECT p.tenant_id, tr.slug 
    INTO tenant_id, role_slug
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    WHERE 
      p.user_id = _user_id AND
      p.tenant_id = _tenant_id
    LIMIT 1;
  END IF;
  
  -- Check if role has access to feature
  SELECT EXISTS (
    SELECT 1 FROM role_capabilities rc
    WHERE 
      rc.tenant_id = tenant_id AND
      rc.role_slug = role_slug AND
      rc.feature_name = _feature_name AND
      rc.can_view = true
  ) INTO can_access;
  
  RETURN can_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user can perform an action on a feature
CREATE OR REPLACE FUNCTION user_can_perform_action(
  _user_id UUID,
  _feature_name TEXT,
  _action TEXT, -- 'create', 'edit', 'delete', or 'approve'
  _tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  tenant_id UUID;
  role_slug TEXT;
  can_perform BOOLEAN := false;
BEGIN
  -- Get user's tenant and role
  IF _tenant_id IS NULL THEN
    -- Use the first tenant found (most common case)
    SELECT p.tenant_id, tr.slug 
    INTO tenant_id, role_slug
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    WHERE p.user_id = _user_id
    LIMIT 1;
  ELSE
    -- Use specified tenant
    SELECT p.tenant_id, tr.slug 
    INTO tenant_id, role_slug
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    WHERE 
      p.user_id = _user_id AND
      p.tenant_id = _tenant_id
    LIMIT 1;
  END IF;
  
  -- Check if role can perform action on feature
  IF _action = 'create' THEN
    SELECT EXISTS (
      SELECT 1 FROM role_capabilities rc
      WHERE 
        rc.tenant_id = tenant_id AND
        rc.role_slug = role_slug AND
        rc.feature_name = _feature_name AND
        rc.can_create = true
    ) INTO can_perform;
  ELSIF _action = 'edit' THEN
    SELECT EXISTS (
      SELECT 1 FROM role_capabilities rc
      WHERE 
        rc.tenant_id = tenant_id AND
        rc.role_slug = role_slug AND
        rc.feature_name = _feature_name AND
        rc.can_edit = true
    ) INTO can_perform;
  ELSIF _action = 'delete' THEN
    SELECT EXISTS (
      SELECT 1 FROM role_capabilities rc
      WHERE 
        rc.tenant_id = tenant_id AND
        rc.role_slug = role_slug AND
        rc.feature_name = _feature_name AND
        rc.can_delete = true
    ) INTO can_perform;
  ELSIF _action = 'approve' THEN
    SELECT EXISTS (
      SELECT 1 FROM role_capabilities rc
      WHERE 
        rc.tenant_id = tenant_id AND
        rc.role_slug = role_slug AND
        rc.feature_name = _feature_name AND
        rc.can_approve = true
    ) INTO can_perform;
  END IF;
  
  RETURN can_perform;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role in a tenant
CREATE OR REPLACE FUNCTION get_user_role(
  _user_id UUID,
  _tenant_id UUID DEFAULT NULL
)
RETURNS TABLE (
  role_id UUID,
  role_name TEXT,
  role_slug TEXT,
  role_category TEXT,
  role_priority INTEGER,
  tenant_id UUID,
  tenant_name TEXT
) AS $$
BEGIN
  IF _tenant_id IS NULL THEN
    -- Return roles across all tenants
    RETURN QUERY
    SELECT 
      tr.id AS role_id,
      tr.name AS role_name,
      tr.slug AS role_slug,
      tr.role_category::TEXT,
      tr.priority,
      t.id,
      t.name
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    JOIN tenants t ON p.tenant_id = t.id
    WHERE p.user_id = _user_id;
  ELSE
    -- Return role for specific tenant
    RETURN QUERY
    SELECT 
      tr.id AS role_id,
      tr.name AS role_name,
      tr.slug AS role_slug,
      tr.role_category::TEXT,
      tr.priority,
      t.id,
      t.name
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    JOIN tenants t ON p.tenant_id = t.id
    WHERE 
      p.user_id = _user_id AND
      p.tenant_id = _tenant_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's capabilities in a tenant
CREATE OR REPLACE FUNCTION get_user_capabilities(
  _user_id UUID,
  _tenant_id UUID DEFAULT NULL
)
RETURNS TABLE (
  feature_name TEXT,
  can_view BOOLEAN,
  can_create BOOLEAN,
  can_edit BOOLEAN,
  can_delete BOOLEAN,
  can_approve BOOLEAN,
  tenant_id UUID,
  tenant_name TEXT
) AS $$
BEGIN
  IF _tenant_id IS NULL THEN
    -- Return capabilities across all tenants
    RETURN QUERY
    SELECT 
      rc.feature_name,
      rc.can_view,
      rc.can_create,
      rc.can_edit,
      rc.can_delete,
      rc.can_approve,
      t.id,
      t.name
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    JOIN role_capabilities rc ON tr.slug = rc.role_slug AND p.tenant_id = rc.tenant_id
    JOIN tenants t ON p.tenant_id = t.id
    WHERE p.user_id = _user_id;
  ELSE
    -- Return capabilities for specific tenant
    RETURN QUERY
    SELECT 
      rc.feature_name,
      rc.can_view,
      rc.can_create,
      rc.can_edit,
      rc.can_delete,
      rc.can_approve,
      t.id,
      t.name
    FROM profiles p
    JOIN tenant_roles tr ON p.role_id = tr.id
    JOIN role_capabilities rc ON tr.slug = rc.role_slug AND p.tenant_id = rc.tenant_id
    JOIN tenants t ON p.tenant_id = t.id
    WHERE 
      p.user_id = _user_id AND
      p.tenant_id = _tenant_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 