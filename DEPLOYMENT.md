# Neothink Platforms Deployment Guide

This guide provides step-by-step instructions for deploying the Neothink platforms (Hub, Ascenders, Neothinkers, and Immortals) to Vercel with the role-based access control system.

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
   - Configure Vercel to create preview deployments for PRs
   - Use different databases for preview environments

3. **Rollback plan**:
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