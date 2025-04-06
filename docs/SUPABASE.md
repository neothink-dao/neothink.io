# Supabase Integration

This document provides an overview of how Supabase is integrated into the Neothink platforms.

## Architecture

Neothink platforms use a single Supabase project with proper row-level security (RLS) policies to ensure data security across all platforms.

## Key Components

### Authentication

Authentication is handled by Supabase Auth with platform-specific configurations:

```typescript
import { createClient } from '@/lib/supabase';

// Create a platform-specific client
const supabase = createClient('hub');

// Auth methods
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Database Access

Database access is managed through:

1. **Client Factory**: Creates properly configured Supabase clients for each platform
2. **Admin Client**: For server-side operations that require service role access
3. **Row-Level Security**: Ensures users can only access data they're authorized to see

### API Services

Structured API services for common operations:

- **Notification Service**: Cross-platform notification management
- Additional services will be added as needed

## Database Schema

Key tables in the database:

1. **auth.users**: Authentication users
2. **public.profiles**: User profiles with platform access
3. **public.notifications**: Cross-platform notifications
4. **public.notification_settings**: User notification preferences

## TypeScript Integration

TypeScript types are generated from the database schema:

```bash
npm run gen:types
```

This generates type definitions in `types/supabase.ts` that can be used throughout the codebase for type safety.

## Row-Level Security Policies

All tables are protected with RLS policies. For example:

```sql
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (
    auth.uid() = user_id
  );
```

## Migration Management

Database migrations are managed through migration files in `supabase/migrations/` and can be applied using:

```bash
npm run migrate
```

Individual migrations can be applied using:

```bash
npm run migrate:notifications
```

## Environment Setup

Required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Extending the Integration

When adding new functionality:

1. Create migration files for schema changes
2. Update TypeScript type definitions
3. Create service classes for common operations
4. Implement RLS policies for security
5. Document the changes 