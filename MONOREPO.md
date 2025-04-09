# Neothink+ Monorepo Configuration Guide

## Repository Structure

```
neothink-monorepo/
├── go.neothink.io/        # Neothink+ Hub
├── joinascenders/         # Ascenders Platform
├── neothinkers/          # Neothinkers Platform
├── immortals/            # Immortals Platform
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

*(Similar configurations for Neothinkers and Immortals)*

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

1. Push changes to GitHub main branch
2. Vercel automatically:
   - Detects which projects were affected by the changes
   - Triggers builds only for affected projects
   - Uses Turborepo's cache for optimization
   - Deploys updated projects to production

### Important Rules

1. **DO NOT** create manual GitHub Actions for deployment
2. **DO NOT** modify Vercel's Git Integration settings
3. **ALWAYS** use Turborepo for build commands
4. **ALWAYS** maintain project-specific `vercel.json` files
5. **NEVER** disable Vercel's automatic deployments

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