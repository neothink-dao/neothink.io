# Role Utility Functions

This document describes the database utility functions and frontend utils available for the Role-Based Access Control (RBAC) system.

## Database Functions

These functions are available directly from PostgreSQL to check user roles and permissions efficiently.

### Basic Role Checks

#### `user_has_role(_user_id, _role_slug, _tenant_id)`

Checks if a user has a specific role.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_role_slug` (TEXT): The role slug to check for (e.g., 'subscriber', 'partner')
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for all tenants
- **Returns:** BOOLEAN

```sql
SELECT * FROM user_has_role('123e4567-e89b-12d3-a456-426614174000', 'contributor');
```

#### `user_is_admin(_user_id, _tenant_id)`

Checks if a user has an admin role.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for all tenants
- **Returns:** BOOLEAN

```sql
SELECT * FROM user_is_admin('123e4567-e89b-12d3-a456-426614174000');
```

#### `user_has_min_role_priority(_user_id, _min_priority, _tenant_id)`

Checks if a user has a role with at least the specified priority.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_min_priority` (INTEGER): The minimum priority level required
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for all tenants
- **Returns:** BOOLEAN

```sql
-- Check if user has a role with priority 30 or higher (contributor or above)
SELECT * FROM user_has_min_role_priority('123e4567-e89b-12d3-a456-426614174000', 30);
```

### Feature and Action Checks

#### `user_can_access_feature(_user_id, _feature_name, _tenant_id)`

Checks if a user can view a specific feature.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_feature_name` (TEXT): The feature name to check access for
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for first tenant found
- **Returns:** BOOLEAN

```sql
SELECT * FROM user_can_access_feature('123e4567-e89b-12d3-a456-426614174000', 'thought_exercises');
```

#### `user_can_perform_action(_user_id, _feature_name, _action, _tenant_id)`

Checks if a user can perform a specific action on a feature.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_feature_name` (TEXT): The feature name to check
  - `_action` (TEXT): The action to check ('create', 'edit', 'delete', or 'approve')
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for first tenant found
- **Returns:** BOOLEAN

```sql
SELECT * FROM user_can_perform_action(
  '123e4567-e89b-12d3-a456-426614174000',
  'discussions',
  'create'
);
```

### Data Retrieval Functions

#### `get_user_role(_user_id, _tenant_id)`

Gets a user's role information.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for all tenants
- **Returns:** TABLE (role_id, role_name, role_slug, role_category, role_priority, tenant_id, tenant_name)

```sql
SELECT * FROM get_user_role('123e4567-e89b-12d3-a456-426614174000');
```

#### `get_user_capabilities(_user_id, _tenant_id)`

Gets a user's capabilities across features.

- **Parameters:**
  - `_user_id` (UUID): The user ID to check
  - `_tenant_id` (UUID, optional): The tenant ID to check in, or NULL for all tenants
- **Returns:** TABLE (feature_name, can_view, can_create, can_edit, can_delete, can_approve, tenant_id, tenant_name)

```sql
SELECT * FROM get_user_capabilities('123e4567-e89b-12d3-a456-426614174000');
```

## Frontend Utility Functions

These TypeScript functions in `lib/supabase/role-utils.ts` provide a simpler way to check permissions in frontend code.

### Basic Role Checks

#### `hasRole(roleSlug, tenantId?)`

```typescript
import { hasRole } from '@/lib/supabase/role-utils';

// Check if the current user has the contributor role
const isContributor = await hasRole('contributor');
```

#### `isAdmin(tenantId?)`

```typescript
import { isAdmin } from '@/lib/supabase/role-utils';

// Check if the current user is an admin
const userIsAdmin = await isAdmin();
```

#### `hasMinRolePriority(minPriority, tenantId?)`

```typescript
import { hasMinRolePriority } from '@/lib/supabase/role-utils';

// Check if user has at least contributor level access (priority 30)
const canContribute = await hasMinRolePriority(30);
```

### Feature and Action Checks

#### `canAccessFeature(featureName, tenantId?)`

```typescript
import { canAccessFeature } from '@/lib/supabase/role-utils';

// Check if user can access the discussions feature
const canAccessDiscussions = await canAccessFeature('discussions');
```

#### `canPerformAction(featureName, action, tenantId?)`

```typescript
import { canPerformAction } from '@/lib/supabase/role-utils';

// Check if user can create a discussion
const canCreateDiscussion = await canPerformAction('discussions', 'create');
```

### Data Retrieval Functions

#### `getUserRole(tenantId?)`

```typescript
import { getUserRole } from '@/lib/supabase/role-utils';

// Get the user's role details
const roleDetails = await getUserRole();
console.log(`User is a ${roleDetails?.roleName}`);
```

#### `getUserCapabilities(tenantId?)`

```typescript
import { getUserCapabilities } from '@/lib/supabase/role-utils';

// Get all capabilities for the user
const capabilities = await getUserCapabilities();
console.log('User has access to these features:', capabilities.map(c => c.featureName));
```

## React Context Hooks

The RoleContext provides React hooks for checking permissions in components.

### Client-Side (Synchronous) Hooks

These hooks use data already loaded in the context and are synchronous:

```tsx
import { useRole } from '@/lib/context/role-context';

function MyComponent() {
  const { hasRole, hasAccessTo, canPerform, isAdmin } = useRole();
  
  // Check if user is a contributor
  const isContributor = hasRole('contributor');
  
  // Check if user can view discussions
  const canViewDiscussions = hasAccessTo('discussions');
  
  // Check if user can create a discussion
  const canCreateDiscussion = canPerform('discussions', 'create');
  
  // Check if user is an admin
  if (isAdmin) {
    // Show admin features
  }
  
  return (
    // Your component JSX
  );
}
```

### Server-Side (Asynchronous) Hooks

These hooks make direct database calls and are asynchronous:

```tsx
import { useRole } from '@/lib/context/role-context';

function MyComponent() {
  const { checkRoleAsync, checkAccessAsync, checkActionAsync } = useRole();
  const [canModerate, setCanModerate] = useState(false);
  
  useEffect(() => {
    async function checkPermissions() {
      // Check if user can approve content
      const hasModeratorAccess = await checkActionAsync('discussions', 'approve');
      setCanModerate(hasModeratorAccess);
    }
    
    checkPermissions();
  }, []);
  
  return (
    // Your component JSX
  );
}
```

## The RoleGate Component

The `RoleGate` component provides a declarative way to conditionally render UI based on roles and permissions:

```tsx
import { RoleGate } from '@/lib/components/role/role-gate';

function MyPage() {
  return (
    <div>
      <h1>My Application</h1>
      
      {/* Only subscribers and above can see this */}
      <RoleGate allowedRoles={['subscriber', 'participant', 'contributor']}>
        <p>Basic content for subscribers</p>
      </RoleGate>
      
      {/* Only show to users who can access discussions */}
      <RoleGate requiredFeature="discussions">
        <DiscussionList />
      </RoleGate>
      
      {/* Only users who can create discussions see this button */}
      <RoleGate requiredFeature="discussions" requiredAction="create">
        <CreateDiscussionButton />
      </RoleGate>
      
      {/* Only admins can see this */}
      <RoleGate adminOnly>
        <AdminDashboard />
      </RoleGate>
      
      {/* Show fallback content if user doesn't have access */}
      <RoleGate 
        requiredFeature="advanced_analytics" 
        fallback={<p>Upgrade to access analytics</p>}
      >
        <AnalyticsDashboard />
      </RoleGate>
    </div>
  );
}
``` 