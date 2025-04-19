# Neothink DAO Monorepo

[![Build Status](https://img.shields.io/github/actions/workflow/status/neothink-dao/neothink.io/ci.yml?branch=main)](https://github.com/neothink-dao/neothink.io/actions)
[![License](https://img.shields.io/github/license/neothink-dao/neothink.io)](./LICENSE)
[![Join the Community](https://img.shields.io/badge/Join-Community-blue)](https://github.com/neothink-dao/neothink.io/discussions)

---

> **Neothink DAO is building the world’s first open, positive-sum network state platform—magnetically attracting, engaging, and delighting users and admins through gamified, transparent, and collaborative systems.**

---

## 🏆 Executive Summary

Neothink DAO is the world’s first open, positive-sum network state platform. We unite four flagship apps—Ascenders, Neothinkers, Immortals, and Hub—on a single, production-grade Supabase database. Our mission: magnetically attract, engage, and delight users and admins through gamified, transparent, and collaborative systems for prosperity, happiness, longevity, and luckiness. Governed by the community, powered by open research, and designed for scalability, Neothink DAO is building the blueprint for digital societies in 2025 and beyond.

---

## 📋 Table of Contents

- [Company Purpose](#-company-purpose)
- [Problem](#-problem)
- [Solution](#-solution)
- [Why Now?](#-why-now)
- [Market Potential](#-market-potential)
- [Competition / Alternatives](#-competition--alternatives)
- [Business Model](#-business-model)
- [Team](#-team)
- [Financials](#-financials)
- [Vision](#-vision)
- [Universal Onboarding](#-start-here-universal-onboarding)
- [Apps/Sites](#-appssites-in-this-monorepo)
- [Shared Supabase Database](#-shared-supabase-database)
- [Contributing & Feedback](#-contributing--feedback)
- [Production Readiness](#-production-readiness-checklist)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation-user--admin-quick-links)
- [User & Admin Journeys](#-user--admin-journeys)
- [Continuous Improvement](#-continuous-improvement)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Developer Docs](#-key-developer-documentation)

---

## 🧑‍💻 Quick Start

**Clone, install, and launch in minutes:**

```bash
# 1. Clone the repository
 git clone https://github.com/neothink-dao/neothink.io.git
 cd neothink.io

# 2. Install dependencies
 pnpm install

# 3. Copy environment variables
 cp .env.example .env

# 4. Start all apps
 pnpm dev
```

- See [ONBOARDING.md](./ONBOARDING.md) for a step-by-step guide.
- For production, see [DEPLOYMENT.md](./docs/deployment/README.md).

---

# 🏢 Company Purpose

Neothink DAO is building the world’s first open, positive-sum network state platform—magnetically attracting, engaging, and delighting users and admins through gamified, transparent, and collaborative systems for prosperity, happiness, longevity, and luckiness.

# 🚩 Problem

Today’s online communities and DAOs struggle with engagement, transparency, and sustainable governance. Most platforms are fragmented, lack user-centric design, and fail to reward meaningful contribution. Users and admins alike experience friction, unclear incentives, and limited ownership.

# 💡 Solution

Neothink DAO unifies four flagship apps (Ascenders, Neothinkers, Immortals, Hub) into a living, evolving network state. Each app is a “network state experiment” powered by a shared Supabase database, universal onboarding, and fractal, meritocratic, and sociocratic governance. Our gamified system rewards positive-sum actions, transparent collaboration, and real-world impact—delivering a uniquely magnetic user and admin experience that iterates based on open feedback and data.

# ⏳ Why Now?

The convergence of DAOs, network states, and composable Web3 tools makes it possible to build transparent, user-owned, and scalable digital societies. The world is hungry for new models of governance, engagement, and community—yet most solutions are still siloed, closed, or fragmented. Neothink DAO is the right project at the right time, leveraging the latest tech and governance research.

# 🌍 Market Potential

Our initial users are builders, researchers, DAO members, and open-source contributors seeking high-engagement, transparent, and rewarding communities. The broader market includes any community, DAO, or organization seeking to evolve into a network state. Neothink DAO aims to invent and lead the “network state platform” market.

# 🥊 Competition / Alternatives

Direct competitors include DAO platforms (e.g., DAOstack, Aragon), online community tools (e.g., Discord, Discourse), and emerging network state projects. Indirect competition includes legacy social networks and closed SaaS platforms. Neothink DAO wins by combining open research, composable tech, and a relentless focus on user/admin delight, transparency, and positive-sum incentives.

# 💸 Business Model

Neothink DAO is a hybrid open-source and membership-driven platform. Revenue streams include premium memberships, governance tokens, consulting for network state launches, and custom integrations for aligned communities. All revenue is transparently managed by the DAO.

# 👥 Team

- **Recognized Founder:** Mark Hamilton and the Hamilton Family
- **Main Steward:** Joshua Seymour (on behalf of the founder and active communities)
- **Core Contributors:** The most active members of the Neothink DAO and its aligned communities

# 📊 Financials

Neothink DAO is pre-revenue and funded by the founder and early contributors. All financials, budgets, and treasury operations are transparently managed by the DAO and published in the governance docs.

# 🚀 Vision

In five years, Neothink DAO will have built the world’s most magnetic, rewarding, and transparent network state platform—powering thousands of thriving communities and DAOs, recognized for its positive-sum impact, open research, and collaborative governance. The platform will be self-governing, with all key decisions made by the community, and will serve as a blueprint for digital societies worldwide.

---

Welcome to the Neothink DAO monorepo—a unified codebase powering four Vercel apps/sites, a shared Supabase database, and a living research portal. This repository is designed to magnetically attract, engage, and delight users and admins through clarity, collaboration, and world-class best practices.

---

## 🧭 Start Here: Universal Onboarding

- **What is Neothink DAO?**
  - A collaborative, positive-sum ecosystem built on fractal, meritocratic, and sociocratic governance principles.
- **Who are our users?**
  - **Ascender:** Optimizing for prosperity (LIVE token)
  - **Neothinker:** Optimizing for happiness (LOVE token)
  - **Immortal:** Optimizing for longevity (LIFE token)
  - **Superachiever:** Optimizing for luckiness (LUCK token)
- **How to get involved?**
  - [Read the flagship papers & research](./papers/README.md)
  - [Explore the governance model](./DAO_GOVERNANCE.md)
  - [See the contributor guide](./CONTRIBUTORS.md)

---

## 🏛️ Governance Model (Summary)

Neothink DAO uses:
- **Fractal:** Distributed, self-similar groups for decision-making
- **Meritocratic:** Rewards and influence based on meaningful contribution
- **Sociocratic:** Consent-based, peer-driven evolution of rules and structures

[Full governance details →](./DAO_GOVERNANCE.md)

---

## 📚 Research & Papers

- [Papers Portal: Token Purpose, Flagship Papers, and Contribution Guide](./papers/README.md)
- Each app/site links to this portal for cross-app clarity and engagement.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (latest)
- **Language:** TypeScript (strict, latest)
- **Database:** Supabase (PostgreSQL, RLS, migrations)
- **UI:** React, Tailwind CSS
- **State Management:** Zustand, React Context
- **Build Tool:** Turborepo
- **Package Manager:** pnpm
- **Deployment:** Vercel
- **Monitoring:** PostHog, custom logging
- **Testing:** Vitest, React Testing Library

**Monorepo Structure:**

```
neothink-platform/
├── apps/         # Four Vercel apps (hub, ascenders, neothinkers, immortals)
├── packages/     # Shared code: core, ui, utils, types, hooks, analytics, etc.
├── supabase/     # Database schema, migrations, RLS, docs
├── docs/         # All documentation, guides, and standards
├── results/      # Open data and experiment logs
├── papers/       # Research, flagship papers, and experiment logs
└── ...           # CI, scripts, config, etc.
```

---

## 🛠️ Apps/Sites in This Monorepo

- **Ascenders** ([apps/ascenders](./apps/ascenders)) — For prosperity-focused users
- **Neothinkers** ([apps/neothinkers](./apps/neothinkers)) — For happiness-focused users
- **Immortals** ([apps/immortals](./apps/immortals)) — For longevity-focused users
- **Hub** ([apps/hub](./apps/hub)) — Cross-app navigation, admin, and meta-governance

---

## 🗄️ Shared Supabase Database

- Centralized schema, RLS policies, and migrations in [supabase/](./supabase)
- [See schema documentation](./supabase/README.md)

---

## 🤝 Community & Contribution

- **Start here:** [CONTRIBUTING.md](./CONTRIBUTING.md), [ONBOARDING.md](./ONBOARDING.md)
- **Peer review:** [GitHub Issues](https://github.com/neothink-dao/neothink.io/issues), [Discussions](https://github.com/neothink-dao/neothink.io/discussions)
- **Add papers/data:** See `/papers/README.md` and `/results/`
- **Admin/DAO governance:** [DAO_GOVERNANCE.md](./DAO_GOVERNANCE.md)

**All contributions are welcome—new users, researchers, and admins!**

---

## 🟢 Production Readiness Checklist

- [x] Unified onboarding and branding
- [x] Papers/research portal up to date and magnetic
- [x] Governance model documented and accessible
- [x] Supabase schema and RLS policies reviewed
- [x] Linting, formatting, and type-checking enforced
- [x] CI/CD pipelines green for all apps
- [x] Feedback and peer review workflow in place

---

For more details, see the README in each app/site and the [docs/](./docs) directory.

> **New to the project? Start here:** See our [ONBOARDING.md](./ONBOARDING.md) for a fast, frustration-free setup and contribution guide.

> **Current Governance:**
> Joshua Seymour is the benevolent dictator and steward of the Neothink DAO. The long-term goal is for the DAO to fully govern itself and all its assets through decentralized, transparent processes.

This monorepo/turborepo contains 4 Vercel apps/sites, all sharing a single production-grade Supabase database. **All code, schema, and documentation are owned, governed, and managed by the Neothink DAO.**

## Key Principles
- **DAO Governance:** All changes are subject to DAO approval and transparent governance.
- **Database as Code:** All schema changes are managed via migrations and version-controlled.
- **Code/DB Sync:** TypeScript types, schema, and documentation are always kept in sync.
- **User/Admin Delight:** The stack is designed for maximum engagement, clarity, and security for both users and admins.

## ✨ User & Admin Experience (2025 Update)

**For Users:**
- Enjoy a seamless onboarding journey with progressive challenges and rewards.
- Track your progress, XP, points, and badges across all apps from a unified dashboard.
- Participate in cross-app challenges, earn bonuses, and climb the leaderboard.
- Transparent governance: vote, propose, and contribute to DAO decisions.
- Access clear guides, FAQs, and support for every step.

**For Admins:**
- Manage users, roles, and permissions with actionable dashboards.
- Configure and tune gamification rewards and multipliers per app.
- Monitor engagement, analytics, and system health in real time.
- Enforce and audit RLS, security, and compliance policies.
- Use migration and schema tools to evolve the platform safely.

## 🚀 What’s New in 2025?
- Partitioned audit/event tables for scalability and performance.
- Centralized reward engine and dynamic multipliers (per app, per action).
- Enhanced onboarding and progressive disclosure for new users.
- New governance flows: quadratic voting, delegated voting, Council rotation, and vetoes.
- App-specific guides and admin controls for unique challenges and rewards.
- Real-time analytics and feedback loops for continuous improvement.

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

## 🏆 Neothink DAO Executive Summary

Neothink DAO is an open, positive-sum research and innovation collective. Our mission is to pioneer gamified, transparent, and scalable systems that delight users and empower admins—combining real-world experiments, open data, and collaborative governance. This monorepo is both our codebase and our living portfolio: it documents our journey, showcases experiments, and invites the world to peer review, contribute, and learn with us.

- **Mission:** Build and share breakthrough systems for positive-sum engagement, learning, and governance.
- **Vision:** Open, iterative research with real-world impact—by and for the community.
- **Audience:** Builders, researchers, DAO members, open-source contributors, and curious peers.

## ⭐ Featured Papers & Case Studies

Explore our most impactful experiments and research:

- [Luckiness Network State Experiment (LUCK)](papers/luckiness-network-state-experiment.md)
- [Prosperity Network State Experiment (LIVE)](papers/prosperity-network-state-experiment.md)
- [Happiness Network State Experiment (LOVE)](papers/happiness-network-state-experiment.md)
- [Longevity Network State Experiment (LIFE)](papers/longevity-network-state-experiment.md)
- [All Papers, Case Studies & Experiment Logs](./papers/README.md)

## 📂 Open Data & Results

- [Simulation Results (Sample)](./results/)
- [Add your own data: see `/papers/README.md` for how to contribute]

## 🤝 Peer Review & Collaboration

Neothink DAO thrives on open feedback and collaboration:
- **Peer Review:** Use [GitHub Issues](../../issues) or [Discussions](../../discussions) to comment on papers, propose new research, or suggest improvements.
- **Pull Requests:** Submit new experiments, data, or documentation via PRs.
- **Cross-Linking:** Papers and data are interlinked for discoverability and context.

## 🗺️ User & Admin Journeys

- **Users:**
  1. Onboard via personalized, app-specific flows
  2. Complete challenges, earn XP/points, unlock features
  3. Participate in governance and community events
  4. Get help and track progress from unified dashboard

- **Admins:**
  1. Monitor onboarding, engagement, and system health
  2. Tune reward logic and multipliers per app
  3. Manage user roles, permissions, and content
  4. Review analytics, feedback, and iterate

## 🔄 Continuous Improvement
- All docs, flows, and features are reviewed regularly based on analytics and user/admin feedback.
- See [Continuous Improvement Guide](./docs/admin/CONTINUOUS_IMPROVEMENT.md).

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

For more details, see the README in each app/site and the [docs/](./docs) directory.