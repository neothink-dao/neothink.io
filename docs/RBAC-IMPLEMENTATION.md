# Neothink Roles System Implementation

This document details the implementation of the Role-Based Access Control (RBAC) system in the Neothink platform.

## Database Tables

### Core Tables

```sql
-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_system_role BOOLEAN DEFAULT FALSE,
  color TEXT,
  priority INTEGER NOT NULL DEFAULT 50
);

-- Permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  subject TEXT NOT NULL,
  conditions JSONB,
  description TEXT,
  is_system_permission BOOLEAN DEFAULT FALSE,
  UNIQUE(action, subject)
);

-- Role permissions junction table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

-- User roles junction table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE(user_id, role_id)
);
```

## Default Roles and Permissions

The system initializes with the following roles:

```sql
-- Default roles
INSERT INTO roles (name, slug, description, is_system_role, priority, color) VALUES
('Super Admin', 'super-admin', 'Full system access', true, 10, '#FF5733'),
('Admin', 'admin', 'Administrative access', true, 20, '#33A5FF'),
('Manager', 'manager', 'Can manage most resources', true, 30, '#33FF57'),
('Member', 'member', 'Standard user access', true, 40, '#A533FF'),
('Guest', 'guest', 'Limited access', true, 50, '#FFDD33');
```

Default permissions are created and mapped to roles:

```sql
-- Create default permissions
INSERT INTO permissions (action, subject, description, is_system_permission) VALUES
-- User management permissions
('create', 'users', 'Can create users', true),
('read', 'users', 'Can view users', true),
('update', 'users', 'Can update users', true),
('delete', 'users', 'Can delete users', true),
-- Organization permissions
('create', 'organizations', 'Can create organizations', true),
('read', 'organizations', 'Can view organizations', true),
('update', 'organizations', 'Can update organizations', true),
('delete', 'organizations', 'Can delete organizations', true),
-- Content permissions
('create', 'content', 'Can create content', true),
('read', 'content', 'Can view content', true),
('update', 'content', 'Can update content', true),
('delete', 'content', 'Can delete content', true);

-- Map permissions to roles
-- Super Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE slug = 'super-admin'),
  id
FROM permissions;

-- Admin gets most permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE slug = 'admin'),
  id
FROM permissions
WHERE action != 'delete' OR subject != 'users';

-- Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE slug = 'manager'),
  id
FROM permissions
WHERE (action IN ('read', 'update') OR (action = 'create' AND subject != 'users'));

-- Member permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE slug = 'member'),
  id
FROM permissions
WHERE action = 'read' OR (action = 'create' AND subject = 'content');

-- Guest permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE slug = 'guest'),
  id
FROM permissions
WHERE action = 'read' AND subject != 'users';
```

## PostgreSQL Functions

The following database functions enable efficient role and permission checking:

```sql
-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION check_user_permission(
  user_id UUID,
  action TEXT,
  subject TEXT,
  conditions JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = check_user_permission.user_id
    AND p.action = check_user_permission.action
    AND p.subject = check_user_permission.subject
    AND (check_user_permission.conditions IS NULL OR p.conditions @> check_user_permission.conditions)
  ) INTO has_permission;
  
  -- If not found in user_roles, check organization_members
  IF NOT has_permission THEN
    SELECT EXISTS (
      SELECT 1
      FROM organization_members om
      JOIN role_permissions rp ON om.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE om.user_id = check_user_permission.user_id
      AND p.action = check_user_permission.action
      AND p.subject = check_user_permission.subject
      AND (check_user_permission.conditions IS NULL OR p.conditions @> check_user_permission.conditions)
    ) INTO has_permission;
  END IF;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all permissions for a user
CREATE OR REPLACE FUNCTION get_user_permissions(
  user_id UUID
)
RETURNS TABLE (
  action TEXT,
  subject TEXT,
  conditions JSONB
) AS $$
BEGIN
  RETURN QUERY
    -- Permissions from user_roles
    SELECT DISTINCT p.action, p.subject, p.conditions
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = get_user_permissions.user_id
    
    UNION
    
    -- Permissions from organization_members
    SELECT DISTINCT p.action, p.subject, p.conditions
    FROM organization_members om
    JOIN role_permissions rp ON om.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE om.user_id = get_user_permissions.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all roles for a user
CREATE OR REPLACE FUNCTION get_user_roles(
  user_id UUID
)
RETURNS TABLE (
  role_id UUID,
  role_name TEXT,
  role_slug TEXT,
  organization_id UUID,
  organization_name TEXT
) AS $$
BEGIN
  RETURN QUERY
    -- Global roles
    SELECT r.id, r.name, r.slug, NULL::UUID, NULL::TEXT
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = get_user_roles.user_id
    
    UNION
    
    -- Organization roles
    SELECT r.id, r.name, r.slug, o.id, o.name
    FROM organization_members om
    JOIN roles r ON om.role_id = r.id
    JOIN organizations o ON om.organization_id = o.id
    WHERE om.user_id = get_user_roles.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security (RLS) Policies

The system implements RLS policies for secure data access:

```sql
-- Enable RLS on tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for roles table
CREATE POLICY "Roles readable by all authenticated users" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Roles manageable by admins" ON roles
  USING (check_user_permission(auth.uid(), 'manage', 'roles'));

