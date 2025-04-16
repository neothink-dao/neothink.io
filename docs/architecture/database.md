# Supabase Integration Guide

## Overview

This monorepo uses a single Supabase project ("neothink") as the backend for all four platforms. We leverage the latest Supabase features announced in [Launch Week 14](https://supabase.com/blog/launch-week-14-top-10) for optimal performance and developer experience.

## User Journey & Analytics Database Structure

### User Progress System

The `user_progress` table is central to our week-by-week user journey across all platforms:

```sql
CREATE TYPE public.platform_type AS ENUM ('hub', 'ascenders', 'neothinkers', 'immortals');

CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  week_number INTEGER NOT NULL DEFAULT 1,
  unlocked_features JSONB NOT NULL DEFAULT '{"discover": true}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, platform)
);
```

**Key features:**
- Tracks which features are unlocked for each user on each platform
- Manages the week number to control progressive feature unlocking
- Default configuration starts all users at Week 1 with only "discover" unlocked
- JSONB data type allows flexible feature unlocking without schema changes

### Analytics Events

The `analytics_events` table tracks all user interactions across platforms:

```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  platform TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  event_category TEXT,
  event_detail JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key features:**
- Captures all user interactions and page views
- Categorizes events by type (engagement, unlock, error, etc.)
- Stores detailed properties in flexible JSONB fields
- Enforces platform filtering for segmented analytics

### Example Admin Queries

#### User Progress Analysis

```sql
-- Users by week number for each platform
SELECT 
  platform, 
  week_number, 
  COUNT(*) as user_count
FROM user_progress
GROUP BY platform, week_number
ORDER BY platform, week_number;

-- Feature unlocking statistics
SELECT 
  platform,
  COUNT(*) FILTER (WHERE unlocked_features->>'discover' = 'true') as discover_unlocked,
  COUNT(*) FILTER (WHERE unlocked_features->>'onboard' = 'true') as onboard_unlocked,
  COUNT(*) FILTER (WHERE unlocked_features->>'progress' = 'true') as progress_unlocked,
  COUNT(*) FILTER (WHERE unlocked_features->>'endgame' = 'true') as endgame_unlocked
FROM user_progress
GROUP BY platform;

-- Users who haven't progressed past week 1 in over 14 days
SELECT 
  p.email, 
  up.platform, 
  up.last_updated
FROM user_progress up
JOIN profiles p ON up.user_id = p.id
WHERE 
  up.week_number = 1 AND 
  up.last_updated < NOW() - INTERVAL '14 days';
```

#### User Engagement Analytics 

```sql
-- Most common events by category
SELECT 
  event_category, 
  event_name, 
  COUNT(*) as event_count
FROM analytics_events
GROUP BY event_category, event_name
ORDER BY event_count DESC;

-- Feature unlock attempts by success rate
SELECT 
  platform,
  event_detail->>'feature' as feature,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE event_detail->>'success' = 'true') as successful_attempts,
  ROUND(
    COUNT(*) FILTER (WHERE event_detail->>'success' = 'true')::numeric / COUNT(*)::numeric * 100, 
    2
  ) as success_rate
FROM analytics_events
WHERE event_name = 'feature_unlock_attempt'
GROUP BY platform, event_detail->>'feature'
ORDER BY platform, total_attempts DESC;

-- User engagement over time (daily active users)
SELECT 
  DATE_TRUNC('day', timestamp) as day,
  platform,
  COUNT(DISTINCT user_id) as daily_active_users
FROM analytics_events
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY day, platform
ORDER BY day DESC, platform;

-- Average time spent on pages
SELECT 
  platform,
  properties->>'path' as page_path,
  AVG((event_detail->>'timeSpent')::numeric) as avg_time_spent_seconds,
  COUNT(*) as view_count
FROM analytics_events
WHERE 
  event_name = 'page_view' AND
  event_detail->>'timeSpent' IS NOT NULL
GROUP BY platform, properties->>'path'
ORDER BY platform, avg_time_spent_seconds DESC;
```

#### Conversion Funnel Analysis

```sql
-- User journey progression funnel
WITH journey_steps AS (
  SELECT
    user_id,
    platform,
    COUNT(*) FILTER (WHERE event_name = 'page_view' AND properties->>'path' = '/discover') as discover_views,
    COUNT(*) FILTER (WHERE event_name = 'page_view' AND properties->>'path' = '/onboard') as onboard_views,
    COUNT(*) FILTER (WHERE event_name = 'page_view' AND properties->>'path' = '/progress') as progress_views,
    COUNT(*) FILTER (WHERE event_name = 'page_view' AND properties->>'path' = '/endgame') as endgame_views
  FROM analytics_events
  GROUP BY user_id, platform
)
SELECT
  platform,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE discover_views > 0) as discover_users,
  COUNT(*) FILTER (WHERE onboard_views > 0) as onboard_users,
  COUNT(*) FILTER (WHERE progress_views > 0) as progress_users,
  COUNT(*) FILTER (WHERE endgame_views > 0) as endgame_users,
  ROUND(COUNT(*) FILTER (WHERE onboard_views > 0)::numeric / NULLIF(COUNT(*) FILTER (WHERE discover_views > 0), 0)::numeric * 100, 2) as discover_to_onboard_rate,
  ROUND(COUNT(*) FILTER (WHERE progress_views > 0)::numeric / NULLIF(COUNT(*) FILTER (WHERE onboard_views > 0), 0)::numeric * 100, 2) as onboard_to_progress_rate,
  ROUND(COUNT(*) FILTER (WHERE endgame_views > 0)::numeric / NULLIF(COUNT(*) FILTER (WHERE progress_views > 0), 0)::numeric * 100, 2) as progress_to_endgame_rate
