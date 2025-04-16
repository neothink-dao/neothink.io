# Vercel Deployment Guide for Neothink Monorepo

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../../LICENSE) file for details.

> **See Also:**
> - [Main Deployment Guide](./VERCEL-DEPLOYMENT.md)
> - [Onboarding & Getting Started](../getting-started/README.md)
> - [Launch Checklist](./launch-checklist.md)
> - [Supabase Integration](../database/SUPABASE-INTEGRATION.md)
> - [Security Guide](../security/security.md)
> - [Environment Variable Template](../../.env.example)

This guide documents the correct setup and troubleshooting steps for deploying the Neothink monorepo to Vercel, ensuring all four applications deploy correctly and efficiently.

## Architecture Overview

The Neothink platform consists of four separate Vercel projects, all deployed from the same monorepo:

1. **Hub** - Central platform (go.neothink.io)
2. **Immortals** - Immortal society platform (joinimmortals.com)
3. **Ascenders** - Business platform (joinascenders.com)
4. **Neothinkers** - Learning platform (joinneothinkers.com)

All four apps share:
- A single monorepo with Turborepo
- Common packages in the `packages/` directory
- A single Supabase project ("neothink")
- PNPM as the package manager (v8.15.4)

## Vercel Configuration

Each app has its own `vercel.json` configuration file with the following critical settings:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "cd ../.. && npm install -g pnpm@8.15.4 && export PATH=\"/root/.npm-global/bin:$PATH\" && pnpm install --no-frozen-lockfile",
  "buildCommand": "cd ../.. && export PATH=\"/root/.npm-global/bin:$PATH\" && pnpm turbo run build --filter=@neothink/{APP_NAME}...",
  "outputDirectory": ".next",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "development": true
    }
  },
  "ignoreCommand": "git diff HEAD^ HEAD --quiet ./ ../../packages/",
  "version": 2
}
```

### Key Configuration Elements

1. **Path Export**: `export PATH="/root/.npm-global/bin:$PATH"` ensures the globally installed pnpm is used
2. **No Frozen Lockfile**: `--no-frozen-lockfile` ensures builds don't fail due to lockfile discrepancies
3. **Turbo Filtering**: `--filter=@neothink/{APP_NAME}...` builds only the necessary dependencies
4. **Git Integration**: The `git.deploymentEnabled` ensures automatic deployments
5. **Smart Ignoring**: `ignoreCommand` ensures builds only run when relevant files change

## Deployment Rules

Follow these rules to ensure correct deployments:

### 1. PNPM Version Management

The monorepo requires pnpm 8.15.4. The proper installation is handled by:

```bash
npm install -g pnpm@8.15.4 && export PATH="/root/.npm-global/bin:$PATH"
```

This must be included in both `installCommand` and `buildCommand` to ensure the correct pnpm version is used throughout.

### 2. Environment Variables

Each project must have the following environment variables set in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The Supabase anon key
- `DATABASE_URL`: The direct PostgreSQL connection string (for prisma/migrations)

### 3. Build Cache Management

Turborepo caching is managed through:

1. **Local Caching**: Automatic on developer machines
2. **Remote Caching**: Using Vercel's Turborepo Remote Cache

To enable remote caching:
- Set `TURBO_TOKEN` in all Vercel projects
- Set `TURBO_TEAM` to your team slug

### 4. Monorepo Configuration

The root `package.json` should maintain:

```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": "8.15.4"
},
"packageManager": "pnpm@8.15.4",
```

### 5. Build Optimization

For optimal build times:
- Use the ignoreCommand to skip unnecessary builds
- Use Turborepo's content-based hashing
- Maintain a .vercelignore file at the repo root

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. PNPM Version Mismatch

**Symptom**: `ERR_PNPM_UNSUPPORTED_ENGINE Unsupported environment`

**Solution**:
- Ensure PATH is exported correctly: `export PATH="/root/.npm-global/bin:$PATH"`
- Verify both installCommand and buildCommand use the same PATH setup
- Confirm pnpm version in root package.json matches vercel.json

#### 2. Build Timeouts

**Symptom**: Builds exceed Vercel's timeout limit

**Solution**:
- Optimize Turborepo cache
- Use `--filter` to limit what's built
- Consider splitting larger apps

#### 3. Missing Dependencies

**Symptom**: `Cannot find module` errors

**Solution**:
- Ensure workspaces are properly configured
- Check dependency hoisting
- Verify packages use proper exports

#### 4. Environment Variable Issues

**Symptom**: Runtime errors about missing environment variables

**Solution**:
- Use the Vercel UI to check environment configurations
- Set variables at both project and organization level as needed
- Use `.env.example` to document required variables

## Maintenance Procedures

### 1. Updating Dependencies

When updating dependencies:
1. Update root package.json first
2. Run pnpm update in root
3. Test locally before pushing
4. Monitor deployments for all apps

### 2. Adding New Packages

When adding new shared packages:
1. Create in packages/ directory
2. Update tsconfig.json references
3. Add to consuming apps with `pnpm add @neothink/package-name@workspace:*`
4. Test a full build with Turborepo

### 3. Monitoring Deployments

Best practices for monitoring:
1. Set up Vercel Slack/Discord notifications
2. Check build logs for warnings
3. Monitor build times and optimize as needed
4. Set up error tracking with Sentry

## Integration with Supabase

The "neothink" Supabase project is shared across all apps:

1. **Database Migrations**: Run from a single source of truth
2. **Authentication**: Shared auth across platforms
3. **Storage**: Centralized file storage
4. **Edge Functions**: Shared serverless functions

Each app should:
1. Use the same Supabase URL and keys
2. Maintain schema consistency
3. Use RLS policies for access control

## Emergency Procedures

If all deployments are failing:

1. **Immediate Fix**: Push a reversion commit if a specific change caused issues
2. **Temporary Workaround**: Deploy from a stable branch/tag
3. **Debugging**: Use Vercel's "Skip Build Step" to debug issues
4. **Rollback Plan**: Keep known working deployment URLs for emergencies

## Best Practices

1. **Test Locally First**: Always test full build using `turbo run build`
2. **Atomic Commits**: Make focused commits that can be easily reverted
3. **Branch Strategy**: Use feature branches, develop branch, and main branch
4. **Deployment Tests**: Add post-deployment tests to verify functionality
5. **Documentation**: Keep this deployment guide updated with any changes

## Vercel Project Setup Checklist

Use this checklist when setting up new Vercel projects:

- [ ] Framework preset: Next.js
- [ ] Root Directory: apps/{app-name}
- [ ] Build Command: Overridden in vercel.json
- [ ] Install Command: Overridden in vercel.json
- [ ] Output Directory: .next
- [ ] Environment Variables: All required variables added
- [ ] Production Branch: main
- [ ] Preview Branches: enabled for development and feature branches
- [ ] Deployment Protection: As required by security policy 

## See Also
- [Main Deployment Guide](./VERCEL-DEPLOYMENT.md)
- [Onboarding & Getting Started](../getting-started/README.md)
- [Launch Checklist](./launch-checklist.md)
- [Supabase Integration](../database/SUPABASE-INTEGRATION.md)
- [Security Guide](../security/security.md)
- [Environment Variable Template](../../.env.example) 