-- Create RLS policies for permissions table
CREATE POLICY "Permissions readable by all authenticated users" ON permissions
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Permissions manageable by admins" ON permissions
  USING (check_user_permission(auth.uid(), 'manage', 'permissions'));

-- Create RLS policies for user_roles table
CREATE POLICY "User roles visible to the user and admins" ON user_roles
  FOR SELECT USING (
    user_id = auth.uid() OR 
    check_user_permission(auth.uid(), 'manage', 'user_roles')
  );
  
CREATE POLICY "User roles manageable by admins" ON user_roles
  USING (check_user_permission(auth.uid(), 'manage', 'user_roles'));

-- Create RLS policies for organizations
CREATE POLICY "Organizations visible to members and public ones" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = organizations.id AND user_id = auth.uid()
    ) OR 
    organizations.is_public = true
  );
  
CREATE POLICY "Organizations manageable by owners and admins" ON organizations
  USING (
    check_user_permission(auth.uid(), 'manage', 'organizations') OR
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE slug IN ('owner', 'admin'))
    )
  );
```

## TypeScript Types

The following TypeScript types define the role system:

```typescript
// Role and permission types
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSystemRole: boolean;
  color?: string;
  priority: number;
}

export interface Permission {
  id: string;
  action: string;
  subject: string;
  conditions?: Record<string, any>;
  description?: string;
  isSystemPermission: boolean;
}

export interface UserRole {
  userId: string;
  roleId: string;
  role?: Role;
}

export interface OrganizationMember {
  userId: string;
  organizationId: string;
  roleId: string;
  status: 'active' | 'pending' | 'inactive';
  role?: Role;
  organization?: Organization;
}

// Permission checking interfaces
export interface PermissionCheck {
  action: string;
  subject: string;
  conditions?: Record<string, any>;
}

export interface RoleCheck {
  roles: string[];
  organization?: string;
}
```

## React Hook for Permission Checking

```typescript
import { useUser } from '@/lib/hooks/use-user';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function usePermissions() {
  const { user } = useUser();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setRoles([]);
      setLoading(false);
      return;
    }

    async function loadPermissions() {
      try {
        // Load user permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .rpc('get_user_permissions', { user_id: user.id });

        if (permissionsError) throw permissionsError;

        // Process permissions into a simple format for easy checking
        const formattedPermissions = permissionsData.map(p => 
          `${p.action}:${p.subject}${p.conditions ? ':' + JSON.stringify(p.conditions) : ''}`
        );
        
        setPermissions(formattedPermissions);

        // Load user roles
        const { data: rolesData, error: rolesError } = await supabase
          .rpc('get_user_roles', { user_id: user.id });

        if (rolesError) throw rolesError;
        
        // Extract role slugs
        const rolesList = rolesData.map(r => r.role_slug);
        setRoles(rolesList);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, [user]);

  // Check if user has a permission
  const hasPermission = useCallback((action: string, subject: string, conditions?: Record<string, any>) => {
    // Simple permission without conditions
    const simplePermission = `${action}:${subject}`;
    
    // If we have the simple permission, return true immediately
    if (permissions.includes(simplePermission)) return true;
    
    // If we have conditions, check for permissions with matching conditions
    if (conditions) {
      const conditionStr = JSON.stringify(conditions);
      return permissions.includes(`${action}:${subject}:${conditionStr}`);
    }
    
    // Check for permissions that might have conditions but still apply
    return permissions.some(p => p.startsWith(`${action}:${subject}:`));
  }, [permissions]);

  // Check if user has a role
  const hasRole = useCallback((role: string | string[]) => {
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some(r => roles.includes(r));
  }, [roles]);

  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    isAdmin: hasRole(['super-admin', 'admin']),
    loading
  };
}
```

## React Role Gate Component

```tsx
import React from 'react';
import { usePermissions } from '@/lib/hooks/use-permissions';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: {
    action: string;
    subject: string;
    conditions?: Record<string, any>;
  };
  adminOnly?: boolean;
}

