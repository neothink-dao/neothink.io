# Neothink+ Tech Stack

## Overview
This document outlines the core technologies used in the Neothink+ platform ecosystem. We maintain this stack to ensure optimal performance, security, and developer experience across all our platforms.

## Core Technologies

### Frontend Framework
- **Next.js 14**: Our primary framework for building React applications
  - Version: ^14.1.3
  - Features: App Router, Server Components, Route Handlers
  - Usage: All platform UIs (Hub, Ascenders, Neothinkers, Immortals)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Version: ^3.4.1
  - Extensions: @tailwindcss/typography, @tailwindcss/forms
- **Framer Motion**: Animation library
  - Version: ^11.0.8
  - Usage: Interactive UI elements, transitions
- **Radix UI**: Accessible component primitives
  - Version: Various (see package.json)
  - Usage: Core UI components

### State Management & Data Fetching
- **React Query**: Data fetching and caching
  - Version: ^5.0.0
  - Usage: API data management, real-time updates
- **Zustand**: State management
  - Version: ^4.5.0
  - Usage: Global state, platform switching

### Backend & Database
- **Supabase**: Backend as a Service
  - Auth Helpers: @supabase/auth-helpers-nextjs ^0.9.0
  - React Helpers: @supabase/auth-helpers-react ^0.4.2
  - Features: Authentication, Database, Real-time subscriptions

### Development Tools
- **TypeScript**: Type safety
  - Version: ^5.3.3
  - Configuration: Strict mode enabled
- **ESLint**: Code linting
  - Version: ^8.56.0
  - Config: eslint-config-next ^15.0.0
- **Prettier**: Code formatting
  - Version: ^3.2.0

### Testing
- **Vitest**: Unit testing
  - Version: ^1.2.0
- **Playwright**: E2E testing
  - Version: ^1.41.0

### Package Management
- **pnpm**: Fast, disk space efficient package manager
  - Version: ^8.15.0
  - Workspace: Enabled for monorepo

## Environment Requirements
- Node.js: >=20.0.0
- pnpm: ^8.15.0

## Version Control
- **Git**: Source control
- **GitHub**: Repository hosting
  - Actions: CI/CD workflows
  - Pull Request templates
  - Branch protection rules

## Infrastructure
- **Vercel**: Deployment platform
  - Features: Edge Functions, Analytics, Image Optimization
- **Supabase**: Database and Authentication
  - PostgreSQL: Latest stable version
  - PostgREST: API generation
  - GoTrue: Authentication

## Monitoring & Analytics
- **Vercel Analytics**: Performance monitoring
- **Supabase Logs**: Database monitoring
- **PostHog**: User analytics
  - Version: ^3.0.0

## Security
- **Auth.js**: Authentication framework
  - Version: ^4.0.0
- **jose**: JWT handling
  - Version: ^5.0.0
- **zod**: Runtime type checking
  - Version: ^3.22.0

## Date & Time
- **date-fns**: Date manipulation
  - Version: ^3.3.1

## Additional Tools
- **sharp**: Image processing
  - Version: ^0.33.0
- **nanoid**: ID generation
  - Version: ^5.0.0

## Dependency Overrides
```json
{
  "overrides": {
    "next": "^14.1.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## Notes
- All versions are kept up to date with security patches
- Major version upgrades are evaluated quarterly
- Dependencies are audited weekly for security vulnerabilities
- Breaking changes are documented in CHANGELOG.md

For detailed configuration of each technology, refer to the respective configuration files in the repository. 