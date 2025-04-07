# Role Components

This directory contains components for implementing role-based access control (RBAC) in the UI.

## RoleGate

The `RoleGate` component provides conditional rendering based on user roles and permissions.

### Basic Usage

```tsx
import { RoleGate } from '@/lib/components/role/role-gate';

function MyComponent() {
  return (
    <RoleGate allowedRoles="contributor">
      <p>This content is only visible to contributors</p>
    </RoleGate>
  );
}
```

### Props

The `RoleGate` component accepts the following props:

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Content to render if the role check passes |
| `allowedRoles` | `RoleType \| RoleType[]` | Allowed roles - user must have one of these roles to view the content |
| `requiredFeature` | `string` | Feature name to check for access (alternative to allowedRoles) |
| `requiredAction` | `'create' \| 'edit' \| 'delete' \| 'approve'` | Required action on the feature (used with requiredFeature) |
| `adminOnly` | `boolean` | If true, only admins can access the content |
| `fallback` | `React.ReactNode` | Content to show if access is denied (optional) |

### Examples

#### Check for Multiple Roles

```tsx
<RoleGate allowedRoles={['contributor', 'participant']}>
  <p>Visible to contributors and participants</p>
</RoleGate>
```

#### Admin-Only Content

```tsx
<RoleGate adminOnly>
  <AdminDashboard />
</RoleGate>
```

#### Feature-Based Access

```tsx
<RoleGate requiredFeature="analytics_dashboard">
  <AnalyticsDashboard />
</RoleGate>
```

#### Action-Based Access

```tsx
<RoleGate 
  requiredFeature="content_management" 
  requiredAction="approve"
>
  <ApproveContentButton />
</RoleGate>
```

#### With Fallback Content

```tsx
<RoleGate 
  allowedRoles="contributor" 
  fallback={<UpgradePrompt />}
>
  <ContributorFeature />
</RoleGate>
```

### Implementation Details

The `RoleGate` component uses the `useRole` hook from the role context to check if the user has the required permissions:

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
  
  // Don't render anything while roles are loading
  if (isLoading) {
    return null;
  }
  
  // Admin-only check
  if (adminOnly && !isAdmin) {
    return <>{fallback}</>;
  }
  
  // Feature access check with action
  if (requiredFeature && requiredAction) {
    return canPerform(requiredFeature, requiredAction) ? <>{children}</> : <>{fallback}</>;
  }
  
  // Feature access check without action
  if (requiredFeature) {
    return hasAccessTo(requiredFeature) ? <>{children}</> : <>{fallback}</>;
  }
  
  // Role check
  if (allowedRoles) {
    return hasRole(allowedRoles) ? <>{children}</> : <>{fallback}</>;
  }
  
  // Default: no restrictions, show the content
  return <>{children}</>;
};
```

## Extending

To create additional role-based components, follow the pattern of the `RoleGate` component and use the `useRole` hook to access role information. 