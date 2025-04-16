# Standardized Route Structure

This document outlines the standardized route structure for all Neothink platforms.

## Overview

Each Neothink platform follows a consistent route group structure to ensure clarity, maintainability, and consistent authentication flows.

## Route Groups

```
app/
├── (auth)/             # Authentication routes
├── (authenticated)/    # Protected routes requiring auth
├── (unauthenticated)/  # Public routes
├── api/                # API routes
└── layout.tsx          # Root layout
```

### 1. Auth Routes `(auth)/`

The `(auth)` route group contains all authentication-related pages:

```
app/(auth)/
├── layout.tsx           # Shared authentication layout
└── auth/
    ├── confirm/         # Email confirmation
    ├── error/           # Auth error handling
    ├── forgot-password/ # Password reset request
    ├── login/           # Login page
    ├── sign-up/         # Registration page
    ├── sign-up-success/ # Registration success
    └── update-password/ # Password update
```

### 2. Authenticated Routes `(authenticated)/`

The `(authenticated)` route group contains all routes that require authentication:

```
app/(authenticated)/
├── layout.tsx           # Shared authenticated layout with auth check
├── dashboard/           # User dashboard
├── onboarding/          # User onboarding
├── profile/             # User profile
└── settings/            # User settings
    ├── account/         # Account settings
    ├── notifications/   # Notification preferences
    └── platforms/       # Platform management
```

### 3. Unauthenticated Routes `(unauthenticated)/`

The `(unauthenticated)` route group contains public routes that don't require authentication:

```
app/(unauthenticated)/
├── layout.tsx           # Shared public layout
├── page.tsx             # Landing page
├── about/               # About page
├── contact/             # Contact page
├── platforms/           # Platform overview
└── legal/               # Legal documents
    ├── privacy/         # Privacy policy
    ├── terms/           # Terms of service
    └── cookies/         # Cookie policy
```

### 4. API Routes `api/`

The `api` directory contains server-side API routes:

```
app/api/
├── auth/                # Auth-related endpoints
├── users/               # User-related endpoints
├── platforms/           # Platform-related endpoints
└── webhooks/            # Webhook handlers
```

## Implementation Guidelines

### Layout Structure

Each route group should have its own layout that handles:

1. **Auth Routes:** Authentication-specific UI and redirects
2. **Authenticated Routes:** Auth verification and protected content layout
3. **Unauthenticated Routes:** Public navigation and footer

### Authentication Flow

1. **Unauthenticated Users:**
   - Can access all routes in `(unauthenticated)` group
   - Can access all routes in `(auth)` group
   - Redirected to `/auth/login` when attempting to access routes in `(authenticated)` group

2. **Authenticated Users:**
   - Can access all routes in `(authenticated)` group
   - Can access all routes in `(unauthenticated)` group
   - Redirected to `/dashboard` when attempting to access routes in `(auth)` group

### Cross-Platform Considerations

1. **Platform-Specific Routes:**
   - Each platform may have unique routes within the standard structure
   - Platform-specific routes should follow the same group organization

2. **Shared Components:**
   - Authentication layouts should be consistent across platforms
   - Shared UI elements should be used where appropriate

## Migration Plan

1. **Phase 1: Audit**
   - Identify all existing routes in each platform
   - Map current routes to new structure

2. **Phase 2: Implement Layouts**
   - Create standard layouts for each route group
   - Implement authentication logic

3. **Phase 3: Migrate Routes**
   - Move existing routes to appropriate groups
   - Update redirects and navigation

4. **Phase 4: Clean Up**
   - Remove deprecated routes
   - Update documentation

## Conclusion

This standardized route structure ensures consistent user experiences across all Neothink platforms while maintaining clear separation between authenticated and unauthenticated content.

---

Last updated: [Current Date] 