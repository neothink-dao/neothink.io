# Neothink DAO Monorepo

> **New to the project? Start here:** See our [ONBOARDING.md](./ONBOARDING.md) for a fast, frustration-free setup and contribution guide.

> **Current Governance:**
> Joshua Seymour is the benevolent dictator and steward of the Neothink DAO. The long-term goal is for the DAO to fully govern itself and all its assets through decentralized, transparent processes.

This monorepo/turborepo contains 4 Vercel apps/sites, all sharing a single production-grade Supabase database. **All code, schema, and documentation are owned, governed, and managed by the Neothink DAO.**

## Key Principles
- **DAO Governance:** All changes are subject to DAO approval and transparent governance.
- **Database as Code:** All schema changes are managed via migrations and version-controlled.
- **Code/DB Sync:** TypeScript types, schema, and documentation are always kept in sync.
- **User/Admin Delight:** The stack is designed for maximum engagement, clarity, and security for both users and admins.

## 🚀 Quickstart / Core Path (Summary)
1. **Clone the repo**
2. **Install dependencies**
3. **Set up `.env` from `.env.example`**
4. **Generate and sync Supabase types** (`pnpm generate:supabase-types`)
5. **(Optional) Run local dev server**

For full details, see [ONBOARDING.md](./ONBOARDING.md).

## Security & RLS Checklist
- All new tables must have RLS enabled and documented.
- All schema changes must use migrations; never modify applied migrations.
- Always sync and regenerate TypeScript types after schema changes.
- See [SECURITY.md](./SECURITY.md) for the full checklist.

## Database Schema & ER Diagram
- See [`supabase/schema/schema.sql`](./supabase/schema/schema.sql) for the full authoritative DDL.
- See [`supabase/schema/er_diagram.dbml`](./supabase/schema/er_diagram.dbml) for a visual ER diagram (import to [dbdiagram.io](https://dbdiagram.io)).
- All tables, relationships, and RLS policies are documented in migrations and the schema folder.

## DAO Governance & Policies
- See [`DAO_GOVERNANCE.md`](./DAO_GOVERNANCE.md) for details on how the DAO manages this project, voting, and contributor onboarding.

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

## 🗂️ Key Developer Documentation

- [Database Schema Documentation](docs/database/schema_documentation.md)
- [Entity Relationship Diagram (ERD)](docs/database/database_diagram.md)
- [RLS Policy Documentation](docs/security/authorization.md)
- [Migration Guide](docs/database/MIGRATIONS.md)
- [Onboarding Guide](./ONBOARDING.md)
- [Security Policy & Checklist](./SECURITY.md)

---

For more details, see the `/docs` directory or ask in the team Slack. 