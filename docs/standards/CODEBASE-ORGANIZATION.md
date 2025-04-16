# Codebase Organization Guide

## 🎯 Overview

This guide defines the organization and structure of our monorepo containing 4 Vercel projects (Hub, Ascenders, Neothinkers, Immortals) with a shared Supabase backend.

## 📁 Monorepo Structure

```
neothink-platform/
├── apps/                    # Vercel projects
│   ├── hub/                # Hub application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── ascenders/          # Ascenders application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── neothinkers/        # Neothinkers application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── immortals/          # Immortals application
│       ├── src/
│       ├── public/
│       └── package.json
├── packages/               # Shared packages
│   ├── core/              # Core functionality
│   │   ├── src/
│   │   │   ├── lib/      # Shared utilities
│   │   │   ├── hooks/    # Shared React hooks
│   │   │   ├── components/ # Shared components
│   │   │   └── types/    # Shared TypeScript types
│   │   └── package.json
│   ├── ui/                # UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── styles/
│   │   │   └── themes/
│   │   └── package.json
│   ├── database/          # Database utilities
│   │   ├── src/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── types/
│   │   └── package.json
│   └── config/            # Configuration
│       ├── src/
│       │   ├── env/
│       │   ├── constants/
│       │   └── types/
│       └── package.json
├── supabase/              # Supabase configuration
│   ├── migrations/
│   ├── seeds/
│   └── functions/
├── scripts/               # Build and utility scripts
├── docs/                  # Documentation
├── .github/              # GitHub configuration
├── package.json          # Root package.json
├── turbo.json           # Turborepo configuration
├── pnpm-workspace.yaml  # Workspace configuration
└── README.md            # Project overview
```

## 📝 Code Organization Principles

### Application Structure
- Each app follows the same basic structure
- Shared code is extracted to packages
- Clear separation of concerns
- Consistent file naming conventions

### Package Organization
- `core`: Shared business logic and utilities
- `ui`: Reusable UI components
- `database`: Database utilities and types
- `config`: Environment and configuration

### File Naming Conventions
- Use PascalCase for components
- Use camelCase for utilities and hooks
- Use kebab-case for file names
- Use .tsx for React components
- Use .ts for TypeScript files

## 🔍 Shared Resources

### Supabase Integration
```typescript
// packages/core/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Environment Variables
```typescript
// packages/config/src/env/schema.ts
export const envSchema = {
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  // ... other env variables
}
```

## 📚 Best Practices

### Code Sharing
- Extract common logic to packages
- Use TypeScript for type safety
- Implement proper error handling
- Follow DRY principles

### Performance
- Implement code splitting
- Use dynamic imports
- Optimize images and assets
- Implement caching strategies

### Security
- Validate environment variables
- Implement proper authentication
- Use secure headers
- Follow security best practices

## 🔧 Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Start specific app
pnpm dev --filter=hub

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Deployment
```bash
# Deploy specific app
pnpm deploy --filter=hub

# Deploy all apps
pnpm deploy
```

## 📈 Quality Assurance

### Testing
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows
- Performance testing

### Code Quality
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety
- Husky for git hooks

## 📊 Monitoring

### Performance
- Core Web Vitals
- API response times
- Error rates
- Resource usage

### Analytics
- User engagement
- Feature usage
- Error tracking
- Performance metrics

## 📚 Resources

- [Turborepo Documentation](https://turbo.build/repo)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs) 