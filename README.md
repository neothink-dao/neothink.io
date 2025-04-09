# Neothink+ Ecosystem

This monorepo contains the following platforms:

- [Neothink+ Hub](go.neothink.io) - The central hub for all Neothink+ services
- [Ascenders](joinascenders) - Platform for Ascender members
- [Neothinkers](neothinkers) - Platform for Neothink members
- [Immortals](immortals) - Platform for Immortal members

## Documentation

- [Monorepo Configuration](MONOREPO.md) - Complete guide for monorepo setup and deployment
- [Supabase Configuration](SUPABASE.md) - Database and authentication setup
- [Development Guidelines](DEVELOPMENT.md) - Coding standards and practices

## Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Run development server for a specific platform:
```bash
# For Hub
pnpm --filter @neothink/hub dev

# For Ascenders
pnpm --filter @neothink/ascenders dev

# For Neothinkers
pnpm --filter @neothink/neothinkers dev

# For Immortals
pnpm --filter @neothink/immortals dev
```

## Deployment

All deployments are handled automatically by Vercel when pushing to the main branch. Each platform has its own Vercel project and will only deploy when its files are changed.

See [MONOREPO.md](MONOREPO.md) for detailed deployment documentation. 