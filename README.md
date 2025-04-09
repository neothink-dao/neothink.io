# Neothink Platforms Monorepo (2025 Edition)

This repository contains the codebase for all Neothink platforms, including Hub, Ascenders, Neothinkers, and Immortals.

## Tech Stack (2025)

- **Next.js 14.1.3** - React framework with App Router and Route Handlers
- **Tailwind CSS 4.1** - Utility-first CSS framework with new text shadows and masks
- **Shadcn/ui** - Unstyled UI components with new Carousel, Drawer, and Sonner
- **Supabase** - Backend with Edge Functions, Realtime Broadcast, and Read Replicas
- **Vercel** - Deployment platform with 60-day Skew Protection

## Features

- App Router with composable caching strategies
- Modern UI components from Shadcn/ui
- Realtime database updates with Supabase Broadcast
- Edge Functions for serverless compute
- Experimental Read Replica routing
- Extended SEO protection with 60-day skew protection
- Optimized image handling with WebP and AVIF support

## Overview

Neothink is a collection of interconnected platforms that share a common infrastructure and codebase. The platforms are:

- **[Hub](https://go.neothink.io)** - Central platform for Neothink content
- **[Ascenders](https://joinascenders.org)** - Wealth building platform
- **[Neothinkers](https://joinneothinkers.org)** - Neothink community platform
- **[Immortals](https://joinimmortals.org)** - Health and longevity platform

## Repository Structure

```
/
├── apps/                  # Deployable applications
│   ├── hub/               # Hub platform (go.neothink.io)
│   ├── ascenders/         # Ascenders platform (joinascenders.org)
│   ├── immortals/         # Immortals platform (joinimmortals.org)
│   └── neothinkers/       # Neothinkers platform (joinneothinkers.org)
├── packages/              # Shared internal packages
│   ├── database/          # Database client and utilities
│   ├── auth/              # Authentication logic
│   ├── ui/                # UI components
│   ├── config/            # Shared configuration
│   └── utils/             # Common utilities
├── docs/                  # Documentation
└── supabase/              # Database definitions
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/neothink-dao/neothink.io
   cd neothink
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   # For all apps
   pnpm dev

   # For specific app
   pnpm dev:hub
   pnpm dev:ascenders
   pnpm dev:immortals
   pnpm dev:neothinkers
   ```

## Development Workflow

### Database Management
```bash
# Generate types from Supabase
pnpm db:generate

# Push schema changes
pnpm db:push

# Deploy Edge Functions
pnpm supabase:deploy
```

### Build and Deploy
```bash
# Build all apps
pnpm build

# Build specific app
pnpm turbo run build --filter=hub
```

## Architecture

- `apps/*` - Application code
- `packages/*` - Shared internal packages
- `supabase/*` - Database and Edge Function definitions
- `docs/*` - Documentation

## Best Practices

### Next.js
- Use App Router for all new routes
- Implement composable caching strategies
- Use Route Handlers for API endpoints

### Supabase
- Use Edge Functions for compute-intensive tasks
- Implement Realtime Broadcast for real-time updates
- Use Read Replicas for read-heavy operations
- Enable pgBouncer for connection pooling

### Vercel
- Configure Skew Protection for SEO
- Optimize image handling
- Use regional deployments

## Documentation

- [Getting Started](docs/getting-started/index.md)
- [Development Guide](docs/getting-started/development.md)
- [Architecture](docs/architecture/monorepo.md)
- [Database](docs/architecture/database.md)
- [Authentication](docs/architecture/auth.md)
- [UI Components](docs/architecture/ui.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Submit a PR

## License

Proprietary - All rights reserved. 