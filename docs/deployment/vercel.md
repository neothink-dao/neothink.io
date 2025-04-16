# Neothink Platforms Deployment Guide

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../../LICENSE) file for details.

> **See Also:**
> - [Main Deployment Guide](./VERCEL-DEPLOYMENT.md)
> - [Onboarding & Getting Started](../getting-started/README.md)
> - [Launch Checklist](./launch-checklist.md)
> - [CI/CD & Advanced Deployment](./vercel-deployment-guide.md)
> - [Supabase Integration](../database/SUPABASE-INTEGRATION.md)
> - [Security Guide](../security/security.md)
> - [Environment Variable Template](../../.env.example)

## Today's Production Launch Guide

### Pre-Launch Checklist

1. **Database Setup Verification**
   - ✅ Confirm `user_progress` table is properly configured for week-based progression
   - ✅ Verify `analytics_events` table is set up to capture all interaction types
   - ✅ Check RLS policies to ensure proper data isolation and security

2. **Feature Readiness**
   - ✅ Verify `/discover` pages are fully functional across all platforms
   - ✅ Confirm locked features display appropriate teaser content
   - ✅ Test hidden routes redirect correctly to 404

3. **Environment Variables**
   - ✅ Check all Vercel projects have correct environment variables
   - ✅ Verify Supabase connection strings and API keys are properly set
   - ✅ Confirm analytics tracking is enabled for production

### Launch Sequence

1. **Deploy to Production**
   ```bash
   # Push latest changes to main branch
   git push origin main
   ```

2. **Monitor Vercel Deployments**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) and monitor deployments:
     - Hub: https://vercel.com/neothink/go-neothink-io
     - Ascenders: https://vercel.com/neothink/joinascenders
     - Neothinkers: https://vercel.com/neothink/joinneothinkers
     - Immortals: https://vercel.com/neothink/joinimmortals

3. **Production Verification**
   - Check all production URLs for proper rendering and functionality
   - Verify authentication flows
   - Confirm analytics events are being recorded
   - Test the user progression journey

### Post-Launch Monitoring

