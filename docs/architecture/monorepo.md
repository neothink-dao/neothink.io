# Neothink Sites Monorepo

This monorepo contains the source code for all Neothink platform sites and applications. The repository is organized as follows:

## Repository Structure

```
/
├── go.neothink.io/           # Hub platform
├── joinascenders.org/        # Ascenders platform
├── joinneothinkers.org/      # Neothinkers platform
├── joinimmortals.org/        # Immortals platform
├── supabase/                # Supabase configuration
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
└── docs/                    # Documentation
```

## Repository Mappings

Each site/app in the monorepo corresponds to its own GitHub repository:

| Local Directory | GitHub Repository | Platform | Vercel Project | Production URL |
|----------------|-------------------|----------|----------------|----------------|
| `/go.neothink.io` | [neothink-dao/neothink.io](https://github.com/neothink-dao/neothink.io) | Hub | neothink-io | go.neothink.io |
| `/joinascenders.org` | [neothink-dao/ascenders](https://github.com/neothink-dao/ascenders) | Ascenders | join-ascenders | joinascenders.org |
| `/joinneothinkers.org` | [neothink-dao/neothinkers](https://github.com/neothink-dao/neothinkers) | Neothinkers | join-neothinkers | joinneothinkers.org |
| `/joinimmortals.org` | [neothink-dao/immortals](https://github.com/neothink-dao/immortals) | Immortals | join-immortals | joinimmortals.org |

## Shared Resources

### Authentication & Backend
While each site has its own GitHub repository and codebase, they all share the same Supabase backend:
- Direct integration with @supabase/ssr in each site
- Independent session management per site
- Platform-specific auth flows
- Local middleware implementation in lib/supabase/middleware.ts
- Shared Supabase instance for:
  - User authentication
  - Database access
  - Edge functions
  - Email templates
  - RLS policies

### Supabase Configuration
The `supabase` directory contains the shared backend configuration that all sites connect to:
- Edge functions for authentication
- Database migrations
- Platform-specific settings
- Email templates
- RLS policies

## Development Guidelines

1. When making changes to authentication:
   - Update the shared Supabase configuration if needed
   - Ensure changes are compatible with all platforms
   - Test changes across all sites
2. Platform-specific changes should be made in their respective directories
3. Database migrations affect all platforms and must be tested thoroughly
4. Follow the established branching strategy for each repository

## Deployment

### Platform-Specific Deployments
Each platform is deployed independently through its respective GitHub repository and Vercel project:

1. **Hub Platform (go.neothink.io)**
   - Repository: neothink-dao/neothink.io
   - Vercel Project: neothink-io
   - Production URL: go.neothink.io
   - Preview URL: v0-go-neothink.vercel.app

2. **Ascenders Platform (joinascenders.org)**
   - Repository: neothink-dao/ascenders
   - Vercel Project: join-ascenders
   - Production URL: joinascenders.org
   - Preview URL: v0-join-ascenders.vercel.app

3. **Neothinkers Platform (joinneothinkers.org)**
   - Repository: neothink-dao/neothinkers
   - Vercel Project: join-neothinkers
   - Production URL: joinneothinkers.org
   - Preview URL: v0-join-neothinkers.vercel.app

4. **Immortals Platform (joinimmortals.org)**
   - Repository: neothink-dao/immortals
   - Vercel Project: join-immortals
   - Production URL: joinimmortals.org
   - Preview URL: v0-join-immortals.vercel.app

### Deployment Process
1. Each platform uses GitHub Actions for CI/CD
2. Workflows are defined in `.github/workflows/` for each platform
3. Environment variables are managed in Vercel
4. Database migrations are run through Supabase CLI
5. Edge functions are deployed through Supabase Dashboard

### Shared Package Deployment
1. The auth package is published to npm
2. Version updates follow semantic versioning
3. All platforms must be updated to use the latest version
4. Changes to shared packages require testing on all platforms

### Database Migrations
1. Migrations are run in order using Supabase CLI
2. Each migration is tested in development
3. Rollback plans are documented
4. Migrations must be backward compatible 