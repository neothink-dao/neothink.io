# Neothink DAO Monorepo

> **Current Governance:**
> Joshua Seymour is the benevolent dictator and steward of the Neothink DAO. The long-term goal is for the DAO to fully govern itself and all its assets through decentralized, transparent processes.

This monorepo/turborepo contains 4 Vercel apps/sites, all sharing a single production-grade Supabase database. **All code, schema, and documentation are owned, governed, and managed by the Neothink DAO.**

## Key Principles
- **DAO Governance:** All changes are subject to DAO approval and transparent governance.
- **Database as Code:** All schema changes are managed via migrations and version-controlled.
- **Code/DB Sync:** TypeScript types, schema, and documentation are always kept in sync.
- **User/Admin Delight:** The stack is designed for maximum engagement, clarity, and security for both users and admins.

## Database Schema & ER Diagram
- See [`supabase/schema/schema.sql`](./supabase/schema/schema.sql) for the full authoritative DDL.
- See [`supabase/schema/er_diagram.dbml`](./supabase/schema/er_diagram.dbml) for a visual ER diagram (import to [dbdiagram.io](https://dbdiagram.io)).
- All tables, relationships, and RLS policies are documented in migrations and the schema folder.

## DAO Governance & Policies
- See [`DAO_GOVERNANCE.md`](./DAO_GOVERNANCE.md) for details on how the DAO manages this project, voting, and contributor onboarding.

## Onboarding & Contribution
- See [`supabase/schema/README.md`](./supabase/schema/README.md) for schema/ERD usage.
- All contributors must follow DAO guidelines and submit PRs for review.

## 🚀 Overview

The Neothink Platform consists of four main applications that share a common infrastructure:

- **Hub** (`apps/hub`): The main platform and entry point
- **Ascenders** (`apps/ascenders`): Advanced learning and growth
- **Neothinkers** (`apps/neothinkers`): Community and collaboration
- **Immortals** (`apps/immortals`): Premium features and experiences

All applications share:
- A single Supabase project for data and authentication
- Common UI components and utilities
- Shared authentication and security
- Unified monitoring and analytics

## 🏗️ Architecture

```
neothink-platform/
├── apps/                    # Application packages
│   ├── hub/                # Main platform
│   ├── ascenders/          # Ascenders app
│   ├── neothinkers/        # Neothinkers app
│   └── immortals/          # Immortals app
├── packages/               # Shared packages
│   ├── core/              # Core functionality
│   ├── ui/                # Shared UI components
│   ├── auth/              # Authentication
│   ├── database/          # Database utilities
│   ├── ai-integration/    # AI features
│   ├── utils/             # Shared utilities
│   ├── types/             # Shared TypeScript types
│   ├── monitoring/        # Monitoring utilities
│   ├── config/            # Shared configuration
│   └── testing/           # Testing utilities
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## 🛠️ Tech Stack

- **Framework:** Next.js (latest)
- **Language:** TypeScript (latest)
- **Database:** Supabase (PostgreSQL, latest)
- **Authentication:** Supabase Auth (latest)
- **UI:** React (latest), Tailwind CSS (latest)
- **State Management:** React Context, Zustand (latest)
- **Build Tool:** Turborepo (latest)
- **Package Manager:** pnpm (latest)
- **Deployment:** Vercel (latest)
- **Monitoring:** PostHog (latest), custom logging/monitoring
- **Testing:** Vitest (latest), React Testing Library (latest)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22 (LTS, recommended)
- pnpm >= 9
- Supabase CLI (latest, for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   # Start all apps
   pnpm dev

   # Start a specific app
   pnpm dev:hub
   pnpm dev:ascenders
   pnpm dev:neothinkers
   pnpm dev:immortals
   ```

### Onboarding Checklist
- [ ] Review the [database schema and ERD](docs/database/schema_documentation.md)
- [ ] Read [RLS and authorization docs](docs/security/authorization.md)
- [ ] Set up your `.env` from `.env.example`
- [ ] Run migrations locally before development
- [ ] See [docs/getting-started/](docs/getting-started/) for full onboarding

## 📦 Package Management

We use pnpm workspaces to manage dependencies across the monorepo. Key commands:

```bash
# Install dependencies
pnpm install

# Add dependency to all packages
pnpm add -w <package>

# Add dependency to a specific package
pnpm add <package> --filter <package-name>

# Run command in all packages
pnpm -r <command>

# Run command in a specific package
pnpm --filter <package-name> <command>
```

## 🔧 Development

### Running Apps

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start

# Specific app
pnpm dev:hub
pnpm dev:ascenders
pnpm dev:neothinkers
pnpm dev:immortals
```

### Database

```bash
# Generate types
pnpm db:generate

# Push migrations
pnpm db:push

# Open Supabase Studio
pnpm db:studio
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in a specific package
pnpm --filter <package-name> test
```

## 📚 Documentation

- [Architecture](./docs/architecture/README.md)
- [Getting Started](./docs/getting-started/README.md)
- [Authentication](./docs/development/AUTHENTICATION-STATUS.md)
- [Database](./docs/database/README.md)
- [Deployment](./docs/deployment/VERCEL-DEPLOYMENT.md)
- [Contributing](./CONTRIBUTING.md)

## 🤝 Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is proprietary software owned by Neothink DAO and the Mark Hamilton Family. All rights reserved. See the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Turborepo](https://turbo.build/)
- [Vercel](https://vercel.com/)

# Neothink Monorepo

This is a monorepo containing multiple Next.js applications for the Neothink ecosystem:

- **Hub** - The central hub application
- **Ascenders** - Ascenders platform
- **Neothinkers** - Neothinkers platform
- **Immortals** - Immortals platform

## Architecture

This monorepo uses:
- **Turborepo** for build orchestration
- **pnpm** for package management
- **GitHub Actions** for CI/CD
- **Vercel** for deployment

## Development

To run the development server:

```bash
# Install dependencies
pnpm install

# Run the development server for all apps
pnpm dev

# Run the development server for a specific app
pnpm dev --filter=@neothink/hub
```

## Deployment

### Automatic Deployments

The monorepo is configured to automatically deploy to Vercel through GitHub Actions when:
- Changes are pushed to the `main` branch
- The workflow is manually triggered

Each app is deployed independently based on which files have changed:
- Changes to `apps/{app}/**` will trigger a deployment for that app
- Changes to `packages/**` will trigger deployments for all apps

### Manual Deployments

To manually deploy an app:

```bash
# Install the Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy a specific app
cd apps/hub
vercel deploy
```

## GitHub Setup

To set up GitHub Actions for deployment, add the following secrets to your repository:

- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_HUB_PROJECT_ID` - Project ID for Hub
- `VERCEL_ASCENDERS_PROJECT_ID` - Project ID for Ascenders
- `VERCEL_NEOTHINKERS_PROJECT_ID` - Project ID for Neothinkers
- `VERCEL_IMMORTALS_PROJECT_ID` - Project ID for Immortals

## Best Practices

- Always include packages with the `workspace:*` protocol
- Use Turborepo filtering for efficient builds (`--filter=...`)
- Write proper `turbo.json` pipeline dependencies
- Set up proper environment variables in Vercel UI 

## 🗂️ Key Developer Documentation

- [Database Schema Documentation](docs/database/schema_documentation.md)
- [Entity Relationship Diagram (ERD)](docs/database/database_diagram.md)
- [RLS Policy Documentation](docs/security/authorization.md)
- [Migration Guide](docs/database/MIGRATIONS.md)

**Onboarding Checklist:**
- [ ] Review the schema and ERD
- [ ] Read RLS and authorization docs
- [ ] Set up your `.env` from `.env.example`
- [ ] Run migrations locally before development
- [ ] See [docs/getting-started/](docs/getting-started/) for full onboarding 

## Onboarding & Setup

Welcome to the Neothink monorepo! This repo contains all apps, packages, and shared types for the Neothink platform.

### Prerequisites
- Node.js 22+
- pnpm 9+
- GitHub account with access to this repo

### 1. Clone the Repo
```sh
git clone https://github.com/neothink/your-monorepo.git
cd your-monorepo
```

### 2. Authenticate for GitHub Packages
To install private packages (like `@neothink/types`), you need a GitHub token:

1. [Create a Personal Access Token](https://github.com/settings/tokens) with `read:packages` scope.
2. Add this to your `~/.npmrc`:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

### 3. Install Dependencies
```sh
pnpm install
```

### 4. Environment Variables
- Add your `.env` files for each app (see `.env.example` in each app directory).
- All secrets should be managed via Vercel or Supabase dashboards in production.

### 5. Common Scripts
- `pnpm dev` — Start all apps in dev mode
- `pnpm build` — Build all packages and apps
- `pnpm lint` — Lint all code
- `pnpm type-check` — Type-check all code
- `pnpm test` — Run all tests

### 6. Running Locally
- Each app can be started individually from its directory with `pnpm dev`.
- The monorepo supports Turborepo for fast, cached builds and dev.

### 7. Deployments
- All apps are deployed via Vercel (see Vercel dashboard for project links).
- Database and auth are managed via Supabase.

### 8. Updating Shared Types
- Update types in `packages/types` and publish a new version to GitHub Packages.
- Bump the version in dependent packages and run `pnpm install`.

---

For more details, see the `/docs` directory or ask in the team Slack. 