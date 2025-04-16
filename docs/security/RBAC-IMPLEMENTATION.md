# Role-Based Access Control (RBAC) Implementation

This document details the implementation of the Role-Based Access Control system in the Neothink platform.

## Overview

The RBAC system is designed to provide flexible, granular access control across multiple platforms while maintaining security and scalability. It implements a tenant-aware role system with feature-based capabilities and explicit permissions.

## Core Components

### Tenant Roles

Roles are defined per tenant and include system-level and custom roles. Each role has a priority level and category for hierarchical organization.

```sql
CREATE TABLE tenant_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  priority INTEGER DEFAULT 0,
  role_category TEXT DEFAULT 'member'
);
```

### Role Capabilities

Capabilities define what actions a role can perform on specific features. This provides granular, feature-level access control.

```sql
CREATE TABLE role_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  role_slug TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Permissions

Permissions represent granular access rights that can be assigned to roles.

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Role Permissions

Maps roles to permissions, enabling role-based permission inheritance.

```sql
CREATE TABLE role_permissions (
  role_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);
```

## Default System Roles

The platform includes several predefined system roles:

1. **Super Admin**
   - Full system access
   - Can manage all tenants and configurations
   - Priority: 1000

2. **Platform Admin**
   - Platform-specific administration
   - Can manage platform settings and users
   - Priority: 900

3. **Tenant Admin**
   - Tenant-level administration
   - Can manage tenant users and settings
   - Priority: 800

4. **Content Manager**
   - Content creation and management
   - Can create and edit content
   - Priority: 700

5. **Moderator**
   - Community moderation
   - Can moderate discussions and content
   - Priority: 600

6. **Member**
   - Basic platform access
   - Can access and interact with content
   - Priority: 100

## Permission Structure

Permissions follow a structured format:

```typescript
interface Permission {
  name: string;        // Human-readable name
  slug: string;        // Unique identifier
  description: string; // Detailed description
  category: string;    // Grouping category
  scope: string;       // Access scope
}
```

### Permission Categories

1. **Content Management**
   - create:content
   - edit:content
   - delete:content
   - publish:content
   - review:content

2. **User Management**
   - create:user
   - edit:user
   - delete:user
   - assign:role

3. **Platform Administration**
   - manage:settings
   - manage:features
   - view:analytics
   - manage:integrations

4. **Community Management**
   - moderate:discussions
   - manage:chat
   - create:announcement
   - pin:content

## Role Assignment

Roles are assigned through the platform_access table:

```sql
CREATE TABLE platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform_slug TEXT NOT NULL,
  access_level TEXT,
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  granted_by UUID
);
```

## Permission Checking

Permission checks are implemented through database functions:

```sql
-- Check if a user has a specific capability
CREATE OR REPLACE FUNCTION check_user_capability(
  p_user_id UUID,
  p_tenant_id UUID,
  p_feature_name TEXT,
  p_capability TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM platform_access pa
    JOIN tenant_roles tr ON pa.access_level = tr.slug
    JOIN role_capabilities rc ON tr.slug = rc.role_slug
    WHERE pa.user_id = p_user_id
    AND rc.tenant_id = p_tenant_id
    AND rc.feature_name = p_feature_name
    AND rc[p_capability] = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all capabilities for a user
CREATE OR REPLACE FUNCTION get_user_capabilities(
  p_user_id UUID,
  p_tenant_id UUID
) RETURNS TABLE (
  feature_name TEXT,
  capabilities JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.feature_name,
    jsonb_build_object(
      'can_view', rc.can_view,
      'can_create', rc.can_create,
      'can_edit', rc.can_edit,
      'can_delete', rc.can_delete,
      'can_approve', rc.can_approve
    ) as capabilities
  FROM platform_access pa
  JOIN tenant_roles tr ON pa.access_level = tr.slug
  JOIN role_capabilities rc ON tr.slug = rc.role_slug
  WHERE pa.user_id = p_user_id
  AND rc.tenant_id = p_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security (RLS)

RLS policies are implemented on all tables to enforce access control at the database level:

```sql
-- Example RLS policy for content access
ALTER TABLE content_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_access_policy ON content_modules
  FOR ALL
  USING (
    check_user_capability(auth.uid(), tenant_id, 'content', 'can_view')
  );
```

## Security Considerations

1. **Principle of Least Privilege**
   - Roles are assigned minimum required permissions
   - Capabilities are explicitly granted
   - Default deny for all actions

2. **Role Hierarchy**
   - Higher priority roles inherit lower role capabilities
   - System roles cannot be modified by tenant admins
   - Role assignments are audited

3. **Permission Scope**
   - Platform-wide permissions
   - Tenant-specific permissions
   - Feature-specific capabilities

4. **Security Functions**
   - All permission checks use SECURITY DEFINER
   - Audit logging for role changes
   - Regular permission validation

## Implementation Best Practices

1. **Role Assignment**
   - Assign roles based on user responsibilities
   - Regularly review and audit role assignments
   - Implement role expiration where appropriate

2. **Permission Management**
   - Group related permissions into roles
   - Use capability checks for feature access
   - Implement permission caching for performance

3. **Security Auditing**
   - Log all role and permission changes
   - Regular security reviews
   - Monitor permission usage patterns

4. **Performance Optimization**
   - Cache frequently used permissions
   - Optimize permission check queries
   - Use materialized views for complex role hierarchies