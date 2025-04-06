# Neothink Shared Library

This directory contains shared code that is used across all Neothink platforms. The goal is to provide consistent functionality and user experience while reducing code duplication.

## Table of Contents

- [Components](#components)
- [Hooks](#hooks)
- [Context Providers](#context-providers)
- [Utilities](#utilities)
- [Theme](#theme)
- [Navigation](#navigation)
- [Layouts](#layouts)
- [API](#api)
- [Configuration](#configuration)

## Core Features

### Authentication System

The authentication system provides a unified login and signup experience across all platforms:

```tsx
import { CrossPlatformAuth } from '@lib/shared';

function LoginPage() {
  return (
    <CrossPlatformAuth
      mode="signin"
      redirectTo="/dashboard"
    />
  );
}
```

### Multi-Tenant Content

The shared content system allows for creating content once and sharing it across platforms:

```tsx
import { useSharedContent } from '@lib/hooks/useSharedContent';

function ContentPage() {
  const { content, isLoading, error } = useSharedContent('content-slug');
  
  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;
  
  return <ContentDisplay content={content} />;
}
```

### Commenting System

The commenting system enables users to interact with content across platforms:

```tsx
import { CommentSection } from '@lib/components/Comments/CommentSection';

function ContentPage({ contentId }) {
  return (
    <div>
      <ContentDisplay />
      <CommentSection contentId={contentId} />
    </div>
  );
}
```

### Subscription Management

The subscription management system handles access control across platforms:

```tsx
import { useSubscription } from '@lib/hooks/useSubscription';

function SubscriptionManager() {
  const { 
    currentSubscription, 
    availablePlans,
    createSubscription,
    cancelSubscription,
    updateSubscription,
    hasPlatformAccess
  } = useSubscription();
  
  return (
    <div>
      {/* Render subscription management UI */}
    </div>
  );
}
```

### Platform Access Control

Protect routes that require platform access:

```tsx
import { ProtectedRoute } from '@lib/components/ProtectedRoute';

function PlatformSpecificPage() {
  return (
    <ProtectedRoute>
      <YourProtectedContent />
    </ProtectedRoute>
  );
}
```

### Platform-Specific Theming

Apply platform-specific styling consistently:

```tsx
import { useTheme } from '@lib/hooks/useTheme';

function ThemedComponent() {
  const { colors, fonts, platform } = useTheme();
  
  return (
    <div style={{ 
      color: colors.primary,
      fontFamily: fonts.body
    }}>
      Themed content for {platform}
    </div>
  );
}
```

## Components

### UI Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary button component with platform-specific styling |
| `Card` | Container for content with platform-specific styling |
| `Input` | Form input components |
| `Modal` | Modal dialog component |
| `LoadingSpinner` | Loading indicator with platform-specific styling |
| `AccessDenied` | Component shown when a user doesn't have platform access |

### Layout Components

| Component | Description |
|-----------|-------------|
| `AppLayout` | Main application layout with navbar and sidebar |
| `ContentLayout` | Layout for content pages |
| `AuthLayout` | Layout for authentication pages |
| `DashboardLayout` | Layout for dashboard pages |

### Content Components

| Component | Description |
|-----------|-------------|
| `ContentCard` | Card for displaying content previews |
| `ContentDetail` | Component for displaying full content |
| `ContentList` | List of content items |
| `CommentSection` | Component for displaying and managing comments |

### Authentication Components

| Component | Description |
|-----------|-------------|
| `CrossPlatformAuth` | Authentication component for login/signup |
| `ProtectedRoute` | Component for routes requiring authentication |
| `UserProfileCard` | Component for displaying user profile information |

### Subscription Components

| Component | Description |
|-----------|-------------|
| `SubscriptionCard` | Display subscription information |
| `PlanSelector` | Component for selecting subscription plans |
| `PaymentForm` | Form for collecting payment information |
| `SubscriptionStatus` | Display current subscription status |

## Hooks

### Authentication Hooks

| Hook | Description |
|------|-------------|
| `useAuth` | Hook for accessing authentication state and methods |
| `useProfile` | Hook for accessing and updating user profile |

### Content Hooks

| Hook | Description |
|------|-------------|
| `useSharedContent` | Hook for accessing shared content |
| `useContentActions` | Hook for interacting with content (like, bookmark, etc.) |
| `useComments` | Hook for managing comments on content |

### Platform Hooks

| Hook | Description |
|------|-------------|
| `useTenant` | Hook for accessing current tenant/platform information |
| `useTheme` | Hook for accessing platform-specific styling |
| `usePlatformAccess` | Hook for checking platform access |

### Subscription Hooks

| Hook | Description |
|------|-------------|
| `useSubscription` | Hook for managing user subscriptions |
| `usePayment` | Hook for handling payment operations |

## Context Providers

| Provider | Description |
|----------|-------------|
| `AuthProvider` | Provides authentication context |
| `TenantProvider` | Provides tenant/platform context |
| `ThemeProvider` | Provides theme context |
| `SubscriptionProvider` | Provides subscription context |

## Utilities

| Utility | Description |
|---------|-------------|
| `formatDate` | Format dates consistently |
| `formatCurrency` | Format currency values |
| `validateEmail` | Validate email addresses |
| `slugify` | Convert strings to URL-friendly slugs |

## API

| Module | Description |
|--------|-------------|
| `api/auth` | Authentication API methods |
| `api/content` | Content API methods |
| `api/profiles` | Profile API methods |
| `api/subscriptions` | Subscription API methods |
| `api/comments` | Comments API methods |

## Configuration

| File | Description |
|------|-------------|
| `config/platforms.ts` | Platform-specific configuration |
| `config/features.ts` | Feature flag configuration |
| `config/navigation.ts` | Navigation configuration |
| `config/theme.ts` | Theme configuration |

## Usage Guidelines

### Importing Shared Code

```tsx
// Import specific components
import { Button } from '@lib/components/ui/Button';

// Import hooks
import { useTheme } from '@lib/hooks/useTheme';

// Import utilities
import { formatDate } from '@lib/utils/formatters';
```

### Platform-Specific Customization

When you need platform-specific behavior:

```tsx
import { useTenant } from '@lib/hooks/useTenant';

function PlatformAwareComponent() {
  const { slug } = useTenant();
  
  return (
    <div>
      {slug === 'ascenders' && <AscendersSpecificContent />}
      {slug === 'neothinkers' && <NeothinkersSpecificContent />}
      {slug === 'immortals' && <ImmortalsSpecificContent />}
    </div>
  );
}
```

### Protected Routes

To protect routes that require platform access:

```tsx
// In your page component
import { ProtectedRoute } from '@lib/components/ProtectedRoute';

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <YourSecureContent />
    </ProtectedRoute>
  );
}
```

### Subscription Management

To implement subscription features:

```tsx
import { useSubscription } from '@lib/hooks/useSubscription';

function UpgradeButton() {
  const { hasPlatformAccess, createSubscription } = useSubscription();
  
  if (hasPlatformAccess('ascenders')) {
    return <AlreadySubscribedMessage />;
  }
  
  return (
    <Button onClick={() => createSubscription('plan_ascenders')}>
      Upgrade to Ascenders
    </Button>
  );
}
```

# Neothink Unified Authentication System

This document provides an overview of the consolidated authentication system implemented across all Neothink platforms (Hub, Ascenders, Neothinkers, and Immortals).

## Architecture

The authentication system follows a standardized approach with these key components:

1. **Unified Client Factory**: All Supabase clients are created through the standard factory that applies consistent configuration across platforms.
2. **Centralized Platform Access**: Platform access is checked using a unified approach that prioritizes the tenant_users relationship.
3. **Standardized Middleware**: All platforms use the same middleware implementation with platform-specific configuration.
4. **Role-Based Access Control**: Permissions are checked consistently using the tenant_roles infrastructure.
5. **Comprehensive Error Handling**: Authentication errors are handled and logged in a standardized way.

## Key Components

### 1. Client Factory (`lib/supabase/auth-client.ts`)

Provides platform-specific Supabase clients for different contexts:
- `createClientComponent()`: For client-side components
- `createServerComponent()`: For server components
- `createMiddlewareClient()`: For middleware

Each factory function handles the appropriate configuration, cookies, and platform-specific headers.

### 2. Tenant Detection (`lib/utils/tenant-detection.ts`)

Provides utilities for detecting tenants from requests:
- `getTenantFromHostname()`: Extracts tenant from hostname
- `getTenantFromPath()`: Extracts tenant from URL path
- `getTenantFromRequest()`: Comprehensive tenant detection

### 3. Platform Access (`lib/utils/platform-access.ts`)

Functions for checking and managing platform access:
- `checkPlatformAccess()`: Checks if a user has access to a platform
- `requestPlatformAccess()`: Allows users to request access
- `getUserAccessiblePlatforms()`: Lists platforms a user can access

### 4. Permissions System (`lib/utils/permissions.ts`)

Utilities for checking and managing permissions:
- `checkUserPermission()`: Checks a single permission
- `checkUserHasAllPermissions()`: Checks if user has all specified permissions
- `checkUserHasAnyPermission()`: Checks if user has any of the specified permissions
- `getUserPermissions()`: Gets all permissions for a user

### 5. Authentication Hook (`lib/hooks/useAuth.ts`)

A React hook that provides authentication functionality:
- `signIn()`: Sign in with email and password
- `signInWithOAuth()`: Sign in with OAuth providers
- `signUp()`: Create a new account
- `signOut()`: Sign out
- Profile management, permissions checks, and more

### 6. Middleware (`lib/middleware/unified-middleware.ts`)

Unified middleware implementation that handles:
- Session management
- Platform access checks
- Route-group based protection
- Tenant isolation

## Database Structure

The database has been enhanced with:

1. **Platform Access Tracking**:
   - `auth_logs`: Audit trail for authentication actions
   - `profiles.platforms`: Array of platforms a user has access to
   - `profiles.is_guardian`: Flag for platform administrators

2. **Role-Based Access Control**:
   - `tenant_roles`: Define roles within tenants
   - `role_permissions`: Associate permissions with roles
   - `tenant_users`: Associate users with tenants and roles

3. **Functions and Procedures**:
   - `check_platform_access()`: Function to determine if a user has access to a platform
   - Support for guardian override of normal access restrictions

## Usage Examples

### Protecting a Component

```tsx
import { ProtectedRoute } from '../lib/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute requiredPlatform="ascenders">
      <h1>Dashboard</h1>
      {/* Protected content here */}
    </ProtectedRoute>
  );
}
```

### Checking Permissions

```tsx
import { PermissionGate } from '../lib/components/PermissionGate';

export default function AdminPanel() {
  return (
    <ProtectedRoute>
      <h1>Admin Panel</h1>
      
      <PermissionGate permission="manage_users">
        <UserManagement />
      </PermissionGate>
      
      <PermissionGate permission="view_analytics">
        <Analytics />
      </PermissionGate>
    </ProtectedRoute>
  );
}
```

### Using the Auth Hook

```tsx
import { useAuth } from '../lib/hooks/useAuth';

export default function LoginForm() {
  const { signIn, error, isLoading } = useAuth({ platformSlug: 'ascenders' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields here */}
      {error && <div className="error">{error.message}</div>}
      <button type="submit" disabled={isLoading}>Sign In</button>
    </form>
  );
}
```

## Platform-Specific Configuration

Each platform uses the same authentication system but with platform-specific configuration:

**Hub**:
- Primary admin interface
- Guardian access management
- Multi-tenant overview

**Ascenders**:
- Member management
- Course access control
- Progress tracking

**Neothinkers**:
- Community membership
- Forum access control
- Content moderation

**Immortals**:
- Premium subscription management
- Exclusive content access
- Advanced features 