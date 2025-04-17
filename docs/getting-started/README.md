# Getting Started with Neothink Platform

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../LICENSE) file for details.

Welcome! This guide will help you get started with development in the Neothink Platform ecosystem.

## Prerequisites

- Node.js 22.x or later
- pnpm 9.x or later
- Git
- VS Code (recommended)
- Supabase CLI (latest, for local development)
- Docker (optional, for local Supabase)

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```
2. **Install Dependencies**
   ```bash
   pnpm install
   ```
3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see comments in `.env.example`).

4. **Start the Development Server**
   ```bash
   # Start all apps
   pnpm dev

   # Start a specific app
   pnpm dev:hub
   pnpm dev:ascenders
   pnpm dev:neothinkers
   pnpm dev:immortals
   ```

## Onboarding Checklist
- [ ] Review the [database schema and ERD](../database/schema_documentation.md)
- [ ] Read [RLS and authorization docs](../security/authorization.md)
- [ ] Set up your `.env` from `.env.example`
- [ ] Run migrations locally before development (`pnpm db:push`)
- [ ] See [core concepts](./core-concepts.md) and [architecture overview](../architecture/README.md)
- [ ] Review the [Launch Checklist](../deployment/launch-checklist.md) for production readiness
- [ ] If you're an admin, see [Admin & Continuous Improvement](../admin/CONTINUOUS_IMPROVEMENT.md) and [Security Guide](../security/security.md)

## Project Structure

```
.
├── apps/                 # Application platforms
│   ├── hub/             # Central Hub
│   ├── ascenders/       # Ascenders
│   ├── neothinkers/     # Neothinkers
│   └── immortals/       # Immortals
├── packages/            # Shared packages (core, ui, auth, database, etc.)
├── docs/                # Documentation
└── scripts/             # Development scripts
```

## Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make Changes**
   - Follow our [coding standards](../contributing/code-style.md) and [best practices](../architecture/standards.md).
   - See [FAQ & Troubleshooting](../troubleshooting/README.md) for common issues.
   - For help, check [Support](../support/README.md).
3. **Run Tests**
   ```bash
   pnpm test
   # Or for a specific package
   pnpm --filter <package-name> test
   ```
4. **Submit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```
   - Create a Pull Request following our [contribution guidelines](../CONTRIBUTING.md).

## Common Tasks

### Authentication
```typescript
// Sign in user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Check session
const { data: { session } } = await supabase.auth.getSession();
```

### Database Operations
```typescript
// Query data
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId);

// Insert data
const { data, error } = await supabase
  .from('content')
  .insert([{ title: 'New Content', user_id: userId }]);
```

### Platform Switching
```typescript
// Switch platform
await platformBridge.switchPlatform('ascenders');

// Get current platform
const platform = platformBridge.getCurrentPlatform();
```

## Troubleshooting

### Common Issues
1. **Installation Problems**
   ```bash
   rm -rf node_modules
   pnpm store prune
   pnpm install
   ```
2. **Database Connection**
   - Check Supabase credentials
   - Verify network access
   - Check RLS policies
3. **Build Errors**
   - Clear Next.js cache
   - Check TypeScript errors
   - Verify dependencies

## Next Steps

- Read the [Architecture Overview](../architecture/README.md)
- Review [Security Guidelines](../security/security.md)
- Explore [API Documentation](../development/API.md)
- See [core concepts](./core-concepts.md)

## Additional Resources

- [Development Guide](./development.md)
- [Testing Guide](../development/TESTING.md)
- [Database Schema](../database/schema_documentation.md)
- [Deployment Guide](../deployment/VERCEL-DEPLOYMENT.md) 