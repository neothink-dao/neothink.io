# Deployment Guide

## Overview
This guide outlines the deployment process for the Neothink Sites monorepo. Each site is deployed independently to its own GitHub repository.

## Repository Structure
- `go.neothink.io` → [neothink.io](https://github.com/neothink-dao/neothink.io)
- `joinascenders` → [ascenders](https://github.com/neothink-dao/ascenders)
- `joinneothinkers` → [neothinkers](https://github.com/neothink-dao/neothinkers)
- `joinimmortals` → [immortals](https://github.com/neothink-dao/immortals)

## Prerequisites
1. Access to all repository deploy tokens
2. Git installed and configured
3. Node.js and pnpm installed

## Deployment Process

### 1. Preparation
```bash
# Ensure you're in the monorepo root
cd /path/to/neothink-sites

# Set the deploy token
export DEPLOY_TOKEN=your_deploy_token_here
```

### 2. Automated Deployment
Use the deployment script to deploy all sites:
```bash
# Make the script executable
chmod +x scripts/deploy-sites.sh

# Run the deployment
./scripts/deploy-sites.sh
```

### 3. Manual Deployment (Single Site)
To deploy a single site:
```bash
cd site_directory
git remote set-url origin "https://${DEPLOY_TOKEN}@github.com/neothink-dao/repo_name.git"
git push origin main
```

### Deployment Process
1. Each platform uses GitHub Actions for CI/CD
2. Workflows are defined in `.github/workflows/` for each platform
3. Environment variables are managed in Vercel
4. Database migrations affect all platforms and must be deployed carefully
5. Edge functions are deployed through Supabase Dashboard

### Authentication & Backend Deployment
1. Each site maintains its own authentication implementation
2. All sites share the same Supabase backend:
   - Database changes affect all platforms
   - Edge function updates impact all sites
   - RLS policies must be tested across platforms
3. Environment variables must be updated in Vercel for each site
4. Supabase configuration changes require testing on all platforms

### Database Migrations
1. Migrations are run in order using Supabase CLI
2. Each migration must be tested across all platforms
3. Rollback plans must account for all affected sites
4. Migrations should be backward compatible

## Deployment Rules

1. **Branch Management**
   - Always deploy from the `main` branch
   - Use feature branches for development
   - Merge to `main` only after testing

2. **Version Control**
   - Commit messages must follow conventional commits format
   - Include meaningful commit messages
   - Tag releases when deploying to production

3. **Testing Requirements**
   - Run tests before deployment
   - Verify authentication flow
   - Check cross-platform functionality

4. **Security**
   - Never commit deploy tokens
   - Use environment variables for sensitive data
   - Rotate deploy tokens regularly

5. **Rollback Procedure**
   ```bash
   # Revert to previous version
   git revert HEAD
   git push origin main
   ```

## Troubleshooting

### Common Issues
1. **Permission Denied**
   - Verify deploy token is valid
   - Check repository access permissions
   - Ensure token has correct scopes

2. **Merge Conflicts**
   - Pull latest changes before deploying
   - Resolve conflicts locally
   - Test after resolving conflicts

3. **Deployment Failures**
   - Check deployment logs
   - Verify build process
   - Ensure all dependencies are installed

## Best Practices

1. **Before Deployment**
   - Update documentation
   - Run all tests
   - Check for breaking changes
   - Review security implications

2. **During Deployment**
   - Monitor deployment progress
   - Watch for error messages
   - Verify each step

3. **After Deployment**
   - Verify functionality
   - Update deployment logs
   - Notify relevant team members

## Support
For deployment issues:
1. Check the troubleshooting guide
2. Review deployment logs
3. Contact the development team 