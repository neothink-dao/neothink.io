# Getting Started with Neothink Platforms

Welcome to the Neothink development documentation. This guide will help you get started with developing for the Neothink platforms.

## Introduction

Neothink is a collection of interconnected platforms that share a common infrastructure and codebase. The platforms are:

- **[Hub](https://go.neothink.io)** - Central platform for Neothink content
- **[Ascenders](https://joinascenders.org)** - Wealth building platform
- **[Neothinkers](https://joinneothinkers.org)** - Neothink community platform
- **[Immortals](https://joinimmortals.org)** - Health and longevity platform

## Quick Links

- [Development Guide](./development.md) - How to set up your development environment
- [Architecture Overview](../architecture/monorepo.md) - Overview of the monorepo architecture
- [UI Components](../architecture/ui.md) - Documentation for the UI components
- [Authentication](../architecture/auth.md) - Documentation for authentication
- [Database](../architecture/database.md) - Documentation for database access

## Technology Stack

The Neothink platforms are built with:

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Monorepo**: pnpm workspaces, Turborepo
- **Deployment**: Vercel

## First-Time Setup

Follow these steps to set up your development environment:

1. **Install prerequisites**:
   - Node.js (v18 or later)
   - pnpm (v8 or later)
   - Git

2. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/neothink.git
   cd neothink
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Update the Supabase credentials

5. **Build shared packages**:
   ```bash
   pnpm build --filter=@neothink/database --filter=@neothink/auth --filter=@neothink/ui
   ```

6. **Start development server**:
   ```bash
   pnpm dev
   # or for a specific platform
   pnpm dev:hub
   ```

For more detailed instructions, see the [Development Guide](./development.md).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs) 