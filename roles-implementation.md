# Neothink Roles System Implementation

## Overview

We have implemented a comprehensive role-based access control (RBAC) system for the Neothink platforms using Supabase's migration-based approach. This document summarizes the current implementation and outlines the system's capabilities.

## Implementation Details

### 1. Database Schema

The role system is implemented through several migrations:

- **`20240518_unified_auth_system.sql`**: Core authentication and role system
- **`20240606_role_utility_functions.sql`**: PostgreSQL functions for role management
- **`20240606_security_enhancements.sql`**: Additional security features

Key Database Objects:
- `tenant_roles`: Defines roles for each tenant
- `profiles`: Links users to roles and tenants
- `role_capabilities`: Defines what each role can do

### 2. Utility Functions

We've implemented several PostgreSQL functions for role management:

```sql
-- Check if a user has a specific role
user_has_role(_user_id UUID, _role_slug TEXT, _tenant_id UUID DEFAULT NULL)

-- Check if a user is an admin
user_is_admin(_user_id UUID, _tenant_id UUID DEFAULT NULL)

-- Check role priority level
user_has_min_role_priority(_user_id UUID, _min_priority INTEGER, _tenant_id UUID DEFAULT NULL)

-- Check feature access
user_can_access_feature(_user_id UUID, _feature_name TEXT, _tenant_id UUID DEFAULT NULL)

-- Check action permissions
user_can_perform_action(_user_id UUID, _feature_name TEXT, _action TEXT, _tenant_id UUID DEFAULT NULL)
```

### 3. TypeScript Integration

We've defined TypeScript types and hooks in:
- `lib/types/platform.ts`: Role and permission types
- `lib/hooks/useRole.ts`: Role checking hooks
- `lib/components/PlatformGate.tsx`: Role-based access control component

### 4. Security Features

- Row Level Security (RLS) policies on all tables
- Tenant isolation
- Role-based access control
- Action-based permissions (create, edit, delete, approve)

## Usage Examples

### 1. Checking Roles in SQL

```sql
-- Check if user is an admin
SELECT user_is_admin('user-uuid');

-- Check if user can access a feature
SELECT user_can_access_feature('user-uuid', 'feature-name');
```

### 2. Using in React Components

```typescript
import { PlatformGate } from '@/lib/components/PlatformGate';
import { useRole } from '@/lib/hooks/useRole';

// Using the PlatformGate component
<PlatformGate requiredRole="admin">
  <AdminPanel />
</PlatformGate>

// Using the hook
const { hasRole } = useRole();
if (hasRole('contributor')) {
  // Show contributor features
}
```

## How to Extend

To add new roles or capabilities:

1. Create a new migration file in `supabase/migrations/`
2. Update TypeScript types in `lib/types/platform.ts`
3. Update any relevant components or hooks
4. Test the changes thoroughly

## Security Considerations

1. All role checks are performed at the database level
2. Row Level Security ensures proper data isolation
3. Tenant boundaries are strictly enforced
4. All role utility functions use SECURITY DEFINER 