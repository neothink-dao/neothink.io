# Role-Based Access Control (RBAC) System for Neothink Platforms

This document provides a comprehensive overview of the RBAC system implemented across the Neothink platforms (Hub, Ascenders, Neothinkers, and Immortals).

## Overview

The Neothink RBAC system is designed to provide consistent, secure, and flexible access control across all platforms in the ecosystem. It enables users to progress through defined roles while maintaining appropriate access boundaries.

### Core Components

1. **Database Schema** - Defined in Supabase with tables for roles, capabilities, and user profiles
2. **PostgreSQL Functions** - Server-side functions for efficient permission checking
3. **TypeScript Types** - Type definitions for roles and capabilities
4. **React Context** - Provider for role information and permission checks
5. **React Components** - UI components for conditional rendering based on roles
6. **Utility Functions** - Helper functions for role and platform management

## User Roles

The system defines a clear progression path for users:

### Member Roles
1. **Subscriber** - Basic access to platform content
2. **Participant** - Can participate in community activities
3. **Contributor** - Can contribute content and lead discussions

### Admin Roles
1. **Associate** - Admin role focused on helping and support
2. **Builder** - Admin role focused on building and development 
3. **Partner** - Admin role with funding capabilities and strategic direction

## Technical Implementation

### Database Schema

The core schema consists of:

- `tenant_roles` - Defines available roles for each platform/tenant
- `role_capabilities` - Defines feature permissions for each role
- `profiles` - Links users to roles within a specific tenant

### PostgreSQL Functions

We've implemented several database functions for efficient permission checking:

```sql
-- Check if a user has a specific role
SELECT * FROM check_user_role('user_uuid', 'contributor');

-- Check if a user can access a specific feature
SELECT * FROM check_feature_access('user_uuid', 'discussions');

-- Check if a user can perform an action on a feature
SELECT * FROM check_action_permission('user_uuid', 'discussions', 'create');
```

### TypeScript Integration

The role system is strongly typed in TypeScript:

```typescript
// Role types
export type RoleCategory = 'member' | 'admin';
export type UserRoleType = 'subscriber' | 'participant' | 'contributor';
export type AdminRoleType = 'associate' | 'builder' | 'partner';
export type RoleType = UserRoleType | AdminRoleType;

// Role interface
export interface Role {
  id: string;
  tenantId: string;
  name: string;
  slug: RoleType;
  description: string;
  isSystemRole: boolean;
  roleCategory: RoleCategory;
  priority: number;
}
```

### React Context

The `RoleProvider` provides role information and permission checks:

```tsx
// In a component:
import { useRole } from '@/lib/context/role-context';

function MyComponent() {
  const { hasRole, hasAccessTo, canPerform, isAdmin } = useRole();
  
  // Check if user has contributor role
  if (hasRole('contributor')) {
    // ...
  }
  
  // Check if user can access a feature
  if (hasAccessTo('discussions')) {
    // ...
  }
  
  // Check if user can perform an action
  if (canPerform('discussions', 'create')) {
    // ...
  }
}
```

### UI Components

The `RoleGate` component conditionally renders UI based on roles:

```tsx
<RoleGate allowedRoles={['contributor', 'partner']}>
  <ContributorContent />
</RoleGate>

<RoleGate requiredFeature="discussions" requiredAction="create">
  <CreateDiscussionButton />
</RoleGate>

<RoleGate adminOnly>
  <AdminDashboard />
</RoleGate>
```

The `MultiPlatformGate` component controls access across platforms:

```tsx
<MultiPlatformGate
  requiredPlatforms={['ascenders', 'neothinkers']}
  minRole="participant"
  requireAllPlatforms={false}
>
  <CrossPlatformContent />
</MultiPlatformGate>
```

## Cross-Platform Implementation

The RBAC system is synchronized across all platforms using:

1. **Shared Database** - All platforms connect to the same Supabase instance
2. **Synchronized Components** - The `sync:roles` script ensures all platforms have the latest implementation
3. **Platform-Specific Configuration** - Each platform has its own tenant ID and configuration

## Developer Workflow

### Adding New Roles

1. Update the schema files in `supabase/schemas/`
2. Apply the changes using the migration scripts
3. Update TypeScript types in `lib/types/roles.ts`
4. Synchronize changes across platforms with `npm run sync:roles`

### Adding New Features

1. Add the feature to `role_capabilities` table for relevant roles
2. Create UI components that use `RoleGate` for conditional rendering
3. Update documentation to reflect new capabilities

### Deploying Changes

1. Deploy database changes with migration scripts
2. Deploy frontend changes with `npm run deploy:all`

## Role Progression

Users progress through roles based on activity and contributions:

1. **Subscriber** → **Participant** - After completing onboarding and basic activity
2. **Participant** → **Contributor** - After meaningful contributions to the community
3. **Contributor** → **Associate** - Admin promotion for community leadership
4. **Associate** → **Builder** - Admin promotion for development leadership
5. **Builder** → **Partner** - Admin promotion for strategic leadership

This progression is managed through admin controls or automated based on user activity.

## Best Practices

1. **Always use RoleGate** - Never hardcode role checks in UI components
2. **Use database functions** - Leverage PostgreSQL functions for efficient permission checks
3. **Keep types in sync** - Ensure TypeScript types match database schema
4. **Test role changes** - Verify role changes function correctly before deployment
5. **Document capabilities** - Maintain clear documentation of role capabilities

## Troubleshooting

### Common Issues

1. **Permission denied errors**:
   - Check role assignments in database
   - Verify capability configuration
   - Ensure React context is properly initialized

2. **Type errors**:
   - Run `npm run sync:roles` to ensure types are synchronized
   - Check for recent schema changes not reflected in types

3. **Cross-platform inconsistencies**:
   - Run `npm run sync:roles` to synchronize components
   - Check platform-specific configurations

## Further Resources

- [Database Schema Documentation](./database/ROLES_SCHEMA.md)
- [Role Utilities Documentation](./database/ROLE_UTILS.md)
- [React Context Documentation](../lib/context/README.md)
- [Role Components Documentation](../lib/components/role/README.md) 