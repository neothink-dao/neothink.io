# Neothink Platforms Refactoring Summary

This document summarizes the improvements made to the Neothink platforms monorepo codebase.

## Database Structure

We optimized the Supabase database schema with the following tables:

1. **profiles** - Extended user profiles with platform access information
   - Added `is_guardian` flag for admin users
   - Added `platforms` array for efficient access checks

2. **auth_logs** - Security auditing table for authentication events
   - Tracks login attempts, access checks, and other security events

3. **tenants** - Core platforms configuration
   - Represents the four platforms: Hub, Ascenders, Neothinkers, Immortals

4. **tenant_domains** - Domain mapping for each platform
   - Maps domains like `go.neothink.io`, `www.joinascenders.org`, etc. to platforms

5. **platform_access** - Explicit platform access records
   - Tracks which users have access to which platforms
   - Supports expiration dates and access levels

6. **tenant_roles** & **permissions** - Role-based access control
   - Defines roles and permissions for each platform
   - Supports fine-grained access control

7. **tenant_users** - Users in each tenant
   - Maps users to tenants with specific roles

We also created stored procedures and functions for common operations:
- `user_has_platform_access` - Efficiently checks platform access
- `get_user_permissions` - Retrieves all permissions for a user
- `grant_platform_access` - Grants platform access to a user

## Authentication and Access Control

We improved the authentication system with:

1. **Unified Client Factory** (`auth-client.ts`)
   - Platform-specific configuration for Supabase clients
   - Unified interface for client, server, and middleware components
   - Helper functions for checking platform access
   - Profile management with guardian (admin) status

2. **Tenant Detection** (`tenant-detection.ts`)
   - Multi-strategy tenant detection (hostname, path, headers)
   - Support for custom domains
   - Fallback mechanisms for reliable platform detection
   - Local development path mapping

3. **Unified Middleware** (`unified-middleware.ts`)
   - Shared middleware for all platforms
   - Efficient platform detection
   - Session validation and redirection
   - Access control checks
   - Security logging

4. **React Hooks** (`use-platform-access.ts`)
   - `usePlatformAccess` - Hook for checking platform access
   - `useIsGuardian` - Hook for checking admin status
   - `useAccessiblePlatforms` - Hook for getting all accessible platforms

## UI Components

We created reusable components:

1. **PlatformProtectedRoute** - Route wrapper for platform access control
   - Redirects unauthorized users
   - Shows loading states
   - Customizable failure handling

2. **PlatformSwitcher** - Component for switching between platforms
   - Shows only platforms the user has access to
   - Supports dropdown or list views
   - Customizable styling

3. **LoadingSpinner** - Simple loading indicator
   - Consistent loading states across all platforms
   - Customizable size and appearance

## Theming and Configuration

We improved the theming system with:

1. **ThemeProvider** - Context provider for theme settings
   - Platform-specific colors and styling
   - Dark mode support
   - CSS variables for consistent styling
   - Helper functions for color manipulation

2. **Site Configuration** (`sites.ts`)
   - Consolidated configuration for all platforms
   - Domain mappings
   - Navigation structures
   - Feature flags
   - SEO settings
   - Branding configuration

## Other Improvements

1. **Code Organization**
   - Consistent file and folder structure
   - Clear separation of concerns
   - Better TypeScript typing
   - More robust error handling

2. **Performance Optimizations**
   - Efficient database queries
   - Memoized React components
   - Client-side caching of platform access

3. **Developer Experience**
   - Improved documentation
   - Type safety throughout the codebase
   - Consistent coding style

## Domain Configuration

All platforms now use their official domains:

- Hub: `https://go.neothink.io`
- Ascenders: `https://www.joinascenders.org`
- Neothinkers: `https://www.joinneothinkers.org`
- Immortals: `https://www.joinimmortals.org` 