FROM journey_steps
GROUP BY platform;
```

## Key Features

### 1. Authentication & Authorization
- Unified auth system across all platforms using Supabase Auth
- Row Level Security (RLS) policies for granular access control
- Platform-specific access flags in user profiles
- Integration with the official Supabase UI Library for consistent auth flows

### 2. Database Architecture
- Declarative schema management using `.sql` files
- Read replica routing for optimal performance
- Dedicated connection pooling via pgBouncer
- Real-time database changes using Broadcast

### 3. Performance Optimizations
- Nearest read replica routing for Data API requests
- Connection pooling with dedicated pgBouncer instances
- Optimized query performance with proper indexing
- Rate limiting implementation using native PostgreSQL

### 4. Development Workflow
- Edge Functions deployment directly from Dashboard
- Postgres Language Server integration for better SQL tooling
- Declarative schema management for consistent environments
- MCP Server integration for AI-powered development

## Platform Examples and Implementations

Each platform has example API routes and components that demonstrate Supabase integration:

### Hub Platform 
Located in `go.neothink.io/examples/`
- API route (`hub-data.ts`) showing authentication, RLS, and analytics tracking
- React component using hooks for page views, content views, and progress tracking

### Ascenders Platform
Located in `joinascenders/examples/`
- API route for Ascenders-specific content and achievements 
- Analytics component showcasing page view and achievement tracking

### Neothinkers Platform
Located in `joinneothinkers/examples/`
- API route for courses, user progress, and concepts
- Component demonstrating content interaction tracking

### Immortals Platform
Located in `joinimmortals/examples/`
- API route for health metrics and vital signs
- Component for health-related event tracking

## Working with TypeScript Types

The repository includes automatically generated TypeScript types for the Supabase schema in `packages/types/supabase.ts`, providing:

```typescript
// Example of using the generated types
import { Database } from '@neothink/types/supabase';

// Typed Supabase client
const supabase = createClient<Database>(url, key);

// Type-safe queries
const { data, error } = await supabase
  .from('content')
  .select('*')
  .eq('platform', 'ascenders');

// Type-safe RLS policies with platform filtering
const { data: userData } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);
```

### Generating Updated Types

When the database schema changes, regenerate types with:

```bash
# Using the Supabase CLI
pnpm supabase gen types typescript --local > ./packages/types/supabase.ts
```

## Supabase Launch Week 14 Features Implementation

### 1. Read Replica Routing

Our implementation uses nearest read replica routing for optimal performance:

```typescript
// From packages/core/src/supabase.ts
export const createSupabaseClient = (options?: SupabaseClientOptions) => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        // Route API requests to the nearest read replica
        routeToNearestReadReplica: true
      },
      ...options
    }
  );
};
```

### 2. Realtime Database Broadcast

We leverage realtime database changes for live updates:

```typescript
// Example from Neothinkers platform
const channel = supabase
  .channel('content-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'content',
    filter: 'platform=eq.neothinkers'
  }, (payload) => {
    // Update UI with new content
    refreshContent(payload.new);
  })
  .subscribe();
```

### 3. Dedicated Connection Pooling

Server components use dedicated connection poolers:

```typescript
// Server component database connection
const dbUrl = process.env.DATABASE_URL + '?pgbouncer=true';
// Use connection pooling for better performance
const pool = new Pool({ connectionString: dbUrl });
```

### 4. Edge Functions

Analytics events leverage Edge Functions:

```typescript
// From packages/analytics/src/track.ts
export const trackEvent = async (event: AnalyticsEvent) => {
  // Track via Edge Function for global distribution
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/track-event`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getSession()?.access_token}`
      },
      body: JSON.stringify(event)
    }
  );
  return response.json();
};
```

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy example env file
cp .env.example .env.local

# Fill in Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 2. Database Setup
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_rate_limits";

-- Apply migrations
supabase migration up
```

### 3. Authentication Setup
```typescript
// Use Supabase UI components for auth
import { Auth } from '@supabase/ui'
import { supabase } from '@neothink/core'

function AuthComponent() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: 'dark' }}
      providers={['google', 'github']}
    />
  )
}
```

## Security Best Practices

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Policies enforce platform-specific access
   - Service role key used only in secure contexts

2. **Rate Limiting**
   - PostgreSQL-based rate limiting
   - Configurable per endpoint/action
   - Automatic cleanup of old rate limit records

