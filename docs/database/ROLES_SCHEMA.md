# Neothink Roles and Permissions System

## Overview

The Neothink platform implements a role-based access control (RBAC) system to manage user permissions across all platforms in the ecosystem. This document outlines the structure and implementation of this system.

## User and Admin Roles

The system defines two categories of roles:

### User Roles
- **Subscriber**: Basic access to platform content
- **Participant**: Can participate in community activities
- **Contributor**: Can contribute content and lead discussions

### Admin Roles
- **Associate**: Admin role focused on helping and support
- **Builder**: Admin role focused on building and development
- **Partner**: Admin role with funding capabilities and strategic direction

## Database Schema

The roles system is implemented using declarative schemas in Supabase, allowing for easier management and version control.

### Core Tables

#### `tenant_roles`
Defines the available roles for each tenant (platform).

```sql
create table tenant_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text not null,
  slug text not null,
  description text,
  is_system_role boolean default false,
  role_category role_category_enum default 'member',
  priority integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, slug)
);
```

#### `role_capabilities`
Defines specific permissions for each role.

```sql
create table role_capabilities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  role_slug text not null,
  feature_name text not null,
  can_view boolean default false,
  can_create boolean default false,
  can_edit boolean default false,
  can_delete boolean default false,
  can_approve boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, role_slug, feature_name)
);
```

#### `profiles`
Links users to their assigned roles.

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  tenant_id uuid references tenants(id) not null,
  role_id uuid references tenant_roles(id),
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, tenant_id)
);
```

## Role Assignment

New users are automatically assigned the `subscriber` role when they register, using a database trigger:

```sql
create or replace function set_default_role()
returns trigger as $$
declare
  subscriber_role_id uuid;
  tenant_id uuid;
begin
  -- Find the subscriber role ID for the main tenant (Neothinkers)
  select id into subscriber_role_id 
  from tenant_roles 
  where tenant_id = 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d' and slug = 'subscriber';
  
  -- Set tenant ID to Neothinkers
  tenant_id := 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d';
  
  -- Create a profile for the new user
  insert into profiles (user_id, tenant_id, role_id, display_name)
  values (new.id, tenant_id, subscriber_role_id, coalesce(new.raw_user_meta_data->>'name', new.email));
  
  return new;
end;
$$ language plpgsql security definer;
```

## Role Progression

Users can progress through roles in the following sequence:

1. Subscriber → Participant → Contributor → Associate → Builder → Partner

Administrators can upgrade a user's role through the admin interface.

## Frontend Implementation

The role system is implemented in the frontend using React Context and custom hooks:

### Role Context

```typescript
const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... implementation details
};

export const useRole = (): RoleContextProps => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
```

### Permission Checks

```typescript
// Check if user has a specific role
const hasRole = (roleCheck: RoleType | RoleType[]): boolean => {
  if (!currentRole) return false;
  
  if (Array.isArray(roleCheck)) {
    return roleCheck.includes(currentRole.slug);
  }
  
  return currentRole.slug === roleCheck;
};

// Check if user has access to a feature
const hasAccessTo = (featureName: string): boolean => {
  if (!currentRole) return false;
  return canAccessFeature(currentRole, featureName, capabilities);
};

// Check if user can perform a specific action on a feature
const canPerform = (
  featureName: string,
  action: 'create' | 'edit' | 'delete' | 'approve'
): boolean => {
  if (!currentRole) return false;
  return canPerformAction(currentRole, featureName, action, capabilities);
};
```

## UI Components

### RoleGate

A component that conditionally renders content based on user role:

```tsx
export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
  requiredFeature,
  requiredAction,
  adminOnly = false,
  fallback = null,
}) => {
  const { hasRole, hasAccessTo, canPerform, isAdmin, isLoading } = useRole();
  
  // ... implementation details
};
```

## Maintaining the Schema

The role system schema is maintained using Supabase's declarative schemas:

1. Schema definitions are stored in `supabase/schemas/` directory
2. The schema files are ordered in `supabase/config.toml`
3. New migrations can be generated using:

```bash
supabase db diff -f <migration_name>
```

## Best Practices

1. Always use the `RoleGate` component to conditionally render UI elements based on roles
2. Use the `useRole` hook to check permissions in component logic
3. Add new capabilities to the schema when adding new features
4. Keep the frontend role types in sync with the database role slugs 