# Neothink Platform Documentation

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../LICENSE) file for details.

Welcome to the Neothink Platform documentation. This monorepo contains four interconnected applications sharing a common Supabase backend and a set of shared packages.

## 📚 Documentation Structure

### 🏗️ Architecture
- [Architecture Overview](./architecture/README.md) — System, security, and deployment architecture
- [Monorepo Guide](./architecture/MONOREPO-GUIDE.md) — Project structure and development practices
- [Database Architecture](./architecture/DATABASE-ARCHITECTURE.md) — Database design and relationships
- [Authentication Flow](./architecture/AUTH.md) — Auth system design and implementation
- [Shared Supabase](./architecture/SHARED-SUPABASE.md) — Shared backend configuration

### 🤖 AI & Automation
- [AI Agent Onboarding](../FOR_AI_AGENTS.md)

### 🧩 Onboarding & Game Guides
  - [How the Game Works: Ascender](./onboarding/ascender.md)
  - [How the Game Works: Neothinker](./onboarding/neothinker.md)
  - [How the Game Works: Immortal](./onboarding/immortal.md)
  - [How the Game Works: Superachiever](./onboarding/superachiever.md)

### 🚀 Getting Started
- [Onboarding & Quick Start](../docs/getting-started/README.md)
- [Environment Setup](../docs/getting-started/environment.md)
- [Core Concepts](../docs/getting-started/core-concepts.md)
- [Development Workflow](../docs/getting-started/development.md)

### 🔧 Development
- [API Documentation](../docs/development/API.md)
- [Testing Guide](../docs/development/TESTING.md)
- [Authentication Status](../docs/development/AUTHENTICATION-STATUS.md)
- [Declarative Schemas](../docs/development/DECLARATIVE_SCHEMAS.md)
- [Keeping Types & Schema in Sync](./development/types-and-schema.md)

### 📦 Database
- [Supabase Integration](../docs/database/SUPABASE-INTEGRATION.md)
- [Schema Documentation](../docs/database/schema_documentation.md)
- [Migrations](../docs/database/MIGRATIONS.md)
- [Query Patterns](../docs/database/DATABASE_FUNCTIONS.md)
- [Entity Relationship Diagram (ERD)](../docs/database/database_diagram.md)
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
  - [Ritual Audits & Continuous Improvement](./admin/CONTINUOUS_IMPROVEMENT.md)

### 🔒 Security
- [Security Guide](../docs/security/security.md)
- [Authentication Security](../docs/security/authentication.md)
- [RLS Policy Documentation](../docs/security/authorization.md)
- [RBAC Implementation](../docs/security/RBAC-IMPLEMENTATION.md)
- [Data Protection](../docs/security/data-protection.md)

### 🚀 Deployment
- [Vercel Deployment](../docs/deployment/VERCEL-DEPLOYMENT.md)
- [CI/CD Pipeline](../docs/deployment/vercel-deployment-guide.md)
- [Launch Checklist](../docs/deployment/launch-checklist.md)

### 📈 Monitoring & Analytics
- [Monitoring](../docs/monitoring/README.md)
- [Analytics Setup](../docs/analytics/ANALYTICS.md)
- [Event Tracking](../docs/analytics/EVENTS.md)

### 🤝 Contributing
- [Contributing Guide](../CONTRIBUTING.md)

## 🎯 Quick Links

- [Project Setup](../docs/getting-started/README.md#project-setup)
- [Environment Variables](../docs/getting-started/environment.md#environment-variables)
- [Database Schema](../docs/database/schema_documentation.md)
- [Deployment Process](../docs/deployment/VERCEL-DEPLOYMENT.md#deployment-process)
- [Security Checklist](../docs/security/security.md#security-checklist)

## 💡 Suggest an Improvement
Found an error or want to improve the docs? [Open an issue](https://github.com/NeothinkDAO/your-repo/issues/new/choose) or submit a pull request! Your feedback helps us delight users, admins, and AI agents alike.

## 📄 License
This project is proprietary software owned by Neothink DAO and the Mark Hamilton Family. All rights reserved. See the [LICENSE](../LICENSE) file for details.