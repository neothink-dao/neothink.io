# Development Guidelines

## User Progress and Feature Unlocking

### Using the useUserProgress Hook

The `useUserProgress` hook is the central mechanism for controlling feature visibility and access across all platforms. It provides status information about which features are unlocked, locked, or hidden based on the user's progress.

```typescript
import { useUserProgress } from '@neothink/hooks';

function MyComponent() {
  // Platform can be 'hub', 'ascenders', 'neothinkers', or 'immortals'
  const { 
    checkFeatureStatus, 
    weekNumber,
    unlockFeature,
    advanceWeek 
  } = useUserProgress('hub');
  
  // Feature status will be 'unlocked', 'locked', or 'hidden'
  const onboardStatus = checkFeatureStatus('onboard');
  
  // Conditional rendering based on feature status
  if (onboardStatus === 'unlocked') {
    return <OnboardContent />;
  } else if (onboardStatus === 'locked') {
    return <LockedFeatureTeaser feature="onboard" platform="hub" />;
  } else {
    // Hidden features should not be rendered at all
    return null;
  }
}
```

### Route Locking Implementation

In your page components, use the hook to control access and redirect users who shouldn't access a route:

```typescript
'use client';

import { useUserProgress } from '@neothink/hooks';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();
  const { checkFeatureStatus } = useUserProgress('hub');
  const featureStatus = checkFeatureStatus('progress');
  
  // Redirect to 404 if the feature is hidden
  React.useEffect(() => {
    if (featureStatus === 'hidden') {
      router.push('/not-found');
    }
  }, [featureStatus, router]);
  
  // Avoid flashing content during redirect
  if (featureStatus === 'hidden') {
    return null;
  }
  
  // Regular content for unlocked or locked status
  return featureStatus === 'unlocked' 
    ? <UnlockedContent /> 
    : <LockedFeatureTeaser feature="progress" platform="hub" />;
}
```

### Testing Feature Access

To test different user progress scenarios, modify the database directly:

```sql
-- Advance a user to week 2 to unlock onboarding
UPDATE user_progress
SET week_number = 2
WHERE user_id = 'user-id-here' AND platform = 'hub';

-- Manually unlock a specific feature
UPDATE user_progress
SET unlocked_features = jsonb_set(unlocked_features, '{progress}', 'true')
WHERE user_id = 'user-id-here' AND platform = 'hub';
```

## Analytics Implementation

### Core Analytics Structure

The `@neothink/analytics` package provides a consistent way to track user behavior across all platforms:

```typescript
import { analytics } from '@neothink/analytics';

// Track a page view
analytics.page('hub', '/discover');

// Track a content interaction
analytics.trackContentInteraction(
  'hub',                // platform
  'feature-card-learn', // contentId
  'click',              // interaction type
  { section: 'homepage' } // optional details
);

// Track a feature unlock attempt
analytics.trackFeatureUnlockAttempt(
  'hub',           // platform
  'onboard',       // feature name
  false,           // success
  'week_required'  // reason
);

// Track when a feature is successfully unlocked
analytics.trackFeatureUnlocked('hub', 'onboard');

// Track an error
analytics.trackError(
  'hub',
  'api_failure',
  'Failed to fetch user data'
);
```

### Adding New Analytics Events

To add a new analytics event type:

1. First, update the `EventName` type in `packages/analytics/src/types.ts`:
   ```typescript
   export type EventName = 
     | 'page_view'
     | 'content_interaction'
     // Add your new event type here
     | 'my_new_event_type';
   ```

2. If needed, add convenience methods in `packages/analytics/src/index.ts`:
   ```typescript
   async trackMyNewEvent(
     platform: Platform, 
     customData: string
   ): Promise<void> {
     await this.track(
       'my_new_event_type',
       { platform },
       'custom_category',
       { customData }
     );
   }
   ```

3. Update the interface to include your new method:
   ```typescript
   export interface AnalyticsProvider {
     // Existing methods
     track(name: EventName, properties: EventProperties): Promise<void>;
     page(platform: Platform, path: string, properties?: object): Promise<void>;
     // Your new method
     trackMyNewEvent(platform: Platform, customData: string): Promise<void>;
   }
   ```

### Analytics Hooks for Components

For components, use the hooks provided by the analytics package:

```typescript
import { usePageView, useAnalytics } from '@neothink/analytics/hooks';

function MyComponent() {
  // Track page view on component mount
  usePageView('hub', '/my-page');
  
  // Get analytics instance for manual tracking
  const analytics = useAnalytics();
  
  return (
    <button 
      onClick={() => analytics.trackContentInteraction('hub', 'cta-button', 'click')}
    >
      Click Me
    </button>
  );
}
```

