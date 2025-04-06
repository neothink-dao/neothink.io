# Cross-Platform Features Documentation

## Overview

The Neothink ecosystem consists of four distinct platforms, each with unique purposes but sharing common functionality. This document outlines the cross-platform features that are implemented consistently across all platforms.

## Shared Architecture

All Neothink platforms are built with:

- **Next.js**: For server-side rendering and optimized performance
- **React**: For component-based UI
- **Supabase**: For authentication, database, storage, and realtime subscriptions
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For consistent, utility-first styling

## Core Cross-Platform Services

### 1. Authentication & User Management

The `CrossPlatformAuth` component and related utilities provide a unified authentication system:

- Single sign-on across all platforms
- Consistent login/signup flow
- Tenant-specific user roles and permissions
- Profile management that persists across platforms

```tsx
import { CrossPlatformAuth } from '@lib/shared';

// In your component
<CrossPlatformAuth 
  mode="signin" 
  tenantSlug="ascenders" 
  redirectTo="/dashboard" 
/>
```

### 2. Permission System

The permission system ensures proper access control:

- Role-based permissions at the tenant level
- Flexible permission inheritance
- Guardian role for system-wide admin access
- Component-level access control

```tsx
import { PermissionGate } from '@lib/shared';

// In your component
<PermissionGate permission="content:create">
  <CreateContentButton />
</PermissionGate>
```

### 3. Analytics Service

The analytics service tracks user behavior consistently:

- Unified event tracking across platforms
- Tenant-specific analytics
- Platform-specific analytics
- User journey tracking

```tsx
// Server-side tracking
import { trackEvent } from '@lib/shared';

await trackEvent({
  event_name: 'page_view',
  tenant_slug: 'ascenders',
  platform_id: 'ascenders',
  user_id: user.id,
  properties: { page_path: '/dashboard' }
});

// Client-side tracking with hook
import { useAnalytics } from '@lib/shared';

function MyComponent() {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard');
  }, []);
  
  // ...
}
```

### 4. Notification System

The notification system provides consistent messaging to users:

- In-app notifications
- Email notifications (optional)
- Push notifications (optional)
- Preference management

```tsx
// Server-side notifications
import { createNotification } from '@lib/shared';

await createNotification({
  userId: user.id,
  tenantSlug: 'ascenders',
  platformId: 'ascenders',
  title: 'Welcome!',
  message: 'Thanks for joining Ascenders.',
  type: 'info',
  target: 'in_app'
});

// Client-side notifications with hook
import { useNotifications } from '@lib/shared';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // ...render notification bell with unread count
}
```

### 5. Tenant-Aware Data Access

The `useTenantQuery` hook ensures proper data isolation between tenants:

- Automatic tenant filtering
- Consistent data access patterns
- RLS policy enforcement
- Shared content access control

```tsx
import { useTenantQuery } from '@lib/shared';

function TenantContent() {
  const { tenantQuery } = useTenantQuery();
  const [content, setContent] = useState([]);
  
  useEffect(() => {
    async function loadContent() {
      const { data } = await tenantQuery
        .from('content_modules')
        .select('*');
      
      setContent(data || []);
    }
    
    loadContent();
  }, [tenantQuery]);
  
  // ...
}
```

### 6. Cross-Platform Navigation

The `PlatformSwitcher` component enables seamless navigation between platforms:

- Consistent UI for switching platforms
- Permission-based platform access
- Tenant context preservation
- Deep linking between platforms

```tsx
import { PlatformSwitcher } from '@lib/shared';

// In your header component
<header>
  <Logo />
  <MainNavigation />
  <PlatformSwitcher />
</header>
```

### 7. Theming System

The `ThemeProvider` ensures consistent branding with platform-specific customization:

- Platform-specific colors and styling
- Tenant-specific overrides
- Dark mode support
- Consistent component styling

```tsx
import { ThemeProvider, useTheme } from '@lib/shared';

// At app root
<ThemeProvider platformOverride="ascenders">
  <App />
</ThemeProvider>

// In a component
function ThemedButton() {
  const { colors } = useTheme();
  
  return (
    <button
      style={{ backgroundColor: colors.primaryColor }}
    >
      Click me
    </button>
  );
}
```

## Database Schema

The multi-tenant architecture is supported by these key tables:

- **tenants**: Basic tenant information
- **tenant_users**: Maps users to tenants with roles
- **tenant_roles**: Custom roles for each tenant
- **permissions**: Available system permissions
- **role_permissions**: Maps permissions to roles
- **analytics_events**: Cross-platform analytics data
- **notifications**: User notifications across platforms
- **notification_settings**: User notification preferences

## Implementation Guidelines

When implementing new features:

1. **Consider Cross-Platform Impact**: Will this feature be needed across platforms?
2. **Use Shared Components**: Import from `@lib/shared` instead of recreating functionality
3. **Maintain Data Isolation**: Always use `useTenantQuery` for database operations
4. **Follow Permission Patterns**: Protect routes and UI with `PermissionGate`
5. **Track Key Events**: Use analytics to track important user actions
6. **Test Cross-Platform**: Ensure features work correctly on all platforms

## Extending the System

To add new cross-platform features:

1. Create the core functionality in the `lib` directory
2. Export from `lib/shared/index.ts`
3. Add appropriate database migrations in `supabase/migrations`
4. Document the feature in this guide
5. Implement across all platforms consistently

## Questions?

If you have questions about cross-platform features, please contact:
- Technical questions: [tech-lead@neothink.io](mailto:tech-lead@neothink.io)
- Feature requests: [product-lead@neothink.io](mailto:product-lead@neothink.io)

*For more information on the technical implementation, see the [Technical Implementation Guide](../TECHNICAL-IMPLEMENTATION.md).* 