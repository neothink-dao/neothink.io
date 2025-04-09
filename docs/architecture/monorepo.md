# Neothink Monorepo Architecture

## Overview

The Neothink project uses a monorepo architecture to maintain multiple related websites and applications that share a common codebase and infrastructure. This document outlines the structure, principles, and workflows of our monorepo setup.

## Directory Structure

```
/
├── apps/                  # Deployable applications
│   ├── go.neothink.io/    # Hub platform
│   ├── joinascenders/     # Ascenders platform
│   ├── joinimmortals/     # Immortals platform
│   └── joinneothinkers/   # Neothinkers platform
├── packages/              # Shared internal packages
│   ├── database/          # Database client and utilities
│   ├── auth/              # Authentication logic
│   ├── ui/                # UI components
│   ├── config/            # Shared configuration
│   └── utils/             # Common utilities
├── docs/                  # Documentation
└── supabase/              # Database definitions
```

## Apps

Each platform is hosted under its own domain and has a separate Next.js application:

- **Hub** (go.neothink.io): Central platform for Neothink content
- **Ascenders** (joinascenders.org): Wealth building platform
- **Neothinkers** (joinneothinkers.org): Neothink community platform
- **Immortals** (joinimmortals.org): Health and longevity platform

All applications share a common Supabase backend and reuse components and logic from the shared packages.

## Shared Packages

### Database Package (@neothink/database)

The database package provides a standardized way to interact with our Supabase backend:

- `createClient`: Factory function for creating platform-specific Supabase clients
- `models`: TypeScript definitions for database entities
- `hooks`: React hooks for data fetching and manipulation
- `utils`: Query building and error handling utilities

### Auth Package (@neothink/auth)

The auth package handles user authentication and authorization:

- `useAuth`: Hook for authentication operations
- `useProtectedRoute`: Hook for protecting routes from unauthenticated users
- `AuthProvider`: Context provider for sharing auth state
- `middleware`: Next.js middleware for route protection
- Components: Login, Register, and other auth-related UI components

### UI Package (@neothink/ui)

The UI package contains shared UI components and design system:

- Design system fundamentals
- Reusable components
- Layout components
- Utility hooks for UI interactions

## Workflows

### Development

1. **Local Development**:
   ```bash
   # Run all platforms simultaneously
   pnpm dev
   
   # Run a specific platform
   pnpm dev:hub
   pnpm dev:ascenders
   pnpm dev:immortals
   pnpm dev:neothinkers
   ```

2. **Package Development**:
   ```bash
   # Run in watch mode
   cd packages/ui
   pnpm dev
   ```

### Build and Deployment

1. **Building the Project**:
   ```bash
   # Build all packages and apps
   pnpm build
   ```

2. **Deployment**:
   Each application is deployed separately to Vercel, but they share the same Supabase backend.

## Dependency Management

We use pnpm workspaces to manage dependencies:

- Root dependencies: Tools used across the entire monorepo (TypeScript, ESLint, etc.)
- Package dependencies: Dependencies specific to shared packages
- App dependencies: Dependencies specific to individual applications

## Best Practices

1. **Code Sharing**: Extract reusable logic to shared packages.
2. **Consistent Patterns**: Use consistent patterns across applications.
3. **Clear Boundaries**: Maintain clear boundaries between apps and packages.
4. **Versioning**: Use changesets for versioning shared packages.
5. **Documentation**: Document shared packages and their APIs.

## Tooling

- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Framework**: Next.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)

## Neothink+ Monorepo Configuration Guide

## Repository Structure

```
neothink-monorepo/
├── go.neothink.io/        # Neothink+ Hub (@neothink/hub)
├── joinascenders/         # Ascenders Platform (@neothink/ascenders)
├── joinneothinkers/      # Neothinkers Platform (@neothink/neothinkers)
├── joinimmortals/        # Immortals Platform (@neothink/immortals)
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # Workspace configuration
└── turbo.json           # Turborepo configuration
```

## Project Configuration

### 1. Vercel Projects

Each platform has its own Vercel project with specific settings:

#### Neothink+ Hub (go.neothink.io)
- Root Directory: `go.neothink.io`
- Framework Preset: Next.js
- Build Command: `cd ../.. && pnpm turbo run build --filter=@neothink/hub...`
- Install Command: `cd ../.. && pnpm install --no-frozen-lockfile`
- Output Directory: `.next`

#### Ascenders (joinascenders)
- Root Directory: `joinascenders`
- Framework Preset: Next.js
- Build Command: `cd ../.. && pnpm turbo run build --filter=@neothink/ascenders...`
- Install Command: `cd ../.. && pnpm install --no-frozen-lockfile`
- Output Directory: `.next`

#### Neothinkers (joinneothinkers)
- Root Directory: `joinneothinkers`
- Framework Preset: Next.js
- Build Command: `cd ../.. && pnpm turbo run build --filter=@neothink/neothinkers...`
- Install Command: `cd ../.. && pnpm install --no-frozen-lockfile`
- Output Directory: `.next`

#### Immortals (joinimmortals)
- Root Directory: `joinimmortals`
- Framework Preset: Next.js
- Build Command: `cd ../.. && pnpm turbo run build --filter=@neothink/immortals...`
- Install Command: `cd ../.. && pnpm install --no-frozen-lockfile`
- Output Directory: `.next`

