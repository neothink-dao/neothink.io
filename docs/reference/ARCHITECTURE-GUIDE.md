# Multi-Tenant Architecture Documentation

## Overview

This document describes the multi-tenant architecture implemented in the Neothink ecosystem. The system is designed to support multiple platforms (tenants) sharing a common Supabase backend while ensuring proper data isolation, security, and customization.

## Core Concepts

### Tenants

A **Tenant** represents a platform within the Neothink ecosystem. Each tenant:
- Has its own users, content, and settings
- Can be accessed via a unique URL and slug (e.g., joinascenders.com)
- Has isolated data from other tenants through Row Level Security (RLS)
- Has its own branding, theme, and configuration

### Users and Roles

Users can:
- Belong to multiple tenants with different roles
- Have a single identity across all platforms
- Switch between tenants they have access to
- Have different permissions based on their role in each tenant

Standard roles include:
- **Admin**: Full management rights within a tenant
- **Editor**: Can create and edit content within a tenant
- **Member**: Standard user with basic access
- **Guardian**: Superuser with cross-tenant access (system-wide administrators)

### Cross-Platform Architecture

The system supports multiple platforms/sites that share a common database:
- **Neothink Hub** (`go.neothink.io`): Central management platform
- **Ascenders** (`joinascenders.com`): Future-focused learning platform 
- **Neothinkers** (`joinneothinkers.com`): Community for innovative thinkers
- **Immortals** (`joinimmortals.com`): Platform for longevity enthusiasts

Each platform has:
- Its own codebase repository and Vercel deployment
- A unique UI/UX tailored to its audience
- Access to both platform-specific and shared content
- Shared authentication and permission system

## Database Schema

### Core Tables

- **tenants**: Stores tenant information
  ```sql
  CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    branding JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```

- **tenant_users**: Junction table linking users to tenants
  ```sql
  CREATE TABLE public.tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    tenant_role_id UUID REFERENCES public.tenant_roles(id),
    status TEXT NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, user_id)
  );
  ```

- **profiles**: Extended user information
  ```sql
  CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    is_guardian BOOLEAN NOT NULL DEFAULT false,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```

- **permissions**: Defines available permissions
  ```sql
  CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```

- **tenant_roles**: Defines roles specific to each tenant
  ```sql
  CREATE TABLE public.tenant_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, slug)
  );
  ```

- **role_permissions**: Maps permissions to roles
  ```sql
  CREATE TABLE public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.tenant_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id)
  );
  ```

### Content Tables

- **shared_content**: Content that can be shared across platforms
  ```sql
  CREATE TABLE public.shared_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    content_type TEXT NOT NULL,
    primary_image_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
  );
  ```

- **tenant_content**: Tenant-specific content customizations
  ```sql
  CREATE TABLE public.tenant_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shared_content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
    tenant_slug TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    custom_title TEXT,
    custom_summary TEXT,
    custom_content JSONB,
    custom_primary_image_url TEXT,
    display_order INTEGER,
    category_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(shared_content_id, tenant_slug)
  );
  ```

- **content_categories**: Categories for content organization
  ```sql
  CREATE TABLE public.content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    tenant_slug TEXT NOT NULL,
    parent_id UUID REFERENCES public.content_categories(id),
    display_order INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(slug, tenant_slug)
  );
  ```

### Analytics & Engagement Tables

- **analytics_events**: Cross-platform analytics
  ```sql
  CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    tenant_slug TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    properties JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```

- **notifications**: User notifications
  ```sql
  CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_slug TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
  );
  ```

- **content_reactions**: User engagement with content
  ```sql
  CREATE TABLE public.content_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_content_id UUID NOT NULL REFERENCES public.shared_content(id) ON DELETE CASCADE,
    tenant_slug TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE(user_id, shared_content_id, tenant_slug, reaction_type)
  );
  ```

## Row-Level Security (RLS)

All tenant-related tables have RLS policies to ensure data isolation:

### Example RLS Policies

For the `tenant_content` table:

```sql
-- Policy for selecting tenant content - accessible to users with access to that tenant
CREATE POLICY "Users can view tenant content they have access to"
  ON public.tenant_content
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = tenant_content.tenant_slug
        )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );
```

For the `shared_content` table:

```sql
-- Policy for selecting shared content - published content is visible to all, drafts only to authors and admins
CREATE POLICY "Published content is visible to all authenticated users"
  ON public.shared_content
  FOR SELECT
  TO authenticated
  USING (
    status = 'published' OR
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );
```

## Authentication and Authorization Flow

### Authentication Flow

1. **User signs up/logs in**: Uses Supabase Auth
2. **Profile creation**: A profile is created for new users
3. **Tenant association**: User is associated with the appropriate tenant(s)
4. **JWT claims**: JWT includes tenant and role information
5. **Client-side state**: Authentication state is managed by context providers

### Authorization Flow

1. **Permission check**: Check if user has required permissions
2. **Role-based access**: Permissions are determined by tenant role
3. **UI gating**: UI elements are conditionally rendered based on permissions
4. **API protection**: API endpoints check permissions before allowing access
5. **Database RLS**: Row-level security enforces permissions at the database level

