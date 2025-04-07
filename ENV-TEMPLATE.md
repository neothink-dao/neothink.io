# Environment Variables Template for Neothink Platforms

This document outlines the environment variables needed for each Neothink platform.

## Common Environment Variables
These variables should be set for all platforms:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Hosting
NEXT_PUBLIC_VERCEL_URL=your-vercel-url
VERCEL_PROJECT_ID=your-project-id
```

## Platform-Specific Variables

### Hub (go.neothink.io)
```
NEXT_PUBLIC_PLATFORM_NAME=Hub
NEXT_PUBLIC_PLATFORM_SLUG=hub
NEXT_PUBLIC_PRIMARY_COLOR=#3b82f6
NEXT_PUBLIC_DARK_COLOR=#1e40af
NEXT_PUBLIC_PLATFORM_DESCRIPTION="Your gateway to the Neothink ecosystem"
```

### Ascenders (joinascenders.org)
```
NEXT_PUBLIC_PLATFORM_NAME=Ascenders
NEXT_PUBLIC_PLATFORM_SLUG=ascenders
NEXT_PUBLIC_PRIMARY_COLOR=#10b981
NEXT_PUBLIC_DARK_COLOR=#047857
NEXT_PUBLIC_PLATFORM_DESCRIPTION="Your path to greater prosperity"
```

### Neothinkers (joinneothinkers.org)
```
NEXT_PUBLIC_PLATFORM_NAME=Neothinkers
NEXT_PUBLIC_PLATFORM_SLUG=neothinkers
NEXT_PUBLIC_PRIMARY_COLOR=#8b5cf6
NEXT_PUBLIC_DARK_COLOR=#6d28d9
NEXT_PUBLIC_PLATFORM_DESCRIPTION="Your journey to integrated thinking"
```

### Immortals (joinimmortals.org)
```
NEXT_PUBLIC_PLATFORM_NAME=Immortals
NEXT_PUBLIC_PLATFORM_SLUG=immortals
NEXT_PUBLIC_PRIMARY_COLOR=#f97316
NEXT_PUBLIC_DARK_COLOR=#c2410c
NEXT_PUBLIC_PLATFORM_DESCRIPTION="Your path to optimal health and longevity"
```

## Role-Based Access Configuration

These variables control the default roles and features:

```
# Default role for new users
NEXT_PUBLIC_DEFAULT_ROLE=subscriber

# Enable/disable features
NEXT_PUBLIC_ENABLE_ADVANCED_FEATURES=false
NEXT_PUBLIC_ENABLE_ADMIN_FEATURES=true

# Role progression requirements
NEXT_PUBLIC_CONTRIBUTOR_MIN_DAYS=30
NEXT_PUBLIC_PARTICIPANT_MIN_ACTIONS=5
```

## Deployment Instructions

1. Copy the relevant variables to your Vercel project's environment variables
2. Ensure all required variables are set before deployment
3. Use different values for development, staging, and production environments
4. Keep sensitive keys secret and never commit them to your repository

## Vercel Deployment Configuration

For each platform, set up a separate Vercel project with:

1. The same repository but different environment variables
2. Production branch: `main`
3. Framework preset: `Next.js`
4. Root directory: `/` (monorepo)
5. Build command: Different for each platform (see below)

### Build Commands

#### Hub
```
cd .. && NEXT_PUBLIC_PLATFORM_SLUG=hub npm run build
```

#### Ascenders
```
cd .. && NEXT_PUBLIC_PLATFORM_SLUG=ascenders npm run build
```

#### Neothinkers
```
cd .. && NEXT_PUBLIC_PLATFORM_SLUG=neothinkers npm run build
```

#### Immortals
```
cd .. && NEXT_PUBLIC_PLATFORM_SLUG=immortals npm run build
``` 