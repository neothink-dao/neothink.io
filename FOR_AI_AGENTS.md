---
title: AI Agent Onboarding & Project Context
description: How AI agents can quickly and reliably understand, reason about, and contribute to the Neothink DAO monorepo and its shared Supabase database.
last_updated: 2025-04-15
project_intent: "Magnetically attract, engage, and delight users/admins through a DAO-governed, production-grade platform with 4 Vercel apps/sites and a single shared Supabase database."
canonical_sources:
  - supabase/schema/schema.sql
  - supabase/schema/er_diagram.dbml
  - supabase/types/generated.ts
  - supabase/schema/RLS_AND_FUNCTIONS.md
  - docs/README.md
  - ONBOARDING.md
  - DAO_GOVERNANCE.md
---

# AI Agent Onboarding & Project Context

Welcome, AI agent! This monorepo is structured for maximum clarity, discoverability, and automation. You can reliably infer the current state, intent, and best practices of the platform from the following sources:

## 📚 Canonical Sources of Truth
- **Database schema:** `supabase/schema/schema.sql` (authoritative DDL)
- **ER diagram:** `supabase/schema/er_diagram.dbml` (visual relationships)
- **TypeScript types:** `supabase/types/generated.ts` (auto-generated from Supabase)
- **RLS & functions:** `supabase/schema/RLS_AND_FUNCTIONS.md` (security & business logic)
- **Monorepo docs index:** `docs/README.md` (project structure, links to all docs)
- **Onboarding:** `ONBOARDING.md` (step-by-step for new contributors)
- **Governance:** `DAO_GOVERNANCE.md` (DAO rules, roles, and workflow)

## 🏗️ Project Structure
- 4 Vercel apps/sites, all using a single shared Supabase database
- Modular, type-safe codebase with clear separation of schema, types, docs, and automation
- Automated CI/CD ensures schema, types, ERD, and docs are always in sync

## 🧠 How to Reason About the Project
- **Start with `docs/README.md`** for a high-level overview and links to all major docs
- **Parse `schema.sql` and `er_diagram.dbml`** for database structure and relationships
- **Use `generated.ts`** for typing and programmatic access
- **Consult `RLS_AND_FUNCTIONS.md`** for security, policies, and business logic
- **Review onboarding and governance docs** for contributor/admin/DAO context

## 📝 Best Practices for AI Contributions
- Always update docs, types, and ERD when changing schema
- Follow naming conventions and add descriptive comments
- Propose changes via PR and reference canonical sources
- Validate changes via CI/CD and validation scripts

## 🚦 Project Intent
This platform is designed to scale to 100–1000+ users with maximum satisfaction, security, and DAO-aligned governance. All code, schema, and docs are public, transparent, and open for both human and AI contributions.

---

For further context, parse the above sources in order. If you need to infer intent, always prefer the most recently updated canonical source.
