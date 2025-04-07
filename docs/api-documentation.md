# Neothink API Documentation

This document provides a comprehensive overview of the API endpoints available across the Neothink platform ecosystem.

## Authentication

### Authentication Flow

All authenticated requests use JWT tokens provided by Supabase Auth. The typical authentication flow is:

1. User signs up or logs in via the authentication endpoints
2. A JWT token is returned and stored in cookies
3. Subsequent API requests include this token automatically
4. The token is refreshed automatically to maintain the session

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/signup` | POST | Create a new user account | `{ email, password, name?, platform? }` | `{ userId, requiresEmailConfirmation }` |
| `/api/auth/login` | POST | Authenticate a user | `{ email, password }` | `{ session, user }` |
| `/api/auth/logout` | POST | End the current session | - | `{ success }` |
| `/api/auth/reset-password` | POST | Request password reset | `{ email }` | `{ success }` |
| `/api/auth/callback` | GET | Auth callback handler | - | Redirect |

## User Management

### Profile Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/users/profile` | GET | Get current user profile | - | `Profile` object |
| `/api/users/profile` | PUT | Update user profile | `ProfileUpdateData` | Updated `Profile` object |
| `/api/users/avatar` | POST | Upload profile avatar | `FormData` with image | `{ avatarUrl }` |
| `/api/users/preferences` | GET | Get user preferences | - | `Preferences` object |
| `/api/users/preferences` | PUT | Update user preferences | `PreferencesUpdateData` | Updated `Preferences` object |

### Platform Access Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/platform-access` | GET | List available platforms | - | `Platform[]` array |
| `/api/platform-access/request` | POST | Request access to platform | `{ platformSlug, reason? }` | `{ requestId, status }` |
| `/api/platform-access/:platformSlug` | GET | Check access to specific platform | - | `{ hasAccess, accessLevel, expiresAt? }` |

## Content Management 

### Content Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/content` | GET | List content with pagination and filters | Query parameters | `{ items, total, page, pageSize }` |
| `/api/content/:id` | GET | Get specific content | - | `Content` object |
| `/api/content` | POST | Create new content | `ContentCreateData` | Created `Content` object |
| `/api/content/:id` | PUT | Update content | `ContentUpdateData` | Updated `Content` object |
| `/api/content/:id` | DELETE | Delete content | - | `{ success }` |

### Comments Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/content/:contentId/comments` | GET | Get comments for content | Query parameters | `Comment[]` array |
| `/api/content/:contentId/comments` | POST | Add comment | `{ comment }` | Created `Comment` object |
| `/api/content/comments/:commentId` | PUT | Update comment | `{ comment }` | Updated `Comment` object |
| `/api/content/comments/:commentId` | DELETE | Delete comment | - | `{ success }` |

## Subscriptions and Payments

### Subscription Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/subscriptions/plans` | GET | List available subscription plans | - | `SubscriptionPlan[]` array |
| `/api/subscriptions` | GET | Get current subscription | - | `Subscription` object |
| `/api/subscriptions` | POST | Create subscription | `{ planId, paymentMethodId }` | `Subscription` object |
| `/api/subscriptions/cancel` | POST | Cancel subscription | - | Updated `Subscription` object |
| `/api/subscriptions/payment-methods` | GET | List payment methods | - | `PaymentMethod[]` array |
| `/api/subscriptions/payment-methods` | POST | Add payment method | Payment details | `PaymentMethod` object |

## Notifications

### Notification Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/notifications` | GET | Get user notifications | Query parameters | `Notification[]` array |
| `/api/notifications/unread-count` | GET | Get count of unread notifications | - | `{ count }` |
| `/api/notifications/:id/read` | POST | Mark notification as read | - | Updated `Notification` object |
| `/api/notifications/read-all` | POST | Mark all notifications as read | - | `{ success }` |
| `/api/notifications/settings` | GET | Get notification preferences | - | `NotificationSettings` object |
| `/api/notifications/settings` | PUT | Update notification preferences | `NotificationSettingsUpdate` | Updated `NotificationSettings` object |

## Platform-Specific APIs

### Hub Platform (go.neothink.io)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/hub/dashboard` | GET | Get dashboard data | - | `DashboardData` object |
| `/api/hub/platforms` | GET | Get all platform statuses | - | `PlatformStatus[]` array |
| `/api/hub/settings` | GET | Get hub settings | - | `HubSettings` object |
| `/api/hub/settings` | PUT | Update hub settings | `HubSettingsUpdate` | Updated `HubSettings` object |