## Testing User Experience

### Running UI/UX Tests

To verify that the feature unlocking and progressive journey is working as intended:

```bash
# Run all UI tests
pnpm test:ui

# Test a specific platform's UI components
pnpm test:ui:hub
pnpm test:ui:ascenders
pnpm test:ui:neothinkers
pnpm test:ui:immortals

# Test specific feature behavior
pnpm test:features
```

### Testing Feature Visibility

We have pre-built tests that verify feature visibility based on user progress:

```typescript
// From __tests__/features/visibility.test.ts
describe('Feature Visibility', () => {
  it('shows Discover and locks Onboard for week 1 users', async () => {
    // Mock user in week 1
    mockUserProgress({ weekNumber: 1, platform: 'hub' });
    
    // Render component
    render(<HubNavigation />);
    
    // Verify Discover is visible and clickable
    expect(screen.getByText('Discover')).toBeVisible();
    
    // Verify Onboard is visible but shows a lock icon
    const onboardLink = screen.getByText('Onboard');
    expect(onboardLink).toBeVisible();
    expect(onboardLink.closest('a')).toHaveAttribute('aria-disabled', 'true');
    
    // Verify Progress and Endgame are not in the DOM
    expect(screen.queryByText('Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Endgame')).not.toBeInTheDocument();
  });
});
```

### Testing Analytics Events

Test that analytics events are properly triggered:

```typescript
// From __tests__/analytics/events.test.ts
describe('Analytics Events', () => {
  it('tracks feature unlock attempts', async () => {
    // Mock analytics
    const trackSpy = jest.spyOn(analytics, 'trackFeatureUnlockAttempt');
    
    // Render locked feature teaser
    render(<LockedFeatureTeaser feature="onboard" platform="hub" />);
    
    // Click the teaser
    await userEvent.click(screen.getByText('Get Notified'));
    
    // Verify correct analytics call
    expect(trackSpy).toHaveBeenCalledWith(
      'hub',
      'onboard',
      false,
      'time_requirement'
    );
  });
});
```

## Monorepo Development

### Project Structure

Each platform in the monorepo follows this structure:
```
platform-directory/
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── lib/           # Platform-specific libraries
│   └── types/         # TypeScript types
├── public/            # Static assets
├── package.json       # Platform-specific dependencies
└── vercel.json        # Deployment configuration
```

### Dependencies

1. **Root Dependencies**
   - Only add dependencies needed by multiple platforms
   - Use `pnpm add -w package-name` for root installation

2. **Platform Dependencies**
   - Install using `pnpm --filter @neothink/platform-name add package-name`
   - Keep platform-specific dependencies in platform's package.json

### Development Workflow

1. **Starting Development**
   ```bash
   # Install all dependencies
   pnpm install

   # Start specific platform
   pnpm --filter @neothink/platform-name dev
   ```

2. **Running Multiple Platforms**
   ```bash
   # Start multiple platforms
   pnpm turbo run dev --filter=@neothink/platform-1... --filter=@neothink/platform-2...
   ```

### Code Standards

1. **TypeScript**
   - Use strict mode
   - Define types for all props and state
   - Avoid `any` type

2. **Components**
   - Use functional components
   - Implement proper error boundaries
   - Follow atomic design principles

3. **State Management**
   - Use React Query for server state
   - Use Zustand for client state
   - Keep state close to where it's used

### Git Workflow

1. **Branches**
   - `main`: Production code
   - `feature/*`: New features
   - `fix/*`: Bug fixes
   - `docs/*`: Documentation updates

2. **Commits**
   - Use conventional commit messages
   - Reference issues in commits
   - Keep commits focused and atomic

3. **Pull Requests**
   - Create PR against main branch
   - Get required reviews
   - Ensure CI passes

### Testing

1. **Unit Tests**
   - Test components in isolation
   - Use React Testing Library
   - Maintain high coverage

2. **Integration Tests**
   - Test feature workflows
   - Verify cross-platform functionality
   - Test with real API calls

3. **E2E Tests**
   - Use Cypress for critical paths
   - Test cross-platform journeys
   - Verify production builds

## Testing with packages/testing

The `packages/testing` directory contains shared testing utilities for all platforms:

### Running Tests

```bash
# Run tests for all packages and applications
pnpm test

# Run tests for a specific platform
pnpm --filter @neothink/hub test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode during development
pnpm test:watch
```

### Writing Tests

The testing package provides helpful utilities for testing components and API routes:

