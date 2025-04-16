# Neothink Platform Monorepo Guide

## 🎯 Overview

The Neothink Platform is a modern monorepo containing four distinct Vercel-hosted applications that share a common Supabase backend:

1. **Hub** (go.neothink.io) - Main platform
2. **Ascenders** (joinascenders.org) - Ascenders community
3. **Neothinkers** (joinneothinkers.org) - Neothinkers community
4. **Immortals** (joinimmortals.org) - Immortals community

All four applications:
- Share the same Supabase backend
- Use Deno 2.1 Edge Functions
- Implement Realtime features
- Benefit from geo-routing to nearest read replicas
- Follow declarative schema management
- Utilize the MCP Server for enhanced performance

## 🏗️ Project Structure

```
neothink-platform/
├── apps/                    # Next.js applications
│   ├── hub/                 # Hub application
│   ├── ascenders/           # Ascenders application
│   ├── neothinkers/         # Neothinkers application
│   └── immortals/           # Immortals application
├── packages/                # Shared packages
│   ├── core/               # Core functionality
│   ├── ui/                 # Shared UI components
│   ├── auth/               # Authentication
│   ├── database/           # Database access
│   ├── utils/              # Shared utilities
│   ├── config/             # Configuration
│   ├── ai-integration/     # AI features
│   └── testing/            # Testing utilities
├── docs/                   # Documentation
└── scripts/                # Build and utility scripts
```

## 🔄 Development Workflow

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/neothink-dao/neothink.io.git
cd neothink.io

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
```

### Development Workflow

#### Starting Development Servers
```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm dev:hub
pnpm dev:ascenders
pnpm dev:neothinkers
pnpm dev:immortals
```

#### Building
```bash
# Build all apps
pnpm build

# Build specific app
cd apps/hub && pnpm build
```

#### Testing
```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/hub && pnpm test
```

## 🛠️ Modern Stack

### Frontend
- Next.js 14 with App Router
- Supabase UI Library
- Tailwind CSS
- TypeScript
- Turborepo for monorepo management
- Vercel for hosting and deployment

### Backend
- Supabase with Deno 2.1 Edge Functions
- Realtime Broadcast from Database
- Data API with geo-routing to nearest read replica
- Declarative Schemas
- MCP Server for enhanced performance
- Row Level Security (RLS) policies
- Secure token storage and management

### Infrastructure
- Vercel for hosting (4 separate projects)
- Supabase for backend services (shared)
- GitHub Actions for CI/CD
- Sentry for error tracking
- PostHog for analytics
- Automated backups and monitoring

## 📦 Package Management

### Adding Dependencies
```bash
# Add to root
pnpm add -w <package>

# Add to specific app/package
cd apps/hub && pnpm add <package>
```

### Workspace Commands
```bash
# Run command in all packages
pnpm -r <command>

# Run command in specific package
pnpm --filter <package> <command>
```

## 🔒 Security

### Environment Variables
- Use `.env.example` as template
- Never commit sensitive values
- Use `NEXT_PUBLIC_` prefix only for client-side variables

### Authentication
- Use shared Supabase client from `@neothink/core`
- Implement rate limiting for sensitive operations
- Follow security best practices

### Database Access
- Use type-safe queries from `@neothink/database`
- Implement proper error handling
- Use service role client only for server-side operations

## 📈 Monitoring

- Error tracking with Sentry
- Performance monitoring
- User analytics with PostHog
- Custom metrics
- Real-time alerts
- Database performance monitoring
- Edge Function monitoring
- Realtime connection tracking

## 🚀 Deployment

Each app is deployed to Vercel:

1. **Hub**: [go.neothink.io](https://go.neothink.io)
2. **Ascenders**: [joinascenders.org](https://joinascenders.org)
3. **Neothinkers**: [joinneothinkers.org](https://joinneothinkers.org)
4. **Immortals**: [joinimmortals.org](https://joinimmortals.org)

Deployment process:
1. Push to main branch
2. Vercel automatically builds and deploys
3. Run health checks
4. Monitor for issues

## 📚 Documentation

- [Architecture](./README.md)
- [Authentication](./AUTHENTICATION-STATUS.md)
- [Database](./database/README.md)
- [Deployment](./deployment/README.md)
- [Contributing](../CONTRIBUTING.md)

## 📚 Support

For issues and questions:
- Check the documentation
- Open a GitHub issue
- Contact the development team

# Monitoring and Observability
- Vercel Analytics for performance monitoring
- Supabase Logs for database monitoring
- Custom health checks 