### Ascenders Platform (joinascenders.com)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/ascenders/goals` | GET | Get business goals | - | `Goal[]` array |
| `/api/ascenders/goals` | POST | Create business goal | `GoalCreateData` | Created `Goal` object |
| `/api/ascenders/goals/:id` | PUT | Update business goal | `GoalUpdateData` | Updated `Goal` object |
| `/api/ascenders/metrics` | GET | Get business metrics | Query parameters | `Metrics` object |

### Neothinkers Platform (joinneothinkers.com)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/neothinkers/exercises` | GET | Get thought exercises | Query parameters | `Exercise[]` array |
| `/api/neothinkers/exercises/:id` | GET | Get specific exercise | - | `Exercise` object |
| `/api/neothinkers/progress` | GET | Get progress statistics | - | `Progress` object |
| `/api/neothinkers/exercises/:id/complete` | POST | Mark exercise as completed | `{ answers }` | `{ success, progress }` |

### Immortals Platform (joinimmortals.com)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/immortals/health-metrics` | GET | Get health metrics | Query parameters | `HealthMetrics` object |
| `/api/immortals/health-metrics` | POST | Add health metric record | `MetricData` | Created `MetricRecord` object |
| `/api/immortals/legacy` | GET | Get user's legacy items | - | `LegacyItem[]` array |
| `/api/immortals/legacy` | POST | Create legacy item | `LegacyItemData` | Created `LegacyItem` object |
| `/api/immortals/data-integration` | GET | Get connected data sources | - | `DataSource[]` array |
| `/api/immortals/data-integration` | POST | Connect new data source | `{ provider, credentials }` | `{ success, source }` |

## API Models

### User and Profile

```typescript
interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignInAt: string;
  userMetadata: Record<string, any>;
}

interface Profile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  platforms: string[];
  isGuardian: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
}
```

### Content

```typescript
interface Content {
  id: string;
  tenantId: string;
  authorId: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categories: string[];
  featuredImage: string | null;
}

interface ContentCreateData {
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  categories?: string[];
  status?: 'draft' | 'published';
  featuredImage?: string;
}

interface Comment {
  id: string;
  contentId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}
```

### Subscriptions

```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  tenantId: string | null;
  features: Array<{
    name: string;
    description: string;
  }>;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: SubscriptionPlan;
}

interface PaymentMethod {
  id: string;
  userId: string;
  provider: 'stripe' | 'paypal';
  externalId: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
```

### Notifications

```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  category: string;
  actionUrl: string | null;
}

interface NotificationSettings {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
  };
  push: {
    enabled: boolean;
    comments: boolean;
    mentions: boolean;
  };
  inApp: {
    enabled: boolean;
  };
}
```

## Authentication and Security

### Headers

All API requests should include:

- `Content-Type: application/json` for JSON payloads
- Authentication is handled automatically through cookies

### Error Responses

API errors follow a consistent format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      // Optional additional error details
    }
  }
}
```

Common error codes:

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

### Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- Standard API endpoints: 60 requests per minute
- Authenticated users have higher limits than unauthenticated

### CORS

CORS is configured to allow requests from:

- `*.neothink.io`
- `*.joinascenders.com`
- `*.joinneothinkers.com`
- `*.joinimmortals.com`
- `localhost` domains (development only)

## Using the API with TypeScript

The API is fully typed and can be used with TypeScript:

```typescript
import { createClient } from '@/lib/supabase/client';

// Example: Fetch user profile
async function getUserProfile() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabase.auth.user()?.id)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}

// Example: Create content
async function createContent(contentData: ContentCreateData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content')
    .insert({
      ...contentData,
      author_id: supabase.auth.user()?.id,
      tenant_id: getCurrentTenantId(),
    })
    .single();
    
  if (error) {
    console.error('Error creating content:', error);
    throw error;
  }
  
  return data;
}
```

## Realtime Subscriptions

Certain endpoints support realtime updates through Supabase's realtime feature:

```typescript
import { createClient } from '@/lib/supabase/client';

// Example: Subscribe to notifications
function subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
  const supabase = createClient();
  
  return supabase
    .from(`notifications:user_id=eq.${userId}`)
    .on('INSERT', (payload) => {
      callback(payload.new as Notification);
    })
    .subscribe();
}
```

## Versioning

The API follows semantic versioning principles. The current version is v1 (implicit in the paths). 