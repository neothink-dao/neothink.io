# Quick Start Guide

Welcome to the Neothink+ ecosystem! This guide will help you get started with development across our platforms.

## Prerequisites

- Node.js 18.x or later
- pnpm 8.15.4 or later
- Git
- Supabase CLI
- Docker (for local development)

## Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update the following variables in `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_VERSION`

4. **Start Local Development**
   ```bash
   # Start Supabase locally
   pnpm supabase start

   # Start all applications
   pnpm dev

   # Or start a specific platform
   pnpm dev --filter=@neothink/hub
   ```

## Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Run Tests**
   ```bash
   pnpm test
   pnpm test:e2e
   ```

3. **Check Types and Lint**
   ```bash
   pnpm type-check
   pnpm lint
   ```

4. **Build for Production**
   ```bash
   pnpm build
   ```

## Platform-Specific Development

### Neothink+ Hub
- Port: 3000
- URL: http://localhost:3000
- Main entry: `apps/hub/app/page.tsx`

### Ascenders
- Port: 3001
- URL: http://localhost:3001
- Main entry: `apps/ascenders/app/page.tsx`

### Neothinkers
- Port: 3002
- URL: http://localhost:3002
- Main entry: `apps/neothinkers/app/page.tsx`

### Immortals
- Port: 3003
- URL: http://localhost:3003
- Main entry: `apps/immortals/app/page.tsx`

## Common Tasks

### Database Migrations
```bash
# Create a new migration
pnpm supabase migration new my_migration_name

# Apply migrations
pnpm supabase db push
```

### Adding Shared Dependencies
```bash
# Add to all applications
pnpm add -w package-name

# Add to specific application
pnpm add package-name --filter=@neothink/hub
```

### Running Type Checks
```bash
# Check all packages
pnpm type-check

# Check specific package
pnpm type-check --filter=@neothink/hub
```

## Next Steps

- Review the [Architecture Overview](./architecture/overview.md)
- Explore [Development Guidelines](./guides/development.md)
- Learn about [Platform Integration](./guides/platform-integration.md)
- Understand [Testing Best Practices](./guides/testing.md)

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Each platform runs on a different port
   - Check for processes using required ports
   - Use `lsof -i :PORT` to find conflicts

2. **Database Connection**
   - Ensure Supabase is running locally
   - Check connection strings in `.env`
   - Verify database migrations are up to date

3. **Build Errors**
   - Clear build cache: `pnpm clean`
   - Rebuild: `pnpm build`
   - Check for type errors: `pnpm type-check`

## Support

- Join our [Discord](https://discord.gg/neothink)
- Check [GitHub Issues](https://github.com/neothink-dao/neothink.io/issues)
- Review [FAQ](./faq.md)

# Required Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_APP_VERSION 