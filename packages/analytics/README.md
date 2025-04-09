# Neothink Analytics Package

A shared analytics package for Neothink platforms using Supabase.

## Features

- Event tracking with Supabase analytics_events table
- User identification and trait tracking
- Page view tracking with platform context
- React hooks for easy integration
- TypeScript support with full type safety

## Installation

The package is automatically available in the monorepo:

```bash
# If you need to install dependencies
pnpm install
```

## Usage

### Basic Event Tracking

```tsx
import { analytics } from '@neothink/analytics';
import type { Platform } from '@neothink/types';

// Track a simple event
analytics.track('sign_up', {
  platform: 'hub',
  metadata: {
    referrer: 'google',
    campaign: 'spring2025'
  }
});

// Track content view
analytics.track('content_view', {
  platform: 'ascenders',
  contentId: '123e4567-e89b-12d3-a456-426614174000',
  metadata: {
    contentType: 'article',
    timeSpent: 120
  }
});
```

### User Identification

```tsx
import { analytics } from '@neothink/analytics';

// Identify a user with traits
analytics.identify('user-id-123', {
  full_name: 'Jane Smith',
  email: 'jane@example.com',
  is_ascender: true
});
```

### Page View Tracking

```tsx
import { analytics } from '@neothink/analytics';
import type { Platform } from '@neothink/types';

// Track page view with additional properties
analytics.page('hub', '/dashboard', {
  title: 'User Dashboard',
  referrer: document.referrer
});
```

### React Hooks

```tsx
import { usePageView, useIdentify } from '@neothink/analytics';
import { useAuth } from '@neothink/core';
import type { Platform } from '@neothink/types';

function MyApp({ Component, pageProps }) {
  const platform: Platform = 'hub';
  
  // Automatically track page views
  usePageView(platform);
  
  // Identify user when authenticated
  useIdentify();
  
  return <Component {...pageProps} />;
}

// Custom tracking hook
function useTrackEvent() {
  const { analytics } = useAnalytics();
  const { user } = useAuth();
  
  const trackEvent = useCallback((name, properties) => {
    analytics.track(name, {
      ...properties,
      userId: user?.id,
    });
  }, [analytics, user]);
  
  return trackEvent;
}
```

## API Reference

### `analytics` Object

The main analytics instance for tracking events.

#### Methods

- `track(name, properties)` - Track an event with properties
- `identify(userId, traits)` - Identify a user with traits
- `page(platform, path, properties)` - Track a page view

### Event Types

```tsx
// Available event names
type EventName = 
  | 'page_view'
  | 'sign_up'
  | 'sign_in'
  | 'content_view'
  | 'achievement_unlocked'
  | 'progress_updated'
  | 'profile_updated'
  | 'feedback_submitted';

// Event properties interface
type EventProperties = {
  platform: Platform;
  contentId?: string;
  achievementId?: string;
  progressValue?: number;
  metadata?: Record<string, any>;
};
```

### React Hooks

- `usePageView(platform)` - Track page views automatically
- `useIdentify()` - Identify user from auth context
- `useAnalytics()` - Access analytics instance in components

## Database Schema

Events are stored in the `analytics_events` table with the following schema:

```sql
CREATE TABLE public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

## Security

- Row Level Security policies ensure users can only track their own events
- Admins can view all events for analysis purposes
- The service role can be used for server-side tracking

## Best Practices

1. **Always specify platform** - Include the platform in all tracked events
2. **Consistent event names** - Use the predefined EventName types
3. **Structured properties** - Use consistent property names
4. **Minimal tracking** - Only track what you need to analyze
5. **User consent** - Ensure you have user consent for tracking

## Querying Analytics Data

Example SQL queries for analyzing data:

```sql
-- Get total events by type
SELECT event_name, COUNT(*) 
FROM analytics_events 
GROUP BY event_name 
ORDER BY COUNT(*) DESC;

-- Events by platform
SELECT platform, COUNT(*) 
FROM analytics_events 
GROUP BY platform;

-- User engagement over time
SELECT 
  DATE_TRUNC('day', created_at) AS day,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(*) AS total_events
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;
```

## Performance Considerations

- Events are batched and sent asynchronously
- Development mode logs to console instead of Supabase
- Minimal impact on application performance
- Efficient database queries with proper indexing 