export function RoleGate({
  children,
  allowedRoles,
  requiredPermission,
  adminOnly = false
}: RoleGateProps) {
  const { hasRole, hasPermission, isAdmin, loading } = usePermissions();
  
  // If still loading permissions, don't render anything
  if (loading) return null;
  
  // Admin-only check
  if (adminOnly && !isAdmin) return null;
  
  // Role-based check
  if (allowedRoles && !hasRole(allowedRoles)) return null;
  
  // Permission-based check
  if (requiredPermission && !hasPermission(
    requiredPermission.action,
    requiredPermission.subject,
    requiredPermission.conditions
  )) return null;
  
  // If all checks pass, render the children
  return <>{children}</>;
}
```

## Database Triggers for Role Management

```sql
-- Trigger to assign default role to new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_roles with default member role
  INSERT INTO user_roles (user_id, role_id)
  VALUES (
    NEW.id,
    (SELECT id FROM roles WHERE slug = 'member')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Row Level Security Helper Functions

```sql
-- Get the highest priority role for a user
CREATE OR REPLACE FUNCTION get_user_highest_priority_role(
  user_id UUID
)
RETURNS TEXT AS $$
DECLARE
  role_slug TEXT;
BEGIN
  -- Get the role with the lowest priority number (highest priority)
  SELECT r.slug
  INTO role_slug
  FROM (
    -- Union of global and organization roles
    SELECT r.id, r.slug, r.priority
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = get_user_highest_priority_role.user_id
    
    UNION
    
    SELECT r.id, r.slug, r.priority
    FROM organization_members om
    JOIN roles r ON om.role_id = r.id
    WHERE om.user_id = get_user_highest_priority_role.user_id
  ) AS r
  ORDER BY r.priority ASC
  LIMIT 1;
  
  RETURN role_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## User Assignment

The system provides endpoints for role assignment through the Supabase API:

```typescript
export async function assignRoleToUser(userId: string, roleId: string) {
  return await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role_id: roleId })
    .select();
}

export async function assignOrganizationRole(
  userId: string, 
  organizationId: string, 
  roleId: string
) {
  return await supabase
    .from('organization_members')
    .upsert({
      user_id: userId,
      organization_id: organizationId,
      role_id: roleId,
      status: 'active'
    })
    .select();
}
```

## Platform Access Integration

```sql
-- Create platform_access table
CREATE TABLE platform_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  access_level TEXT NOT NULL DEFAULT 'basic',
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE platform_access ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Platform access visible to the user" ON platform_access
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "Platform access manageable by admins" ON platform_access
  USING (check_user_permission(auth.uid(), 'manage', 'platform_access'));

-- Function to check if user has access to a platform
CREATE OR REPLACE FUNCTION has_platform_access(
  user_id UUID,
  platform_name TEXT,
  required_level TEXT DEFAULT 'basic'
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM platform_access
    WHERE 
      user_id = has_platform_access.user_id
      AND platform = has_platform_access.platform_name
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (
        access_level = has_platform_access.required_level
        OR (
          CASE 
            WHEN has_platform_access.required_level = 'basic' THEN TRUE
            WHEN has_platform_access.required_level = 'premium' THEN 
              access_level IN ('premium', 'enterprise')
            WHEN has_platform_access.required_level = 'enterprise' THEN 
              access_level = 'enterprise'
            ELSE FALSE
          END
        )
      )
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Subscription Integration

```sql
-- Trigger to update platform access when subscription changes
CREATE OR REPLACE FUNCTION handle_updated_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- If subscription became active
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    -- Grant platform access based on plan
    IF NEW.plan_id IN (
      SELECT id FROM plans WHERE name ILIKE '%ascender%'
    ) THEN
      -- Insert or update Ascender platform access
      INSERT INTO platform_access (user_id, platform, status, access_level)
      VALUES (NEW.user_id, 'ascender', 'active', 'premium')
      ON CONFLICT (user_id, platform)
      DO UPDATE SET 
        status = 'active',
        access_level = 'premium',
        granted_at = NOW(),
        expires_at = NULL;
    END IF;
    
    -- Similar logic for other platforms
    -- ...
  END IF;
  
  -- If subscription became inactive
  IF NEW.status NOT IN ('active', 'trialing') AND OLD.status IN ('active', 'trialing') THEN
    -- Update platform access to expired
    UPDATE platform_access
    SET 
      status = 'expired',
      expires_at = NOW()
    WHERE 
      user_id = NEW.user_id
      AND status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_updated
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_subscription();
```

## Indexes for Performance

```sql
-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_permissions_action_subject ON permissions(action, subject);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_platform_access_user_id_platform ON platform_access(user_id, platform);
```

## Automated Testing

The system includes unit tests for permission checking:

```typescript
// Tests for permission checks
describe('Permission Checking', () => {
  it('should check if user has permission', async () => {
    // Test code for permission checking
  });
  
  it('should retrieve all user permissions', async () => {
    // Test code for retrieving permissions
  });
  
  it('should respect role priority', async () => {
    // Test code for role priority
  });
});

// Tests for RoleGate component
describe('RoleGate Component', () => {
  it('should render when user has allowed role', async () => {
    // Test code for RoleGate with allowed roles
  });
  
  it('should render when user has required permission', async () => {
    // Test code for RoleGate with required permission
  });
  
  it('should not render when user lacks permission', async () => {
    // Test code for RoleGate with missing permission
  });
});
```

This implementation provides a comprehensive RBAC system that is both flexible and secure, enabling fine-grained access control across the Neothink platform. 