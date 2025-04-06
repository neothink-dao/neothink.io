# Getting Started with Neothink Platforms

This guide will help you set up your development environment and understand the key concepts of the Neothink platforms ecosystem.

## Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Git
- Supabase CLI
- Vercel CLI (optional)

## Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/neothink/platforms.git
   cd platforms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Start the Supabase local development server:
   ```bash
   npx supabase start
   ```

5. Start the development server for all platforms:
   ```bash
   npm run dev
   ```
   
   Or start a specific platform:
   ```bash
   npm run dev -- --filter=go.neothink.io
   npm run dev -- --filter=joinascenders
   npm run dev -- --filter=joinneothinkers
   npm run dev -- --filter=joinimmortals
   ```

## Local Development

### Accessing Different Platforms

In local development, platforms are accessed via path-based routing:

- Hub: http://localhost:3000/hub
- Ascenders: http://localhost:3000/ascenders
- Neothinkers: http://localhost:3000/neothinkers
- Immortals: http://localhost:3000/immortals

### Authentication

For local development, you can use the following test accounts:

- Guardian User: admin@neothink.io / Password123!
- Hub User: hub@neothink.io / Password123!
- Ascenders User: ascenders@neothink.io / Password123!

To create a new user, you can use the Supabase dashboard or the signup form in any platform.

## Architecture Overview

### Shared Components

All shared code is in the `lib` directory:

- `lib/supabase`: Supabase client factories and authentication utilities
- `lib/utils`: Common utilities
- `lib/hooks`: React hooks for authentication, platform access, etc.
- `lib/components`: Shared UI components
- `lib/theme`: Theming system
- `lib/config`: Platform configuration

### Platform-Specific Code

Each platform has its own directory:

- `go.neothink.io`: Hub platform
- `joinascenders`: Ascenders platform
- `joinneothinkers`: Neothinkers platform
- `joinimmortals`: Immortals platform

### Database

The database schema is managed through Supabase migrations in the `supabase` directory.

## Key Concepts

### Platform Detection

The system detects which platform a user is accessing based on:

1. Domain name (production)
2. Path prefix (local development)
3. Headers (API requests)

This is handled primarily by the `lib/utils/tenant-detection.ts` module.

### Authentication

Authentication is managed through Supabase Auth with platform-specific configuration. The main components are:

1. `lib/supabase/auth-client.ts`: Factory for creating Supabase clients
2. `lib/supabase/unified-middleware.ts`: Middleware for handling auth in Next.js
3. `lib/hooks/use-platform-access.ts`: Hooks for checking platform access

### User Types

1. **Regular Users**: Have access to specific platforms they've been granted
2. **Guardian Users**: Admin users with access to all platforms

### Protected Routes

Protected routes are implemented using the `PlatformProtectedRoute` component:

```tsx
import PlatformProtectedRoute from 'lib/components/PlatformProtectedRoute';

export default function SecurePage() {
  return (
    <PlatformProtectedRoute platform="hub">
      <YourComponent />
    </PlatformProtectedRoute>
  );
}
```

## Common Tasks

### Adding a New Page

1. Add the page to the appropriate platform directory
2. Wrap with `PlatformProtectedRoute` if needed
3. Add to navigation in `lib/config/sites.ts`

### Creating a New Component

1. If used across platforms, add to `lib/components`
2. If platform-specific, add to the platform's components directory
3. Use the theme system for styling

### Adding a Database Migration

1. Create a new migration file in `supabase/migrations`
2. Test locally with `npx supabase db reset`
3. Apply to production with the Supabase dashboard

### Updating Platform Configuration

Platform configuration is centralized in `lib/config/sites.ts`. Update this file to change:

- Navigation items
- Feature flags
- Theming
- SEO settings

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. Check the platform detection in browser console
2. Verify the Supabase client configuration
3. Check the auth logs in the database

### Database Issues

For database issues:

1. Check the Supabase dashboard for errors
2. Verify that migrations have been applied correctly
3. Use the `auth_logs` table for debugging

### Theme Issues

For theme issues:

1. Ensure ThemeProvider is properly configured
2. Check CSS variables in browser inspector
3. Verify platform detection

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Internal Platform Documentation](/docs) 