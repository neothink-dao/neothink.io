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
- [Security & Compliance](#-security--compliance)
- [FAQ](#-frequently-asked-questions-faq)
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

## 🔒 Security & Compliance

- **Database:** All schema changes use audited migrations and are tracked in version control.
- **RLS:** Row Level Security is enabled and enforced for all tables—see [SECURITY.md](./SECURITY.md).
- **Governance:** All changes are peer-reviewed and subject to DAO approval.
- **Compliance:** We follow best practices for privacy, data protection, and open research.

[⬆️ Back to Top](#table-of-contents)

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Who can participate in Neothink DAO?**
A: Anyone! Builders, researchers, admins, and curious users are all welcome. See [ONBOARDING.md](./ONBOARDING.md) to get started.

**Q: How do I contribute research or data?**
A: Open a Pull Request or GitHub Issue, or follow the instructions in `/papers/README.md` and `/results/`.

**Q: How is the DAO governed?**
A: See [DAO_GOVERNANCE.md](./DAO_GOVERNANCE.md) for full details on voting, proposals, and contributor onboarding.

**Q: Is my data secure?**
A: Yes! All user/admin data is protected by Supabase RLS, audited migrations, and strict security policies.

**Q: Where can I get help?**
A: Open a [GitHub Issue](https://github.com/neothink-dao/neothink.io/issues), join our [Discussions](https://github.com/neothink-dao/neothink.io/discussions), or see [Feedback & Support](./docs/support/README.md).

[⬆️ Back to Top](#table-of-contents)

---

## 📄 License

This project is proprietary software owned by Neothink DAO and the Mark Hamilton Family. All rights reserved. See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Turborepo](https://turbo.build/)
- [Vercel](https://vercel.com/)

---

## 🗂️ Key Developer Documentation

- [Database Schema Documentation](docs/database/schema_documentation.md)
- [Entity Relationship Diagram (ERD)](docs/database/database_diagram.md)
- [RLS Policy Documentation](docs/security/authorization.md)
- [Migration Guide](docs/database/MIGRATIONS.md)
- [Onboarding Guide](./ONBOARDING.md)
- [Security Policy & Checklist](./SECURITY.md)

---

For more details, see the README in each app/site and the [docs/](./docs) directory.

[⬆️ Back to Top](#table-of-contents)