### 2. Vercel.json Configuration

Each project's `vercel.json` should follow this structure:

```json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@neothink/{project}...",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "outputDirectory": ".next",
  "git": {
    "deploymentEnabled": true,
    "vercelConfigUpdated": true,
    "projectId": "[project-specific-id]"
  }
}
```

## Deployment Process

### GitHub to Vercel Workflow

1. Push changes to GitHub main branch at https://github.com/neothink-dao/neothink.io
2. Vercel automatically:
   - Detects which projects were affected by the changes using Turborepo's dependency graph
   - Triggers builds only for affected projects based on the following rules:
     * Changes in project-specific directories (e.g., `go.neothink.io/`) trigger that project only
     * Changes in shared dependencies trigger all dependent projects
     * Changes in root configuration files trigger all projects
   - Uses Turborepo's cache for optimization
   - Deploys updated projects to production

### Monorepo Detection Rules

1. **Project-Specific Changes**
   - Files in `go.neothink.io/` → Triggers Hub deployment only
   - Files in `joinascenders/` → Triggers Ascenders deployment only
   - Files in `joinneothinkers/` → Triggers Neothinkers deployment only
   - Files in `joinimmortals/` → Triggers Immortals deployment only

2. **Shared Resource Changes**
   - Changes to `package.json` or `pnpm-workspace.yaml` → Triggers all projects
   - Changes to `turbo.json` → Triggers all projects
   - Changes to shared components or utilities → Triggers dependent projects

3. **Configuration Changes**
   - Project-specific `vercel.json` changes → Triggers that project only
   - Project-specific `.env` changes → Triggers that project only

### Important Rules

1. **DO NOT** create manual GitHub Actions for deployment
2. **DO NOT** modify Vercel's Git Integration settings
3. **ALWAYS** use Turborepo for build commands
4. **ALWAYS** maintain project-specific `vercel.json` files
5. **NEVER** disable Vercel's automatic deployments
6. **ALWAYS** ensure each project's `vercel.json` has the correct:
   - `projectId`
   - `buildCommand` with proper package filter
   - Git integration settings

## Supabase Integration

All projects share the same Supabase "neothink" project (ID: dlmpxgzxdtqxyzsmpaxx) for:
- Authentication
- Database
- Storage
- Edge Functions
- Realtime subscriptions

### Supabase Configuration

1. **Environment Variables**
   - All projects use the same Supabase URL and keys
   - Variables are stored in Vercel's environment settings
   - Each project maintains its own platform-specific tables

2. **Database Schema**
   - Shared tables use the `public` schema
   - Platform-specific tables use dedicated schemas:
     * `hub_` prefix for Hub tables
     * `ascenders_` prefix for Ascenders tables
     * `neothinkers_` prefix for Neothinkers tables
     * `immortals_` prefix for Immortals tables

3. **Row Level Security (RLS)**
   - Each platform has its own RLS policies
   - Cross-platform access is controlled via role-based policies
   - Shared resources use platform-agnostic policies

## Environment Variables

### Vercel Project Settings

Each project needs these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://dlmpxgzxdtqxyzsmpaxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=@supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=@supabase_service_role_key
```

### Platform-Specific Variables

Each platform has unique environment variables in their `vercel.json`:

```json
{
  "env": {
    "NEXT_PUBLIC_PLATFORM_NAME": "[Platform Name]",
    "NEXT_PUBLIC_PLATFORM_SLUG": "[platform-slug]",
    "NEXT_PUBLIC_BASE_URL": "https://[platform-domain]"
  }
}
```

## Troubleshooting

### Common Issues

1. **Builds failing**: 
   - Verify root directory settings in Vercel
   - Check Turborepo filter syntax
   - Ensure pnpm workspace is configured correctly

2. **Deployment not triggering**:
   - Verify Git Integration is enabled
   - Check project's `vercel.json` configuration
   - Confirm `deploymentEnabled` is true

3. **Environment variables missing**:
   - Check Vercel project settings
   - Verify `vercel.json` environment configuration
   - Ensure variables are properly scoped

## Best Practices

1. **Monorepo Structure**
   - Keep shared dependencies at root level
   - Use consistent naming in package.json files
   - Maintain clear directory structure

2. **Version Control**
   - Commit `vercel.json` changes carefully
   - Never commit sensitive environment variables
   - Keep configuration files up to date

3. **Deployment**
   - Let Vercel handle deployment automation
   - Use Turborepo for build optimization
   - Maintain project-specific settings

## Maintenance

### Regular Checks

1. Verify Vercel project settings monthly
2. Update documentation when configurations change
3. Review environment variables quarterly
4. Check Turborepo cache performance

### Updates

1. Keep Next.js versions aligned across projects
2. Update shared dependencies at root level
3. Maintain consistent Node.js versions
4. Keep Turborepo updated

## Security

1. **Environment Variables**
   - Use Vercel's environment variable management
   - Never commit sensitive data
   - Rotate keys regularly

2. **Access Control**
   - Maintain proper GitHub permissions
   - Restrict Vercel project access
   - Monitor deployment logs

## Support

For issues or questions:
1. Check this documentation first
2. Review Vercel's monorepo guides
3. Consult Turborepo documentation
4. Contact the development team 