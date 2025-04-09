# Neothink Monorepo

A monorepo containing multiple Neothink applications sharing a Supabase backend.

## Apps

- `apps/hub` - Neothink Hub, the central application
- `apps/ascenders` - Ascenders platform
- `apps/neothinkers` - Neothinkers platform
- `apps/immortals` - Immortals platform

## User Guide

### Platform Journey

Each Neothink platform offers a week-by-week progressive experience:

#### Week 1
- **Discover** is fully unlocked as your starting point
- **Onboard** is visible but locked (available in Week 2)
- **Progress** and **Endgame** are hidden (unlocked in Weeks 3 and 4)

#### Week 2
- **Discover** remains available
- **Onboard** unlocks, providing deeper engagement
- **Progress** remains hidden
- **Endgame** remains hidden

#### Week 3
- **Discover** and **Onboard** remain available
- **Progress** unlocks, allowing tracking of your journey
- **Endgame** remains hidden

#### Week 4
- All features become available, including **Endgame**
- Full platform integration is unlocked

### Live URLs

#### Neothink+ Hub (go.neothink.io)
- [/discover](https://go.neothink.io/discover) - Starting point for your journey
- [/onboard](https://go.neothink.io/onboard) - Deeper dive (Week 2)
- [/progress](https://go.neothink.io/progress) - Track your growth (Week 3)
- [/endgame](https://go.neothink.io/endgame) - Master experiences (Week 4)

#### Ascenders (joinascenders.org)
- [/prosper](https://joinascenders.org/prosper) - Starting point
- [/wealth](https://joinascenders.org/wealth) - Wealth building (Week 2)
- [/community](https://joinascenders.org/community) - Business network (Week 3)

#### Neothinkers (joinneothinkers.org)
- [/neothink/revolution](https://joinneothinkers.org/neothink/revolution) - Starting point
- [/neothink/fellowship](https://joinneothinkers.org/neothink/fellowship) - Community (Week 2)
- [/neothink/curriculum](https://joinneothinkers.org/neothink/curriculum) - Learning path (Week 2)

#### Immortals (joinimmortals.org)
- [/vitality](https://joinimmortals.org/vitality) - Starting point
- [/longevity](https://joinimmortals.org/longevity) - Health foundation (Week 2)
- [/optimization](https://joinimmortals.org/optimization) - Advanced techniques (Week 3)

## App Templates and Structure

Each platform follows a similar structure with platform-specific customizations:

### Neothink+ Hub (go.neothink.io)
- Central hub for all Neothink platforms
- User management and cross-platform navigation
- Content library and progress tracking
- Platform switching capabilities

### Ascenders (joinascenders.org)
- Business-focused platform for entrepreneurs
- Customized content with business metrics tracking
- Achievement and milestone tracking
- Community features for business networking

### Neothinkers (joinneothinkers.org)
- Learning-focused platform
- Course progression and knowledge tracking
- Community discussion forums
- Interactive learning tools and assessments

### Immortals (joinimmortals.org)
- Health-focused platform
- Wellness tracking and health metrics
- Legacy planning and documentation
- Community for health-minded individuals

## Quickstart Guide

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env.local` in each app directory and fill in the values
4. Start a specific platform:
   ```bash
   # For Neothink+ Hub
   pnpm --filter @neothink/hub dev
   
   # For Ascenders
   pnpm --filter @neothink/ascenders dev
   
   # For Neothinkers
   pnpm --filter @neothink/neothinkers dev
   
   # For Immortals
   pnpm --filter @neothink/immortals dev
   ```

5. Access the platforms at their respective URLs:
   - Hub: [go.neothink.io](https://go.neothink.io)
   - Ascenders: [joinascenders.org](https://joinascenders.org)
   - Neothinkers: [joinneothinkers.org](https://joinneothinkers.org)
   - Immortals: [joinimmortals.org](https://joinimmortals.org)

## Shared Packages

- `packages/core` - Core utilities, authentication, and database access with Supabase client
- `packages/analytics` - Shared analytics tracking with Supabase for user events and interactions
- `packages/types` - Shared TypeScript types, including Supabase-generated database types
- `packages/ui` - Shared UI components and design system for consistent platform experiences
- `packages/hooks` - Shared React hooks for data fetching, authentication, and analytics
- `packages/testing` - Testing utilities and shared test configurations

## Supabase Architecture

This project uses a single Supabase project for all applications with a carefully designed database schema:

### Database Schema

- `auth.users` - Supabase Auth users
- `profiles` - Extended user profiles with platform access flags
- `content` - Content items (articles, videos, courses) with platform-specific filtering
- `progress` - User progress on content items
- `achievements` - Achievements that users can earn
- `user_achievements` - Junction table for user-achievement relationships
- `analytics_events` - Events tracking for analytics
- `user_progress` - User progression journey tracking week-by-week

### Security and Access Control

- Row Level Security (RLS) policies ensure users can only access data they're authorized to see
- Platform access flags in user profiles control access to different applications
- Rate limiting implemented with PostgreSQL functions

## Getting Started for Developers

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env.local` in each app directory and fill in the values
4. Start the development server with `pnpm dev`

## Environment Setup

Each application requires these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

To verify your environment configuration is correct, run the following script:

```bash
pnpm verify-env
```

This script validates that all required Vercel environment variables are properly configured and checks for Supabase connectivity.

## Scripts

- `pnpm build` - Build all packages and applications
- `pnpm dev` - Start the development server
- `pnpm lint` - Lint all packages and applications
- `pnpm clean` - Clean all build outputs
- `pnpm verify-env` - Verify environment variables are correctly set

## Database Migrations

Migrations are managed through Supabase. To apply a new migration:

1. Connect to your Supabase project
2. Use the Migration tool in packages/core/database/migrations
3. Apply migrations with the Supabase CLI or through the dashboard

## Security Features

- Content Security Policy (CSP) implemented in middleware
- Rate limiting for API endpoints
- Row Level Security for all database tables
- Secure authentication flows with Supabase Auth 