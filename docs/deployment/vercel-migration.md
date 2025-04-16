# Vercel Migration Guide for Reorganized Monorepo

This guide outlines the specific steps needed to update your Vercel projects after the reorganization of the Neothink monorepo structure. Following these steps is critical for ensuring successful deployments.

## Summary of Directory Changes

We've reorganized the repository from:

**Old Structure:**
```
/
├── go.neothink.io/     # Hub application
├── joinascenders/      # Ascenders application
├── joinimmortals/      # Immortals application
├── joinneothinkers/    # Neothinkers application
├── lib/                # Shared libraries
└── shared/             # Shared components
```

**New Structure:**
```
/
├── apps/
│   ├── hub/            # Previously go.neothink.io
│   ├── ascenders/      # Previously joinascenders
│   ├── immortals/      # Previously joinimmortals
│   └── neothinkers/    # Previously joinneothinkers
└── packages/
    ├── database/       # Database client and utilities
    ├── auth/           # Authentication logic
    ├── ui/             # UI components using Atomic Design
    └── types/          # Shared TypeScript types
```

## Required Vercel Project Updates

For each platform, you must update your Vercel project configuration **before pushing** the reorganized code to GitHub. If you push before updating these settings, the deployments will fail.

### 1. Hub Platform (go.neothink.io)

Update the Vercel project at https://vercel.com/neothink/go-neothink-io:

1. Navigate to **Settings** > **General**
2. Under **Build & Development Settings**, update:
   - **Root Directory**: `apps/hub`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=hub...`

### 2. Ascenders Platform (joinascenders.org)

Update the Vercel project at https://vercel.com/neothink/joinascenders:

1. Navigate to **Settings** > **General**
2. Under **Build & Development Settings**, update:
   - **Root Directory**: `apps/ascenders`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=ascenders...`

### 3. Immortals Platform (joinimmortals.org)

Update the Vercel project at https://vercel.com/neothink/joinimmortals:

1. Navigate to **Settings** > **General**
2. Under **Build & Development Settings**, update:
   - **Root Directory**: `apps/immortals`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=immortals...`

### 4. Neothinkers Platform (joinneothinkers.org)

Update the Vercel project at https://vercel.com/neothink/joinneothinkers:

1. Navigate to **Settings** > **General**
2. Under **Build & Development Settings**, update:
   - **Root Directory**: `apps/neothinkers`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=neothinkers...`

## Verifying Your Configuration

Before pushing to GitHub, you should verify each project's configuration:

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select each Neothink project and check the settings
3. Ensure the Root Directory is set to the correct path
4. Verify the Build Command is using the Turborepo filter syntax

## After Push: Monitoring the Deployment

After pushing to GitHub, monitor the deployments:

1. Check the Vercel deployment logs for each project
2. If you see errors like "Directory not found", it means you missed updating a project's Root Directory
3. If you see missing dependencies, check that your package.json files are properly set up with workspace references

## Troubleshooting Common Issues

### Missing Root Directory

**Error:**
```
Error: Specified target directory "go.neothink.io" does not exist
```

**Solution:**
Update the Root Directory in Vercel project settings to `apps/hub`.

### Build Failures

**Error:**
```
Error: Cannot find module '@neothink/ui'
```

**Solution:**
Ensure your package.json references workspace packages correctly:
```json
"dependencies": {
  "@neothink/ui": "workspace:*"
}
```

### Incorrect Build Output

**Error:**
```
Error: No Output Directory named ".next" found after the Build completed.
```

**Solution:**
Double check that your build command is properly navigating back to the root:
```bash
cd ../.. && pnpm turbo run build --filter=hub...
```

## Completing the Migration

After successfully updating all Vercel projects and verifying that deployments are working:

1. Update any CI/CD workflows to reflect the new directory structure
2. Update documentation references to the old directory structure
3. Remove any references to the old structure in READMEs or other documentation 