3. **Connection Security**
   - Dedicated connection pools
   - SSL-enforced connections
   - Regular key rotation

## Performance Optimization

1. **Read Replicas**
   ```typescript
   // Configure read replica routing
   const supabase = createClient(url, key, {
     db: {
       routeToNearestReadReplica: true
     }
   })
   ```

2. **Connection Pooling**
   ```typescript
   // Use dedicated pooler
   DATABASE_URL=postgres://user:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true
   ```

3. **Real-time Optimization**
   ```typescript
   // Use database broadcast for efficient real-time
   supabase
     .channel('schema-db-changes')
     .on('postgres_changes', {
       event: '*',
       schema: 'public'
     }, payload => {
       console.log(payload)
     })
     .subscribe()
   ```

## Monitoring & Debugging

1. **Dashboard Monitoring**
   - Real-time database metrics
   - Connection pool statistics
   - Query performance analysis

2. **Logging**
   - Structured logging for auth events
   - Query logging for performance tracking
   - Error tracking with context

## AI Integration

1. **MCP Server**
   - Direct integration with AI tools
   - Automated schema management
   - AI-assisted query optimization

2. **Vector Search**
   - Full-text search capabilities
   - Semantic similarity queries
   - AI-powered content recommendations

## Useful Commands

```bash
# Apply migrations
pnpm supabase migration up

# Generate types
pnpm supabase gen types typescript --local > ./packages/types/src/supabase.ts

# Deploy edge functions
pnpm supabase functions deploy --project-ref xxx

# Check database status
pnpm supabase db status
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Launch Week 14 Features](https://supabase.com/blog/launch-week-14-top-10)
- [Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [Performance Optimization](https://supabase.com/docs/guides/database/performance)

# Database Package Documentation

The `@neothink/database` package provides a standardized way to interact with our Supabase backend across all Neothink platforms. It includes utilities for creating platform-specific clients, database models, error handling, and query building.

## Installation

```bash
# This package is included in the monorepo and doesn't need to be installed separately
# For local development, make sure to build the package
pnpm --filter=@neothink/database build
```

## Usage

### Creating a Supabase Client

```typescript
import { createClient, PlatformSlug } from '@neothink/database';

// Create a platform-specific client
const supabase = createClient('ascenders');

// Use the client
const { data, error } = await supabase.from('profiles').select('*');
```

### Platform-Specific Clients

Each platform (Hub, Ascenders, Immortals, Neothinkers) has its own client configuration with specific storage keys and headers:

```typescript
// Available platform slugs
type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
```

### Admin Client

For server-side operations that require elevated privileges:

```typescript
import { createAdminClient } from '@neothink/database';

// Only available on the server side
const adminClient = createAdminClient();
const { data, error } = await adminClient.from('profiles').select('*');
```

## Database Models

The package includes TypeScript interfaces for all database entities, making it easier to work with typed data:

```typescript
import { UserProfile, PlatformAccess } from '@neothink/database';

// Use the models
const profile: UserProfile = {
  id: '123',
  email: 'user@example.com',
  // ... other fields
};
```

## Error Handling

Standardized error handling across the application:

```typescript
import { handleError, withErrorHandling, ErrorCode } from '@neothink/database';

// Wrap database calls with error handling
const getUserData = async (userId: string) => {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  });
};

// Handle specific error codes
try {
  const data = await getUserData('123');
} catch (error) {
  if (error.code === ErrorCode.NOT_FOUND) {
    // Handle not found
  } else if (error.code === ErrorCode.PERMISSION_DENIED) {
    // Handle permission denied
  }
}
```

## Query Building

Utilities for building complex queries with filtering, sorting, and pagination:

```typescript
import { buildQuery, executePagedQuery, arrayContains, textSearch } from '@neothink/database';

// Build and execute a simple query
const query = buildQuery(supabase, 'profiles', {
  filter: { role: 'admin' },
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
});

const { data, error } = await query.select();

// Execute a paginated query
const result = await executePagedQuery(supabase, 'profiles', {
  filter: { role: 'admin' },
  page: 1,
  limit: 10,
});

// Result includes pagination information
console.log(result.data);      // Array of results
console.log(result.total);     // Total count
console.log(result.hasMore);   // Whether there are more pages

// Use helper functions for complex filters
const filter = {
  ...arrayContains('platforms', 'ascenders'),
  ...textSearch('name', 'John'),
};

const query = buildQuery(supabase, 'profiles', { filter });
```

## Best Practices

1. **Use Typed Queries**: Always use TypeScript types for database operations.

2. **Error Handling**: Use the provided error handling utilities for consistent error handling.

3. **Pagination**: Use paginated queries for lists of items.

4. **Platform-Specific Clients**: Use the correct platform client for operations.

5. **Admin Operations**: Use the admin client only for server-side operations that require elevated privileges.

6. **Data Validation**: Validate data before inserting or updating records.

## Schema and Migrations

Database schema and migrations are managed in the `supabase` directory at the root of the monorepo. See [Supabase Documentation](./supabase.md) for more information on schema management and migrations.