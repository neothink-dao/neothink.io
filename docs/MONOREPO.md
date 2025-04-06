# Neothink Sites Monorepo

This monorepo contains the source code for all Neothink platform sites and applications. The repository is organized as follows:

## Repository Structure

```
/
├── lib/                     # Shared library code
│   ├── supabase/            # Supabase client & auth utilities
│   ├── utils/               # Common utilities
│   ├── hooks/               # React hooks
│   ├── components/          # Shared UI components
│   ├── theme/               # Theming system
│   └── config/              # Platform configuration
├── go.neothink.io/          # Hub platform
├── joinascenders/           # Ascenders platform
├── joinneothinkers/         # Neothinkers platform
├── joinimmortals/           # Immortals platform
├── supabase/                # Supabase configuration
│   ├── functions/           # Edge functions
│   └── migrations/          # Database migrations
├── scripts/                 # Utility scripts
└── docs/                    # Documentation
```

## Repository Mappings

Each site/app in the monorepo corresponds to a Vercel project:

| Local Directory | Platform | Vercel Project | Production URL |
|----------------|----------|----------------|----------------|
| `/go.neothink.io` | Hub | neothink-io | go.neothink.io |
| `/joinascenders` | Ascenders | join-ascenders | joinascenders.org |
| `/joinneothinkers` | Neothinkers | join-neothinkers | joinneothinkers.org |
| `/joinimmortals` | Immortals | join-immortals | joinimmortals.org |

## Turborepo Configuration

This monorepo uses Turborepo for dependency management and build optimization:

- **turbo.json**: Defines the build pipeline and task dependencies
- **Workspace Setup**: Each platform is a workspace in the monorepo
- **Caching**: Build artifacts are cached for faster subsequent builds
- **Parallel Execution**: Tasks are executed in parallel when possible
- **Global Dependencies**: Environment variables shared across all workspaces

### Turborepo Pipeline

The following tasks are defined in the Turborepo pipeline:

- **build**: Builds all workspaces (Next.js apps)
- **lint**: Runs linting on all workspaces
- **dev**: Starts the development server for each workspace
- **clean**: Cleans build artifacts
- **test**: Runs tests for each workspace

## Shared Resources

### Authentication & Backend
While each site has its own directory and codebase, they all share the same Supabase backend:
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
4. Use the Turborepo pipeline for building and testing

## Deployment

### Platform-Specific Deployments
Each platform is deployed independently through its Vercel project:

1. **Hub Platform (go.neothink.io)**
   - Vercel Project: neothink-io
   - Production URL: go.neothink.io
   - Directory: `/go.neothink.io`

2. **Ascenders Platform (joinascenders.org)**
   - Vercel Project: join-ascenders
   - Production URL: joinascenders.org
   - Directory: `/joinascenders`

3. **Neothinkers Platform (joinneothinkers.org)**
   - Vercel Project: join-neothinkers
   - Production URL: joinneothinkers.org
   - Directory: `/joinneothinkers`

4. **Immortals Platform (joinimmortals.org)**
   - Vercel Project: join-immortals
   - Production URL: joinimmortals.org
   - Directory: `/joinimmortals`

### Deployment Process
1. Each platform is deployed through Vercel
2. Environment variables are managed in Vercel
3. Database migrations are run through Supabase CLI
4. Edge functions are deployed through Supabase Dashboard

### Database Migrations
1. Migrations are run in order using Supabase CLI
2. Each migration is tested in development
3. Rollback plans are documented
4. Migrations must be backward compatible 