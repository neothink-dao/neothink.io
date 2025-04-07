# Role-Based Access Control System

This directory contains the context and hooks for implementing role-based access control (RBAC) in the Neothink platform.

## Overview

Our RBAC system provides:

1. Role-based UI rendering
2. Permission checks for features
3. Action-based permission checks (create, edit, delete, approve)
4. Admin status detection

## Files

- `role-context.tsx`: Main context provider and hook for role management
- `../components/role/role-gate.tsx`: Component for conditional rendering based on roles/permissions

## Usage

### Wrapping Your Application

The `RoleProvider` should wrap your application to provide role information to all components:

```tsx
// In your root layout
import { RoleProvider } from '@/lib/context/role-context';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
```

### Checking Roles

To check if a user has a specific role:

```tsx
import { useRole } from '@/lib/context/role-context';

function MyComponent() {
  const { hasRole, isAdmin } = useRole();
  
  if (hasRole('contributor')) {
    // Show contributor content
  }
  
  if (isAdmin) {
    // Show admin content
  }
  
  return (
    // Your component
  );
}
```

### Conditional Rendering

Use the `RoleGate` component to conditionally render UI elements:

```tsx
import { RoleGate } from '@/lib/components/role/role-gate';

function MyComponent() {
  return (
    <div>
      {/* Content visible to all users */}
      
      <RoleGate allowedRoles={['contributor', 'participant']}>
        {/* Only visible to contributors and participants */}
      </RoleGate>
      
      <RoleGate adminOnly>
        {/* Only visible to admins (associate, builder, partner) */}
      </RoleGate>
      
      <RoleGate requiredFeature="platform_analytics">
        {/* Only visible to roles with access to platform_analytics */}
      </RoleGate>
      
      <RoleGate 
        requiredFeature="content_management" 
        requiredAction="approve"
      >
        {/* Only visible to roles that can approve content */}
      </RoleGate>
    </div>
  );
}
```

### Fallback Content

You can provide fallback content for users who don't have the required role:

```tsx
<RoleGate 
  allowedRoles="contributor" 
  fallback={<p>Upgrade to contributor to access this feature</p>}
>
  <ContributorOnlyFeature />
</RoleGate>
```

## Role Progression

Our system defines the following role progression:

1. Subscriber (basic access)
2. Participant (can participate in discussions)
3. Contributor (can create content)
4. Associate (admin helper)
5. Builder (admin developer)
6. Partner (admin strategic)

See the database schema documentation for more details on the role definitions.

## Advanced Features

### Custom Feature Permissions

For fine-grained access control, check access to specific features:

```tsx
const { hasAccessTo, canPerform } = useRole();

// Check if user can view a feature
if (hasAccessTo('analytics_dashboard')) {
  // Show analytics
}

// Check if user can perform an action on a feature
if (canPerform('content_management', 'approve')) {
  // Show approval UI
}
```

### Loading State

Handle loading state while role information is being fetched:

```tsx
const { isLoading } = useRole();

if (isLoading) {
  return <LoadingSpinner />;
}
```

## Extending the System

To add new roles or features:

1. Update the database schema in `supabase/schemas/`
2. Update the TypeScript types in `lib/types/roles.ts`
3. Generate migrations using `supabase db diff`

See the full documentation in `docs/database/ROLES_SCHEMA.md` for more details. 