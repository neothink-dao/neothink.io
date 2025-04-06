# Technical Implementation Guide

This document provides the essential technical details for implementing the unified platform approach, focusing on practical implementation rather than theoretical concepts.

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js with React (already in use)
- **API**: Next.js API routes + Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel

### Monorepo Structure
We're building on our existing monorepo structure:

```
neothink/
├── apps/
│   ├── ascenders/   # Prosperity platform
│   ├── neothinkers/ # Happiness platform
│   ├── immortals/   # Longevity platform
│   └── hub/         # Central hub (go.neothink.io)
├── lib/
│   ├── ui/          # Shared UI components
│   ├── auth/        # Authentication utilities
│   ├── api/         # API utilities
│   └── supabase/    # Database utilities
└── packages/
    ├── config/      # Shared configuration
    ├── tsconfig/    # TypeScript configuration
    └── eslint/      # ESLint configuration
```

## Implementation Sequence

### 1. Unified Authentication

#### Technical Requirements
- Single Supabase Auth instance
- JWT with platform-specific claims
- Shared login/signup components
- User migration utilities

#### Implementation Steps
1. Configure Supabase Auth with appropriate settings
2. Create shared authentication components in `lib/auth`
3. Implement JWT handling with platform-specific claims
4. Build user migration utilities to merge existing accounts
5. Update all platform apps to use the shared auth module

#### Code Example: Auth Client
```typescript
// lib/auth/client.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Additional auth methods...
```

### 2. Database Schema

#### Unified User Schema
```sql
-- Users table (core user data)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform-specific user data
CREATE TABLE public.platform_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  platform_id TEXT NOT NULL, -- 'ascenders', 'neothinkers', 'immortals'
  subscription_tier TEXT,
  subscription_status TEXT,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform_id)
);

-- User settings
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Content Schema
```sql
-- Content table (cross-platform)
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB NOT NULL,
  platforms TEXT[] NOT NULL, -- Which platforms this content is available on
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content categories
CREATE TABLE public.content_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  platform_id TEXT, -- NULL means cross-platform
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content to category relationship
CREATE TABLE public.content_to_categories (
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.content_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);
```

### 3. Shared Components & Utilities

#### Core Components
- Authentication (Login, Signup, Profile)
- Navigation (Cross-platform navigation)
- User Settings
- Content Display
- Subscription Management

#### Implementation Approach
1. Create base components in `lib/ui`
2. Implement platform-specific styling through props
3. Use composition for complex components

#### Example: Platform Navigation Component
```tsx
// lib/ui/navigation/PlatformNav.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../auth/hooks';

type Platform = 'ascenders' | 'neothinkers' | 'immortals' | 'hub';

interface PlatformNavProps {
  currentPlatform: Platform;
  className?: string;
}

export function PlatformNav({ currentPlatform, className }: PlatformNavProps) {
  const { user, userPlatforms } = useAuth();
  
  if (!user) return null;
  
  return (
    <nav className={className}>
      {userPlatforms?.includes('ascenders') && (
        <Link 
          href="https://ascenders.neothink.io" 
          className={currentPlatform === 'ascenders' ? 'active' : ''}
        >
          Ascenders
        </Link>
      )}
      {/* Additional platform links */}
    </nav>
  );
}
```

### 4. Cross-Platform Features

#### Recommendations Engine
1. Implement user activity tracking across platforms
2. Create content similarity algorithm
3. Build recommendation API endpoint
4. Develop recommendation UI components

#### Example: Basic Recommendation Component
```tsx
// components/recommendations/CrossPlatformRecommendations.tsx
import React from 'react';
import useSWR from 'swr';
import { ContentCard } from '../../lib/ui';

interface RecommendationsProps {
  userId: string;
  currentPlatform: string;
  currentContentId?: string;
  limit?: number;
}

export function CrossPlatformRecommendations({ 
  userId, 
  currentPlatform,
  currentContentId,
  limit = 3 
}: RecommendationsProps) {
  const { data, error } = useSWR(
    `/api/recommendations?userId=${userId}&platform=${currentPlatform}&contentId=${currentContentId}&limit=${limit}`,
    fetcher
  );
  
  if (error) return <div>Failed to load recommendations</div>;
  if (!data) return <div>Loading recommendations...</div>;
  
  return (
    <div className="recommendations-container">
      <h3>Recommended for You</h3>
      <div className="recommendations-grid">
        {data.recommendations.map(item => (
          <ContentCard
            key={item.id}
            title={item.title}
            description={item.description}
            platform={item.platform}
            imageUrl={item.imageUrl}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}
```

### 5. Subscription Management

#### Unified Subscription Approach
1. Centralized subscription management in database
2. Platform-specific entitlements
3. Superachiever bundle handling

#### Implementation Steps
1. Create subscription API endpoints
2. Implement Stripe integration for unified billing
3. Build subscription management UI
4. Implement migration from existing subscriptions

### 6. Admin Dashboard

#### Core Features
1. Cross-platform user management
2. Content management system
3. Subscription management
4. Analytics dashboard

#### Implementation Approach
1. Create separate admin application in monorepo
2. Implement role-based access control
3. Build dashboard with modular components
4. Create unified API for admin operations

## Migration Strategy

### Authentication Migration
1. Create unified user records for all existing users
2. Implement email matching to identify cross-platform accounts
3. Provide account linking UI for users with multiple accounts
4. Maintain parallel authentication during transition

### Content Migration
1. Create unified content schema
2. Develop content migration scripts
3. Implement content adapters for platform-specific formatting
4. Migrate content platform-by-platform

### Subscription Migration
1. Audit existing subscriptions across platforms
2. Create unified subscription records
3. Develop migration path for each subscription type
4. Implement special handling for users with multiple subscriptions

## Testing Strategy

### Authentication Testing
- Login success rate across platforms
- Account migration success rate
- Performance under load
- Security testing

### Cross-Platform Feature Testing
- Recommendation accuracy
- Navigation usability
- Content discovery effectiveness
- Performance metrics

### User Experience Testing
- A/B testing for key flows
- User satisfaction surveys
- Session recording for key interactions
- Conversion tracking

## Deployment Strategy

### Phase 1: Authentication
1. Deploy Supabase Auth configuration
2. Roll out shared authentication to test group
3. Monitor and optimize
4. Gradually expand to all users

### Phase 2: Cross-Platform Features
1. Deploy recommendation engine to staging
2. Test with subset of users
3. Optimize based on feedback
4. Roll out to all users

### Continuous Integration/Deployment
- GitHub Actions for CI/CD pipeline
- Automated testing before deployment
- Staging environment for verification
- Blue-green deployment for zero downtime

## Technical Milestones

1. **Authentication Foundation** - Unified login across platforms
2. **User Profile Integration** - Consolidated user data
3. **Content Schema Implementation** - Unified content database
4. **Recommendation Engine** - Basic cross-platform recommendations
5. **Subscription Management** - Unified subscription handling
6. **Admin Dashboard** - Core administrative tools
7. **Advanced Personalization** - Enhanced recommendation algorithms

*This document provides the essential technical implementation details without speculative timelines or arbitrary estimates. The focus is on the practical implementation approach using our existing technology stack.* 