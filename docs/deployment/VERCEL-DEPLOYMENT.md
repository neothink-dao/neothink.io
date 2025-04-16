# Vercel Deployment Guide

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../../LICENSE) file for details.

> **See Also:**
> - [Onboarding & Getting Started](../getting-started/README.md)
> - [Launch Checklist](./launch-checklist.md)
> - [CI/CD & Advanced Deployment](./vercel-deployment-guide.md)
> - [Supabase Integration](../database/SUPABASE-INTEGRATION.md)
> - [Security Guide](../security/security.md)
> - [Environment Variable Template](../../.env.example)

This guide explains how to deploy and manage the four Neothink Platform applications on Vercel.

## 🚀 Overview

The Neothink Platform consists of four Vercel projects that share the same Supabase backend:

1. **Hub** ([go.neothink.io](https://go.neothink.io))
   - Main platform
   - Entry point for all users
   - Cross-platform navigation

2. **Ascenders** ([joinascenders.org](https://joinascenders.org))
   - Business platform
   - Financial tools
   - Learning resources

3. **Neothinkers** ([joinneothinkers.org](https://joinneothinkers.org))
   - Community platform
   - Knowledge sharing
   - Learning paths

4. **Immortals** ([joinimmortals.org](https://joinimmortals.org))
   - Premium platform
   - Health protocols
   - Advanced features

## 🔧 Setup

### Prerequisites

1. Vercel account with team access
2. Supabase project credentials
3. Domain names configured
4. Environment variables set

### Environment Variables

Each project needs these environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_NAME=Neothink+
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=your-app-url

# Authentication
NEXT_PUBLIC_AUTH_REDIRECT_URL=your-auth-redirect-url
NEXT_PUBLIC_AUTH_LOGOUT_URL=your-auth-logout-url
NEXT_PUBLIC_AUTH_COOKIE_DOMAIN=.neothink.io
AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=your-nextauth-url
NEXTAUTH_SECRET=your-nextauth-secret

# Monitoring
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=your-posthog-host
```

### Domain Configuration

1. Add domains in Vercel:
   - go.neothink.io
   - joinascenders.org
   - joinneothinkers.org
   - joinimmortals.org

2. Configure DNS:
   - Point domains to Vercel
   - Set up SSL certificates
   - Configure redirects

## 🛠️ Deployment

### Manual Deployment

1. Push to main branch:
   ```bash
   git push origin main
   ```

2. Vercel automatically:
   - Builds the project
   - Runs tests
   - Deploys to production

### Preview Deployments

1. Create a pull request
2. Vercel automatically:
   - Creates a preview deployment
   - Runs tests
   - Provides a preview URL

### Production Deployment

1. Merge to main branch
2. Vercel automatically:
   - Builds the project
   - Runs tests
   - Deploys to production
   - Runs health checks

## 🔍 Monitoring

### Vercel Analytics

- Performance metrics
- Build logs
- Deployment history
- Error tracking

### Custom Monitoring

- Supabase Logs for database monitoring

## 🔒 Security

### Environment Variables

- Store in Vercel
- Rotate regularly
- Use different values per environment
- Keep secrets secure

### SSL/TLS

- Automatic SSL certificates
- HSTS enabled
- Secure headers
- CORS configuration

## 📈 Scaling

### Performance

- Edge caching
- Image optimization
- Code splitting
- Lazy loading

### Infrastructure

- Automatic scaling
- Global CDN
- Edge functions
- Database connections

## 🔄 CI/CD

### GitHub Integration

1. Connect GitHub repository
2. Configure branch protection
3. Set up status checks
4. Enable auto-deploy

### Deployment Pipeline

1. Code push
2. Build
3. Test
4. Deploy
5. Verify
6. Monitor

## 🚨 Troubleshooting

### Common Issues

1. Build failures
   - Check build logs
   - Verify dependencies
   - Check environment variables

2. Deployment issues
   - Check deployment logs
   - Verify domain configuration
   - Check SSL certificates

3. Performance issues
   - Check analytics
   - Monitor resource usage
   - Optimize code

### Support

- Vercel support
- GitHub issues
- Team communication
- Documentation

## 📚 Resources

- [Onboarding & Getting Started](../getting-started/README.md)
- [Launch Checklist](./launch-checklist.md)
- [CI/CD & Advanced Deployment](./vercel-deployment-guide.md)
- [Supabase Integration](../database/SUPABASE-INTEGRATION.md)
- [Security Guide](../security/security.md)
- [Environment Variable Template](../../.env.example)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs) 