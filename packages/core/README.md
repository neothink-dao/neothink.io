# Neothink Core Package

Core utilities and services for Neothink platforms using Supabase.

## Features

- Database client with latest Supabase features
- Authentication hooks and utilities
- Security middleware for Next.js
- Monitoring and logging system
- Rate limiting implementation

## Installation

The package is automatically available in the monorepo:

```bash
# If you need to install dependencies
pnpm install
```

## Usage

### Database Client

```tsx
import { supabase, getServerSupabase, getAuthenticatedSupabase } from '@neothink/core';

// Client-side usage
const { data, error } = await supabase
  .from('content')
  .select('*')
  .eq('app', 'hub')
  .limit(10);

// Server-side usage with service role
export async function getServerSideProps() {
  const supabase = getServerSupabase();
  
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .limit(100);
    
  return { props: { profiles: data } };
}

// With user session
const getAuthenticatedData = async (accessToken: string) => {
  const supabase = getAuthenticatedSupabase(accessToken);
  return supabase.from('progress').select('*');
};
```

### Authentication Hooks

```tsx
import { useAuth, AuthProvider } from '@neothink/core';

// Wrap your app with the provider
function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// Use the hook in your components
function Profile() {
  const { user, profile, signOut, updateProfile, isAdmin } = useAuth();
  
  if (!user) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {profile?.full_name}</h1>
      <button onClick={signOut}>Sign Out</button>
      
      {isAdmin && <div>Admin Panel</div>}
    </div>
  );
}
```

### Security Middleware

```tsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { securityMiddlewareWithRateLimit } from '@neothink/core';

export default async function middleware(req: NextRequest) {
  // Apply security headers and rate limiting
  return securityMiddlewareWithRateLimit(req);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Monitoring and Logging

```tsx
import { createLogger, startTimer, endTimerAndLog } from '@neothink/core';
import type { Platform } from '@neothink/types';

// Create a logger for your platform
const logger = createLogger('hub', {
  userId: 'user-123',
  path: '/dashboard',
});

// Basic logging
logger.info('User logged in');
logger.error('Authentication failed', { attemptCount: 3 });

// Performance monitoring
function ExpensiveOperation() {
  const label = 'fetch-data';
  
  startTimer(label);
  
  // Do something expensive
  const data = fetchLargeDataset();
  
  // Log the duration
  endTimerAndLog(label, logger, { 
    level: 'info',
    additionalContext: { dataSize: data.length }
  });
  
  return data;
}
```

### Rate Limiting

```tsx
import { checkRateLimit } from '@neothink/core';

async function rateLimitedApiHandler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || '127.0.0.1';
  const path = req.url;
  const identifier = `${clientIp}:${path}`;
  
  // Check if rate limited (100 requests per minute)
  const isRateLimited = await checkRateLimit(identifier, 100, 60);
  
  if (isRateLimited) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  
  // Handle the request normally
  // ...
}
```

## Modules

### Database Module

- `supabase` - Supabase client for browser use
- `getServerSupabase` - Get a server-side Supabase client
- `getAuthenticatedSupabase` - Get a client with user authentication
- `checkRateLimit` - Check if a request is rate limited

### Auth Module

- `AuthProvider` - Authentication context provider
- `useAuth` - Hook to access auth context
- Authentication utility functions

### Security Module

- `securityMiddleware` - Apply security headers
- `securityMiddlewareWithRateLimit` - Security with rate limiting
- `rateLimit` - Standalone rate limiting middleware

### Monitoring Module

- `createLogger` - Create a platform-specific logger
- `Logger` - Logger class with console and Supabase support
- `startTimer` - Start timing an operation
- `endTimer` - End timing and get duration
- `endTimerAndLog` - End timing and log the results

## Database Schema Management

This package includes SQL migrations for declarative schema management:

```bash
# Apply migrations
pnpm supabase migration up

# Create a new migration
pnpm supabase migration new my_migration_name
```

## Best Practices

1. Use typed Supabase queries with the Database type
2. Implement RLS policies for all database tables
3. Use the service role key only for server-side operations
4. Set up proper rate limiting for public APIs
5. Log all important events for monitoring

## Security Considerations

- The service role key has admin privileges - keep it secure
- Use environment variables for all keys and secrets
- Implement proper authentication checks in middleware
- Rate limit public endpoints to prevent abuse
- Use Content Security Policy to prevent XSS attacks

## Performance Tips

1. Use read replica routing for read-heavy operations
2. Implement connection pooling for server environments
3. Enable real-time broadcast for efficient real-time updates
4. Use the monitoring tools to identify slow operations 