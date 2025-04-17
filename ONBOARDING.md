# Neothink DAO Contributor Onboarding Guide

Welcome to the Neothink DAO monorepo! This guide will help you get started as a contributor, admin, or DAO member. The goal is to ensure a seamless, transparent, and delightful experience for all participants.

---

## 🚀 Quickstart / Core Path
Follow these steps for a minimal, production-ready setup:

1. **Clone the repo**
   ```sh
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```
2. **Install dependencies**
   ```sh
   pnpm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in required values (Supabase keys, Vercel, etc).
4. **Generate and sync Supabase types**
   - Run `pnpm generate:supabase-types` to ensure local types match the DB schema.
5. **(Optional) Run local dev server**
   - See app-specific README in `apps/` for local development instructions.

---

## 1. Project Overview
- **Monorepo**: 4 Vercel apps/sites, all sharing a single Supabase database.
- **DAO Governance**: All changes are reviewed and approved by the DAO. Joshua Seymour is the current steward; the goal is full DAO self-governance.
- **Production-Ready**: Schema, code, types, and docs are always in sync.

## 2. Getting Started
1. **Review the schema and ER diagram**
   - See [`supabase/schema/schema.sql`](../supabase/schema/schema.sql) and [`supabase/schema/er_diagram.dbml`](../supabase/schema/er_diagram.dbml).
2. **Understand RLS and DB functions**
   - See [`supabase/schema/RLS_AND_FUNCTIONS.md`](../supabase/schema/RLS_AND_FUNCTIONS.md) for security and function docs.
3. **TypeScript types**
   - Use types from [`supabase/types/generated.ts`](../supabase/types/generated.ts) for all DB access.

## 3. Contributing
- **Follow DAO governance**: All PRs/issues are discussed and voted on by the DAO. See [`DAO_GOVERNANCE.md`](./DAO_GOVERNANCE.md).
- **Schema changes**: Use migrations (`supabase/migrations/`). Document all changes.
- **Keep docs in sync**: Update ERD, types, and RLS docs after every change.
- **Automated checks**: CI will validate schema/types/docs sync on every PR.

## 4. Support & Questions
- **DAO Governance**: See [`DAO_GOVERNANCE.md`](./DAO_GOVERNANCE.md) for process, voting, and onboarding.
- **Open an issue**: For bugs, proposals, or questions.
- **DAO channels**: Join our Discord/Telegram for real-time help.

---

## Feedback & Improvements
If anything in this guide is unclear or missing, please open an issue or PR! Your feedback helps us continuously improve the onboarding experience.

---

Welcome to the journey! Your contributions help build a world-class, user/admin-centric platform governed by the Neothink DAO.