1. **Supabase Dashboard Analytics**
   - Go to [Supabase Dashboard](https://app.supabase.io/)
   - Select "neothink" project
   - Navigate to "Table Editor" to check recorded analytics events
   - Run the following queries to monitor usage:

   ```sql
   -- Check recent analytics events
   SELECT 
     created_at, 
     platform, 
     event_name, 
     event_category 
   FROM analytics_events
   ORDER BY created_at DESC
   LIMIT 100;

   -- Monitor user progression
   SELECT 
     platform, 
     week_number, 
     COUNT(*) as user_count
   FROM user_progress
   GROUP BY platform, week_number
   ORDER BY platform, week_number;

   -- Track feature unlock attempts
   SELECT 
     platform, 
     COUNT(*) as attempt_count
   FROM analytics_events
   WHERE event_name = 'feature_unlock_attempt'
   GROUP BY platform
   ORDER BY attempt_count DESC;
   ```

2. **Real-time Error Tracking**
   - Check error logs in Vercel deployments
   - Monitor Supabase function errors
   - Watch for error events in the `analytics_events` table

3. **User Engagement Metrics**
   - Use the Supabase Dashboard to run the following query for initial engagement metrics:

   ```sql
   -- User engagement summary
   SELECT 
     platform,
     COUNT(DISTINCT user_id) as unique_users,
     COUNT(*) FILTER (WHERE event_name = 'page_view') as page_views,
     COUNT(*) FILTER (WHERE event_name = 'content_interaction') as interactions,
     COUNT(*) FILTER (WHERE event_name = 'feature_unlock_attempt') as unlock_attempts
   FROM analytics_events
   WHERE timestamp > NOW() - INTERVAL '24 hours'
   GROUP BY platform;
   ```

## GitHub Actions CI/CD Workflows

The repository includes GitHub Actions workflows that automate testing and deployment processes:

### 1. Test Workflow (`test.yml`)

This workflow runs on all pull requests and pushes to the main branch:

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test Packages and Apps
    runs-on: ubuntu-latest
    steps:
      # Checkout, setup Node.js, pnpm, etc.
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Run tests with coverage
        run: pnpm test
        
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
```

**Key Features:**
- Ensures code quality through linting, type checking, and tests
- Runs automatically on all PRs and pushes to main
- Uploads test coverage reports to Codecov
- Prevents merging if tests fail

### 2. Preview Deployment Workflow (`deploy-preview.yml`)

This workflow creates preview deployments for pull requests:

```yaml
name: Vercel Preview Deployment

on:
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    steps:
      # Checkout, setup Node.js, pnpm, etc.
      - name: Build Project Artifacts
        run: pnpm build
        
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Comment Preview URL
        uses: actions/github-script@v6
        # Adds preview URL as a comment on the PR
```

**Key Features:**
- Creates preview deployments for each PR
- Comments the preview URL directly on the PR
- Allows testing in an isolated environment
- Integrates with Vercel's preview environments

### Triggering Workflows

- **Tests** run automatically on:
  - Every pull request to main
  - Every push to main
  - Can be manually triggered from GitHub Actions tab

- **Preview Deployments** run on:
  - Every pull request to main
  - Can be manually triggered from GitHub Actions tab

### Checking Workflow Results

1. **Test Results**
   - Navigate to the "Actions" tab in the GitHub repository
   - Click on the specific workflow run
   - Check the "Test Packages and Apps" job for details
   - View test coverage reports on Codecov

2. **Preview Deployments**
   - Check the PR comments for the preview URL
   - Click the link to access the preview deployment
   - Test your changes in the isolated environment
   - Preview URLs follow the pattern: `https://neothink-<platform>-git-<branch>-neothink.vercel.app`

## Prerequisites

- A Vercel account with appropriate permissions
- A Supabase account with the project set up
- Git repository access for the Neothink platforms codebase
- Domain names configured for each platform

## 1. Prepare Each Platform for Deployment

For each platform, you'll need to create a separate Vercel project and configure it appropriately.

### Common Configuration

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/neothink-platforms.git
   cd neothink-platforms
   ```

2. **Verify the codebase**:
   - Ensure all RBAC components are properly implemented
   - Check that platform-specific configurations are set up
   - Test locally with different platform configurations

3. **Set up environment variables**:
   - Create a `.env.local` file for local testing
   - Use the variables defined in `ENV-TEMPLATE.md`

## 2. Deploy Each Platform to Vercel

### Hub (go.neothink.io)

1. **Create a new Vercel project**:
   - Go to [Vercel](https://vercel.com/new)
   - Import your Git repository
   - Configure as follows:
     - Project name: `neothink-hub`
     - Framework preset: `Next.js`
     - Root directory: `/`
     - Build command: `NEXT_PUBLIC_PLATFORM_SLUG=hub npm run build`
     - Output directory: `.next`

2. **Set environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXT_PUBLIC_PLATFORM_NAME=Hub
   NEXT_PUBLIC_PLATFORM_SLUG=hub
   NEXT_PUBLIC_PRIMARY_COLOR=#3b82f6
   NEXT_PUBLIC_DARK_COLOR=#1e40af
   ```

3. **Set up custom domain**:
   - Add domain: `go.neothink.io`
   - Configure DNS settings as instructed by Vercel

### Ascenders (joinascenders.org)

1. **Create a new Vercel project**:
   - Project name: `neothink-ascenders`
   - Build command: `NEXT_PUBLIC_PLATFORM_SLUG=ascenders npm run build`

2. **Set environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXT_PUBLIC_PLATFORM_NAME=Ascenders
   NEXT_PUBLIC_PLATFORM_SLUG=ascenders
   NEXT_PUBLIC_PRIMARY_COLOR=#10b981
   NEXT_PUBLIC_DARK_COLOR=#047857
   ```

3. **Set up custom domain**:
   - Add domain: `joinascenders.org`

### Neothinkers (joinneothinkers.org)

1. **Create a new Vercel project**:
   - Project name: `neothink-neothinkers`
   - Build command: `NEXT_PUBLIC_PLATFORM_SLUG=neothinkers npm run build`

2. **Set environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXT_PUBLIC_PLATFORM_NAME=Neothinkers
   NEXT_PUBLIC_PLATFORM_SLUG=neothinkers
   NEXT_PUBLIC_PRIMARY_COLOR=#8b5cf6
   NEXT_PUBLIC_DARK_COLOR=#6d28d9
   ```

3. **Set up custom domain**:
   - Add domain: `joinneothinkers.org`

### Immortals (joinimmortals.org)

1. **Create a new Vercel project**:
   - Project name: `neothink-immortals`
   - Build command: `NEXT_PUBLIC_PLATFORM_SLUG=immortals npm run build`

2. **Set environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXT_PUBLIC_PLATFORM_NAME=Immortals
   NEXT_PUBLIC_PLATFORM_SLUG=immortals
   NEXT_PUBLIC_PRIMARY_COLOR=#f97316
   NEXT_PUBLIC_DARK_COLOR=#c2410c
   ```

3. **Set up custom domain**:
   - Add domain: `joinimmortals.org`

## 3. Verify Supabase Configuration

1. **Check database schema**:
   - Ensure the tenants table has entries for all platforms
   - Verify that role tables are properly configured
   - Check that default capabilities are set

2. **Verify database functions**:
   - Test role checking functions
   - Verify feature access functions
   - Ensure cross-platform capabilities work

3. **Set up RLS (Row-Level Security)**:
   - Ensure proper policies are in place for user data
   - Verify tenant isolation
   - Test role-based policies

## 4. Test the Deployment

For each platform, verify:

1. **Authentication flow**:
   - Registration works
   - Login works
   - Role assignment is correct

2. **Role-based access**:
   - Content is properly gated based on roles
   - Platform switching works correctly
   - Features are unlocked based on role capability

3. **Cross-platform functionality**:
   - Users can navigate between platforms
   - Permissions are properly synchronized
   - Shared data is accessible across platforms

## 5. Monitor and Debug

1. **Set up logging**:
   - Configure error tracking
   - Set up performance monitoring
   - Track user flows

2. **Create monitoring dashboard**:
   - Track active users
   - Monitor error rates
   - Watch authentication events

3. **Support system**:
   - Set up a support email
   - Document common issues and resolutions
   - Create user guides for test users

## 6. Iterative Deployment

For ongoing development:

1. **Branch strategy**:
   - `main` for production deployments
   - `development` for ongoing work
   - Feature branches for specific features

2. **Preview deployments**:
   - GitHub Actions automatically create preview deployments for PRs
   - Each PR gets its own isolated Vercel environment
   - Preview deployments are deleted when the PR is closed

3. **Rollback plan**:
   - Vercel maintains deployment history for quick rollbacks
   - GitHub Actions support rollback workflows if needed
   - Document how to rollback to previous versions
   - Test rollback procedures regularly

## Quick Reference for Test User Setup

For your test users, ensure the following:

1. **Default permissions**:
   - All test users should be assigned the 'subscriber' role
   - Admins should be assigned 'associate' or higher roles
   - Create a custom welcome flow for test users

2. **Available features for test users**:
   - Profile management
   - Content viewing
   - Basic platform navigation
   - Simple engagement features

3. **Important URLs**:
   - Hub: https://go.neothink.io
   - Ascenders: https://joinascenders.org
   - Neothinkers: https://joinneothinkers.org
   - Immortals: https://joinimmortals.org

## Troubleshooting Common Issues

### Authentication Issues
- Check Supabase credentials
- Verify JWT secret is correctly set
- Ensure redirect URLs are properly configured

### Role-Based Access Issues
- Check role assignments in the database
- Verify capability tables
- Test role utility functions

### Cross-Platform Navigation Issues
- Verify domain configurations
- Check cross-origin policies
- Test platform switching functions

## Conclusion

With these steps completed, your Neothink platforms should be properly deployed with a functioning role-based access control system. Test users should be able to access the appropriate content based on their roles, and administrators should have the tools needed to manage the platform effectively.

# Deploying to Vercel

This guide explains how to deploy the various Neothink platforms to Vercel with our monorepo structure.

## Overview

Our monorepo contains multiple applications that need to be deployed separately to Vercel, while sharing common packages. To deploy correctly, we need to configure each Vercel project to:

1. Build the specific application
2. Include all dependencies needed for that application
3. Optimize build time with Turborepo caching

## Project Configuration

For each platform (hub, ascenders, immortals, neothinkers), follow these steps:

### 1. Create or Update a Vercel Project

For each platform, create or update a Vercel project with the following settings:

- **Project Name**: `neothink-{platform}` (e.g., `neothink-hub`)
- **Framework Preset**: Next.js
- **Root Directory**: `apps/{platform}` (e.g., `apps/hub`)

### 2. Configure Build Settings

Update the build settings for each project:

- **Build Command**:
  ```bash
  cd ../.. && pnpm turbo run build --filter={platform}...
  ```
  
  For example, for the Hub platform:
  ```bash
  cd ../.. && pnpm turbo run build --filter=hub...
  ```

- **Install Command**:
  ```bash
  pnpm install
  ```

- **Output Directory**: `.next`

### 3. Set Environment Variables

Ensure that all required environment variables are set in the Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Any other platform-specific environment variables

### 4. Configure Custom Domains

For each platform, configure its custom domain:

- Hub: `go.neothink.io`
- Ascenders: `joinascenders.org`
- Immortals: `joinimmortals.org`
- Neothinkers: `joinneothinkers.org`

## Monorepo Optimization

### Turborepo Remote Caching

To optimize build times across deployments, enable Turborepo Remote Caching:

1. Link your Vercel account to Turborepo:
   ```bash
   npx turbo login
   ```

2. Enable remote caching:
   ```bash
   npx turbo link
   ```

This will allow Vercel to reuse build artifacts when dependencies haven't changed.

### Ignore Build Step

You can optimize build times by setting up build triggers that only build when relevant files change:

```json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./apps/hub/ ./packages/"
}
```

This would only trigger a build for the Hub project when files in `apps/hub` or any shared package change.

## Continuous Integration

Set up a GitHub action to automatically deploy all platforms when the main branch is updated:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_HUB }}
          working-directory: ./apps/hub
      # Repeat for other platforms
```

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Ensure all shared packages have been built
2. Verify environment variables are correctly set
3. Check that the root directory is correctly configured
4. Look at the actual Vercel build logs for specific errors

### Missing Dependencies

If dependencies are missing during build:

1. Verify that your project's package.json includes all required dependencies
2. Make sure workspace packages are properly linked with `workspace:*`
3. Check that Vercel is using pnpm with the correct workspace configuration

### Long Build Times

If builds are taking too long:

1. Ensure Turborepo remote caching is enabled
2. Set up ignore build step to skip unnecessary builds
3. Optimize your application's build-time performance

## Best Practices

1. **Incremental Builds**: Use Turborepo's caching for faster builds
2. **Environment Variables**: Store environment variables in Vercel project settings
3. **Build Triggers**: Only build when relevant files change
4. **Deploy Previews**: Use Vercel's preview deployments for PRs
5. **Monitoring**: Set up monitoring for deployment failures

## See Also
- [Main Deployment Guide](./VERCEL-DEPLOYMENT.md)
- [Onboarding & Getting Started](../getting-started/README.md)
- [Launch Checklist](./launch-checklist.md)
- [CI/CD & Advanced Deployment](./vercel-deployment-guide.md)
- [Supabase Integration](../database/SUPABASE-INTEGRATION.md)
- [Security Guide](../security/security.md)
- [Environment Variable Template](../../.env.example) 