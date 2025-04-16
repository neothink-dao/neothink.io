# Neothink Monorepo Structure Guide

This document provides an overview of the monorepo structure for the Neothink platform ecosystem.

## Overview

The Neothink platform ecosystem is organized as a monorepo containing multiple platform applications and shared libraries. This architecture enables code sharing, consistent development practices, and streamlined deployment across all platforms.

## Directory Structure

```
/
├── go.neothink.io/       # Hub platform
├── joinascenders/        # Ascenders platform
├── joinneothinkers/      # Neothinkers platform
├── joinimmortals/        # Immortals platform
├── lib/                  # Shared libraries
│   ├── supabase/         # Supabase client and utilities
│   ├── middleware/       # Shared middleware implementation
│   ├── ui/               # Shared UI components
│   ├── utils/            # Shared utility functions
│   ├── auth/             # Authentication utilities
│   └── api/              # API utilities
├── supabase/             # Supabase configuration
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── types/                # Shared TypeScript type definitions
├── docs/                 # Documentation
│   ├── development/      # Development guides
│   ├── platforms/        # Platform-specific documentation
│   └── ...               # Other documentation categories
├── scripts/              # Utility scripts
│   ├── deploy-platforms.js       # Deployment script
│   └── apply-migrations.js       # Database migration script
└── package.json          # Root package.json for workspaces
```

## Platform Applications

Each platform application follows a similar structure based on Next.js App Router conventions:

```
platform/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes
│   ├── (authenticated)/  # Routes requiring authentication
│   ├── (unauthenticated)/ # Public routes
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Platform-specific components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Other components
├── hooks/                # Custom hooks
├── lib/                  # Platform-specific libraries
│   ├── supabase/         # Platform-specific Supabase client
│   └── utils/            # Platform-specific utilities
├── public/               # Static assets
├── middleware.ts         # Next.js middleware
├── next.config.js        # Next.js configuration
├── package.json          # Platform-specific dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Shared Libraries

The `lib` directory contains shared code that can be used across all platforms:

### Supabase

The `lib/supabase` directory contains utilities for interacting with Supabase:

```
lib/supabase/
├── client.ts             # Browser client initialization
├── server.ts             # Server-side client initialization
└── middleware.ts         # Middleware client
```

### UI Components

The `lib/ui` directory contains shared UI components based on shadcn/ui:

```
lib/ui/
├── button/               # Button component
├── dialog/               # Dialog component
├── toast/                # Toast notifications
│   ├── toast.tsx         # Toast component
│   ├── toaster.tsx       # Toaster component
│   └── use-toast.ts      # Toast hook
└── ...                   # Other UI components
```

### Middleware

The `lib/middleware` directory contains shared middleware implementations:

```
lib/middleware/
├── unified-middleware.ts # Unified middleware for all platforms
└── types.ts              # Middleware types
```

## Database

The `supabase` directory contains database configurations and migrations:

```
supabase/
├── migrations/           # SQL migrations
│   ├── 20240518_unified_auth_system.sql        # Authentication system
│   ├── 20240606_security_enhancements.sql      # Security enhancements
│   └── ...               # Other migrations
└── functions/            # Supabase Edge Functions
    └── ...               # Function implementations
```

## Scripts

The `scripts` directory contains utility scripts for development, deployment, and maintenance:

```
scripts/
├── deploy-platforms.js               # Platform deployment script
├── apply-migrations.js               # Database migration script
├── apply-security-enhancements.js    # Security enhancement script
└── ...                               # Other utility scripts
```

## Types

The `types` directory contains shared TypeScript type definitions:

```
types/
├── supabase.ts           # Generated Supabase types
├── auth.ts               # Authentication types
└── ...                   # Other shared types
```

## Documentation

The `docs` directory contains comprehensive documentation for the platform ecosystem:

```
docs/
├── INDEX.md              # Documentation index
├── development/          # Development guides
├── platforms/            # Platform-specific documentation
└── ...                   # Other documentation categories
```

## Working with the Monorepo

### Installing Dependencies

Install dependencies for all platforms:

```bash
npm install
```

Install dependencies for a specific platform:

```bash
cd go.neothink.io
npm install
```

### Running Development Servers

Run development servers for all platforms:

```bash
npm run dev
```

Run a specific platform:

```bash
cd go.neothink.io
npm run dev
```

### Building for Production

Build all platforms:

```bash
npm run build
```

Build a specific platform:

```bash
cd go.neothink.io
npm run build
```

### Adding Shared Components

When adding shadcn/ui components, use the provided script:

```bash
npm run ui:add button
```

### Running Database Migrations

Apply all migrations:

```bash
npm run migrate:all
```

Apply a specific migration:

```bash
npm run migrate:security
```

## Best Practices

### Code Organization

- Keep platform-specific code in the platform directories
- Place shared code in the `lib` directory
- Use clear, consistent naming conventions
- Follow the established directory structure

### Dependency Management

- Use workspaces to manage dependencies
- Share common dependencies in the root `package.json`
- Keep platform-specific dependencies in platform `package.json` files
- Regularly update dependencies for security and features

### Code Consistency

- Follow TypeScript best practices
- Use consistent coding standards
- Share configuration files when possible
- Document public APIs and shared utilities

## Troubleshooting

### Common Issues

- **Workspaces not recognized**: Ensure you have the correct npm/yarn version
- **Module not found**: Check import paths and workspace configuration
- **Type errors**: Run `npm run gen:types` to regenerate Supabase types
- **Middleware errors**: Check for inconsistencies in middleware implementations

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Turborepo Documentation](https://turborepo.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) 