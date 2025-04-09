# Neothink Types Package

Shared TypeScript definitions for Neothink platforms.

## Features

- Supabase database schema types
- Platform-specific type definitions
- Content and user type definitions
- Event type definitions for analytics
- Full TypeScript support with strict typing

## Installation

The package is automatically available in the monorepo:

```bash
# If you need to install dependencies
pnpm install
```

## Usage

### Database Types

```tsx
import { Database } from '@neothink/types';
import { createClient } from '@supabase/supabase-js';

// Create a type-safe Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type-safe query
const { data, error } = await supabase
  .from('profiles')
  .select('id, full_name, avatar_url, is_ascender')
  .eq('is_ascender', true);

// Typed result
const profiles: Database['public']['Tables']['profiles']['Row'][] = data || [];
```

### Table Row Types

```tsx
import { 
  Profiles, 
  Content, 
  Progress, 
  Achievements,
  UserAchievements,
  AnalyticsEvents
} from '@neothink/types';

// Use typed table rows
function ProfileCard({ profile }: { profile: Profiles }) {
  return (
    <div>
      <h2>{profile.full_name}</h2>
      <img src={profile.avatar_url || '/default-avatar.png'} alt="Profile" />
      {/* Type-safe access to profile properties */}
      {profile.is_ascender && <Badge type="ascender" />}
    </div>
  );
}
```

### Platform Types

```tsx
import { Platform, ContentType, UserRole } from '@neothink/types';

// Platform-specific logic
function AccessControl({ platform, role }: { platform: Platform; role: UserRole }) {
  return (
    <div>
      {/* Type-safe platform values */}
      {platform === 'hub' && <HubContent />}
      {platform === 'ascenders' && <AscendersContent />}
      
      {/* Type-safe role checking */}
      {role === 'admin' && <AdminPanel />}
    </div>
  );
}

// Type-safe content rendering
function ContentItem({ type }: { type: ContentType }) {
  switch (type) {
    case 'article':
      return <ArticleLayout />;
    case 'video':
      return <VideoPlayer />;
    case 'course':
      return <CourseModule />;
    case 'exercise':
      return <ExerciseWidget />;
    case 'quiz':
      return <QuizComponent />;
  }
}
```

### Analytics Event Types

```tsx
import { EventName, Platform } from '@neothink/types';

// Type-safe event tracking
function trackEvent(name: EventName, platform: Platform, data?: any) {
  // Implementation...
}

// Examples with type checking
trackEvent('page_view', 'hub', { path: '/dashboard' });
trackEvent('content_view', 'ascenders', { contentId: 'abc123' });
// Error: Type '"invalid_event"' is not assignable to parameter of type 'EventName'
// trackEvent('invalid_event', 'hub');
```

### Subscription Types

```tsx
import { SubscriptionStatus, SubscriptionTier } from '@neothink/types';

function SubscriptionBadge({ 
  status, 
  tier 
}: { 
  status: SubscriptionStatus; 
  tier: SubscriptionTier 
}) {
  return (
    <div>
      {/* Type-safe subscription status */}
      {status === 'active' ? 'Active' : 'Inactive'}
      
      {/* Type-safe subscription tier */}
      {tier === 'premium' && <PremiumBadge />}
    </div>
  );
}
```

## Type Definitions

### Database Schema

Generated from Supabase with full table definitions:

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: { /* ... */ },
      content: { /* ... */ },
      progress: { /* ... */ },
      achievements: { /* ... */ },
      user_achievements: { /* ... */ },
      analytics_events: { /* ... */ },
      // ...other tables
    },
    Views: { /* ... */ },
    Functions: { /* ... */ },
    Enums: { /* ... */ },
  }
}
```

### Platform Types

```typescript
// Platform types
export type Platform = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

// Content types
export type ContentType = 'article' | 'video' | 'course' | 'exercise' | 'quiz';

// User roles
export type UserRole = 'user' | 'admin' | 'moderator';

// Event types for analytics
export type EventName = 
  | 'page_view'
  | 'sign_up'
  | 'sign_in'
  | 'content_view'
  | 'achievement_unlocked'
  | 'progress_updated'
  | 'profile_updated'
  | 'feedback_submitted';

// Subscription status
export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled';

// Subscription tiers
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'lifetime';
```

## Generating Types

Types are automatically generated from the Supabase database schema:

```bash
# Generate types from your local Supabase instance
pnpm supabase gen types typescript --local > ./packages/types/src/supabase.ts

# Or from a remote Supabase project
pnpm supabase gen types typescript --project-id=your-project-id > ./packages/types/src/supabase.ts
```

## Best Practices

1. **Always use typed queries** - Import and use the Database type with Supabase
2. **Import specific types** - Import only the types you need
3. **Extend base types** - Extend types for specific use cases
4. **Keep types in sync** - Regenerate types after schema changes
5. **Use union types** - Leverage union types for better type safety

## Contributing

1. **Regenerate types** after database schema changes
2. **Add new export types** to the index.ts file
3. **Document type changes** in this README
4. Ensure backwards **compatibility** when possible 