```typescript
// Example component test
import { render, screen, userEvent } from '@neothink/testing';
import { HubHeader } from './HubHeader';

describe('HubHeader', () => {
  it('renders the logo and navigation', () => {
    render(<HubHeader />);
    expect(screen.getByAltText('Neothink Hub')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows user menu when logged in', async () => {
    render(<HubHeader user={{ id: '123', name: 'Test User' }} />);
    await userEvent.click(screen.getByText('Test User'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
```

For API route testing:

```typescript
// Example API route test
import { createMocks } from '@neothink/testing/api';
import handler from '../../pages/api/content';

describe('/api/content', () => {
  it('returns content for authenticated users', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      session: { user: { id: 'user-123' } },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('items');
  });

  it('returns 401 for unauthenticated users', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });
});
```

### Mocking Supabase

The testing package includes utilities for mocking Supabase responses:

```typescript
import { mockSupabaseClient } from '@neothink/testing/supabase';

// Mock Supabase query response
mockSupabaseClient
  .from('content')
  .select('*')
  .returns({
    data: [
      { id: '1', title: 'Test Content', platform: 'hub' }
    ],
    error: null
  });
```

## Using App Templates

Each platform includes example templates that showcase typical usage patterns. Here's how to use them:

### Rendering Platform Home Page

```typescript
// Example of rendering the home page with fetched data
import { Home } from '@neothink/hub/templates/Home';
import { useData } from '@neothink/hooks/useData';

export default function HomePage() {
  const { data, loading } = useData('content', {
    platform: 'hub',
    featured: true
  });

  return (
    <Home
      featuredContent={data}
      isLoading={loading}
    />
  );
}
```

### Using Analytics in Templates

```typescript
// Example of tracking page views and user actions
import { ContentView } from '@neothink/ascenders/templates/ContentView';
import { usePageView, useContentView } from '@neothink/analytics';

export default function ArticlePage({ article }) {
  // Track page view
  usePageView();
  
  // Track content view when component mounts
  useContentView(article.id, 'article');

  return (
    <ContentView 
      content={article}
      onShare={() => trackEvent('share', { contentId: article.id })}
    />
  );
}
```

### Using Authentication in Templates

```typescript
// Example of authentication-aware rendering
import { ProfileTemplate } from '@neothink/neothinkers/templates/Profile';
import { useAuthentication } from '@neothink/hooks/useAuthentication';

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuthentication();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <ProfileTemplate 
      user={user}
      onSignOut={signOut}
    />
  );
}
```

### Real-time Updates Example

```typescript
// Example of real-time updates using Supabase
import { ChatTemplate } from '@neothink/immortals/templates/Chat';
import { useRealtime } from '@neothink/hooks/useRealtime';

export default function ChatPage() {
  const { data, sendMessage } = useRealtime('messages', {
    filter: { channelId: 'health-discussion' }
  });

  return (
    <ChatTemplate
      messages={data}
      onSendMessage={sendMessage}
    />
  );
}
```

### Performance

1. **Build Optimization**
   - Use Turborepo's cache
   - Optimize image assets
   - Implement code splitting

2. **Runtime Performance**
   - Implement proper memoization
   - Use performance monitoring
   - Optimize re-renders

### Debugging

1. **Development Tools**
   - Use React DevTools
   - Enable Source Maps
   - Use proper logging

2. **Common Issues**
   - Check Turborepo cache
   - Verify dependency versions
   - Monitor build output

### Documentation

1. **Code Documentation**
   - Document complex functions
   - Add component prop types
   - Include usage examples

2. **API Documentation**
   - Document all endpoints
   - Include request/response examples
   - Note authentication requirements

### Security

1. **Code Security**
   - No sensitive data in code
   - Implement proper validation
   - Use security headers

2. **API Security**
   - Validate all inputs
   - Use proper CORS settings
   - Implement rate limiting

### Deployment

1. **Pre-deployment Checks**
   - Run all tests
   - Check bundle size
   - Verify environment variables

2. **Monitoring**
   - Check Vercel analytics
   - Monitor error rates
   - Track performance metrics

## Platform-Specific Guidelines

### Neothink+ Hub
- Central authentication logic
- Cross-platform navigation
- User management features

### Ascenders
- Business-focused features
- Integration with Hub
- Performance tracking

### Neothinkers
- Learning management
- Progress tracking
- Community features

### Immortals
- Health tracking
- Legacy planning
- Secure data handling

## Support and Resources

1. **Documentation**
   - [Monorepo Guide](MONOREPO.md)
   - [Supabase Setup](SUPABASE.md)
   - Platform READMEs

2. **Tools**
   - Turborepo Dashboard
   - Vercel Analytics
   - Supabase Dashboard

3. **Help**
   - Team chat channels
   - Documentation updates
   - Regular team meetings 