## Implementation Guidelines

### Working with Tenant Data

Always use the `useTenantQuery` hook to ensure proper tenant isolation:

```typescript
import { useTenantQuery } from '@lib/hooks/useTenantQuery';

function MyComponent() {
  const { tenantQuery, currentTenant } = useTenantQuery();
  
  // This query will automatically filter by tenant
  const fetchData = async () => {
    const { data, error } = await tenantQuery
      .from('content_modules')
      .select('*');
    
    if (error) console.error('Error fetching data:', error);
    return data;
  };
  
  // ...rest of component
}
```

### Checking Permissions

Use the `usePermissions` hook to check user permissions:

```typescript
import { usePermissions } from '@lib/hooks/usePermissions';
import { PermissionGate } from '@lib/components/PermissionGate';

function MyComponent() {
  const { hasPermission } = usePermissions();
  
  // Check permission programmatically
  const canCreateContent = hasPermission('content:create');
  
  return (
    <div>
      {/* Conditionally render UI based on permissions */}
      <PermissionGate permission="content:create">
        <button>Create Content</button>
      </PermissionGate>
    </div>
  );
}
```

### Creating New Tables

When creating new tables that need tenant isolation:

1. Add a `tenant_slug` or `tenant_id` column
2. Create appropriate indexes for performance
3. Implement RLS policies for all CRUD operations
4. Update the `useTenantQuery` hook to handle the new table

Example:

```sql
-- Create new table
CREATE TABLE public.my_new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index
CREATE INDEX my_new_table_tenant_slug_idx ON public.my_new_table(tenant_slug);

-- Enable RLS
ALTER TABLE public.my_new_table ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view records for their tenants"
  ON public.my_new_table
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users
      WHERE 
        tenant_users.user_id = auth.uid() AND
        tenant_users.tenant_id IN (
          SELECT id FROM public.tenants
          WHERE tenants.slug = my_new_table.tenant_slug
        )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE 
        profiles.id = auth.uid() AND
        profiles.is_guardian = true
    )
  );

-- Additional policies for INSERT, UPDATE, DELETE
-- ...
```

### Cross-Platform Navigation

Use the `PlatformSwitcher` component for cross-platform navigation:

```tsx
import { PlatformSwitcher } from '@lib/shared';

function Header() {
  return (
    <header className="main-header">
      <Logo />
      <MainNavigation />
      <PlatformSwitcher />
    </header>
  );
}
```

## Common Patterns

### Tenant Context Provider

All applications use the `TenantProvider` to manage tenant context:

```tsx
// _app.tsx
import { TenantProvider } from '@lib/context/TenantContext';

function MyApp({ Component, pageProps }) {
  return (
    <TenantProvider initialTenant={pageProps.initialTenant}>
      <Component {...pageProps} />
    </TenantProvider>
  );
}

export default MyApp;
```

### Tenant-Aware API Routes

API routes should validate tenant access:

```typescript
// pages/api/some-endpoint.ts
import { NextApiHandler } from 'next';
import { createClient } from '@supabase/supabase-js';
import { validateTenantAccess } from '@lib/utils/api';

const handler: NextApiHandler = async (req, res) => {
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get user from JWT
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Validate tenant access
  const tenantSlug = req.query.tenant as string;
  const hasAccess = await validateTenantAccess(supabase, user.id, tenantSlug);
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Handle the request
  // ...
};

export default handler;
```

## Best Practices

1. **Always use tenant context**: Use `useTenantQuery` instead of direct Supabase queries.
2. **Implement proper RLS policies**: All tables should have appropriate RLS policies.
3. **Utilize permission gates**: Use `PermissionGate` for conditional UI rendering.
4. **Keep shared code in `/lib`**: Shared components and utilities should be in the lib directory.
5. **Test across all platforms**: Ensure features work consistently across all platforms.
6. **Document platform differences**: Clearly document any platform-specific behaviors.
7. **Use materialized views for analytics**: Optimize complex analytics queries with materialized views.
8. **Coordinate database migrations**: Database changes must be tested across all platforms.

## Troubleshooting

### Common Issues

1. **Data not showing up**: Check tenant context and RLS policies.
2. **Permission errors**: Verify user tenant roles and permissions.
3. **Cross-platform issues**: Ensure shared code works across all platforms.
4. **Performance problems**: Review database indexes and query optimization.

### Debugging Tips

1. **Check tenant context**: Ensure the correct tenant is selected.
2. **Verify permissions**: Check if the user has the required permissions.
3. **Inspect RLS policies**: Review RLS policies in Supabase for the affected tables.
4. **Test with a Guardian role**: Compare behavior with a user who has Guardian access.
5. **Use Supabase logs**: Check Supabase logs for RLS policy rejections.

## Future Enhancements

1. **Tenant provisioning API**: Automate tenant creation and configuration.
2. **Enhanced role management**: More flexible role and permission system.
3. **Cross-tenant content sharing**: Improved content sharing between tenants.
4. **Tenant-specific customization**: More tenant-specific UI customization options.
5. **Advanced analytics**: Enhanced cross-platform analytics capabilities. 