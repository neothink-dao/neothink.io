# Neothink Platform Documentation

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../LICENSE) file for details.

> **Audience Guide:**
> - 🧑‍💻 **New Users/Contributors:** Start with [Getting Started](./getting-started/README.md) and [Onboarding & Game Guides](#onboarding--game-guides).
> - 🛡️ **Admins/Maintainers:** Focus on [Admin & Continuous Improvement](#admin--continuous-improvement), [Security](#security), and [Deployment](#deployment).
> - 🤖 **AI/Advanced Contributors:** See [AI Agent Onboarding](../FOR_AI_AGENTS.md) and [Architecture](#architecture).

Welcome to the Neothink Platform documentation. This monorepo contains four interconnected applications sharing a common Supabase backend and a set of shared packages.

## 📚 Documentation Structure

### 🏗️ Architecture
- [Architecture Overview](./architecture/README.md) — System, security, and deployment architecture overview for all contributors.
- [Monorepo Guide](./architecture/MONOREPO-GUIDE.md) — Project structure, workspace layout, and dev practices.
- [Database Architecture](./architecture/DATABASE-ARCHITECTURE.md) — Database design, relationships, and rationale.
- [Authentication Flow](./architecture/AUTH.md) — How authentication works across all apps.
- [Shared Supabase](./architecture/SHARED-SUPABASE.md) — Shared backend configuration and multi-app best practices.

### 🤖 AI & Automation
- [AI Agent Onboarding](../FOR_AI_AGENTS.md) — Canonical sources, best practices, and context for AI/automation contributors.

### 🧩 Onboarding & Game Guides
  - [How the Game Works: Ascender](./onboarding/ascender.md) — Game mechanics, progression, and rewards for Ascenders.
  - [How the Game Works: Neothinker](./onboarding/neothinker.md) — Game mechanics, progression, and rewards for Neothinkers.
  - [How the Game Works: Immortal](./onboarding/immortal.md) — Game mechanics, progression, and rewards for Immortals.
  - [How the Game Works: Superachiever](./onboarding/superachiever.md) — Game mechanics, progression, and rewards for Superachievers.

### 🚀 Getting Started
- [Onboarding & Quick Start](../docs/getting-started/README.md) — How to join, set up, and start contributing.
- [Environment Setup](../docs/getting-started/environment.md) — Prerequisites, tools, and env vars.
- [Core Concepts](../docs/getting-started/core-concepts.md) — Key ideas and terminology.
- [Development Workflow](../docs/getting-started/development.md) — How to work efficiently in the monorepo.

### 🔧 Development
- [API Documentation](../docs/development/API.md) — Endpoints, usage, and integration tips.
- [Testing Guide](../docs/development/TESTING.md) — How to run and write tests.
- [Authentication Status](../docs/development/AUTHENTICATION-STATUS.md) — Auth state management and troubleshooting.
- [Declarative Schemas](../docs/development/DECLARATIVE_SCHEMAS.md) — Keeping DB schemas and code in sync.
- [Keeping Types & Schema in Sync](./development/types-and-schema.md) — Type safety and schema evolution.

### 📦 Database
- [Supabase Integration](../docs/database/SUPABASE-INTEGRATION.md) — Connecting apps to Supabase and best practices.
- [Schema Documentation](../docs/database/schema_documentation.md) — Full schema reference and ERD.
- [Migrations](../docs/database/MIGRATIONS.md) — How migrations work and how to create them.
- [Query Patterns](../docs/database/DATABASE_FUNCTIONS.md) — Common query and function patterns.
- [Entity Relationship Diagram (ERD)](../docs/database/database_diagram.md) — Visual schema overview.
- [Per-Table]
  - [gamification_events Table](./database/tables/gamification_events.md)
  - [token_conversions Table](./database/tables/token_conversions.md)
  - [user_badges Table](./database/tables/user_badges.md)
  - [teams Table](./database/tables/teams.md)
  - [team_memberships Table](./database/tables/team_memberships.md)
  - [token_sinks Table](./database/tables/token_sinks.md)
  - [xp_events Table](./database/tables/xp_events.md)
  - [fibonacci_token_rewards Table](./database/tables/fibonacci_token_rewards.md)
  - [census_snapshots Table](./database/tables/census_snapshots.md)

### 🛡️ Admin & Continuous Improvement
  - [Ritual Audits & Continuous Improvement](./admin/CONTINUOUS_IMPROVEMENT.md) — Admin rituals, audits, and continuous improvement cycles.

### 🔒 Security
- [Security Guide](../docs/security/security.md) — Security principles, reporting, and best practices.
- [Authentication Security](../docs/security/authentication.md) — Auth flow security and common pitfalls.
- [RLS Policy Documentation](../docs/security/authorization.md) — Row Level Security (RLS) policies and rationale.
- [RBAC Implementation](../docs/security/RBAC-IMPLEMENTATION.md) — Role-based access control details.
- [Data Protection](../docs/security/data-protection.md) — Data privacy and protection strategies.

### 🚀 Deployment
- [Vercel Deployment](../docs/deployment/VERCEL-DEPLOYMENT.md) — Production deployment via Vercel.
- [CI/CD Pipeline](../docs/deployment/vercel-deployment-guide.md) — Automated builds and deployment pipeline.
- [Launch Checklist](../docs/deployment/launch-checklist.md) — Steps to go live safely.

### 📈 Monitoring & Analytics
- [Monitoring](../docs/monitoring/README.md) — Monitoring strategy and tools.
- [Analytics Setup](../docs/analytics/ANALYTICS.md) — How to set up analytics and dashboards.
- [Event Tracking](../docs/analytics/EVENTS.md) — Event and metric tracking best practices.

### 🤝 Contributing
- [Contributing Guide](../CONTRIBUTING.md) — How to contribute and our code of conduct.

## 🎯 Quick Links

- [Project Setup](../docs/getting-started/README.md#project-setup) — Quick setup for new contributors.
- [Environment Variables](../docs/getting-started/environment.md#environment-variables) — List of required environment variables.
- [Database Schema](../docs/database/schema_documentation.md) — Full schema reference and ERD.
- [Deployment Process](../docs/deployment/VERCEL-DEPLOYMENT.md#deployment-process) — Steps to deploy to production.
- [Security Checklist](../docs/security/security.md#security-checklist) — Security best practices and checklist.

## 📄 FAQ & Common Tasks
- [Troubleshooting](./troubleshooting/README.md) — Common issues and solutions.
- [Support](./support/README.md) — How to get help or contact the team.

## 💡 Suggest an Improvement
Found an error or want to improve the docs? [Open an issue](https://github.com/NeothinkDAO/your-repo/issues/new/choose) or submit a pull request! Your feedback helps us delight users, admins, and AI agents alike.

## 📄 License
This project is proprietary software owned by Neothink DAO and the Mark Hamilton Family. All rights reserved. See the [LICENSE](../LICENSE) file for details.