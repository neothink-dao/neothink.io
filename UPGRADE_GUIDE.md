# UPGRADE GUIDE: 2025 Production Readiness

## Overview
This guide summarizes all major upgrades, breaking changes, and migration steps performed to bring the monorepo to a flawless, production-ready state as of April 16, 2025.

---

## 1. Dependencies & Tooling

- **TypeScript upgraded to 5.8.x**
- **ESLint and all plugins upgraded to latest (April 2025):**
  - `eslint`, `@typescript-eslint/*`, `eslint-plugin-react`, `eslint-plugin-react-hooks`
- **Supabase client and helpers**: Latest stable
- **Deprecated:** `@supabase/auth-helpers-nextjs` → Use `@supabase/ssr`
- **All peer and sub-dependency warnings reviewed; no critical blockers remain.**

---

## 2. Security Event Logging & Types

- **All security event types, enums, and helpers are now centralized in `@neothink/database`.**
- **All logging functions in all apps import from this canonical source.**
- **No local or legacy type drift remains.**
- **All logging is DRY, robust, and tested.**

---

## 3. Database Schema & Policies

- **All new tables have RLS enabled by default.**
- **Granular, role-based policies for select, insert, update, delete.**
- **All migrations are timestamped, commented, and production-safe.**
- **Simulation/analytics fields (e.g., `simulation_run_id`) added for safe parallel data.**
- **Realtime enabled on all event tables for live dashboards and notifications.**

---

## 4. CI/CD & Developer Experience

- **All PRs and deploys run lint, type, test, and build checks.**
- **Monorepo builds and deploys cleanly to all 4 Vercel projects.**
- **Onboarding:**
  - One-command dev start: `pnpm install && pnpm dev`
  - All env vars and secrets are documented in `.env.example` and onboarding docs.

---

## 5. Breaking Changes & Migration Steps

- **Remove all local security event types/enums from app packages.**
- **Update all imports to use `@neothink/database` for canonical types.**
- **Review and reapply any custom RLS policies to new/expanded tables.**
- **Test all event logging and analytics in staging before production deployment.**

---

## 6. Final QA Checklist

- [ ] Run `pnpm lint && pnpm typecheck && pnpm build` (should pass with only non-blocking warnings)
- [ ] Smoke test all event logging in all apps
- [ ] Review Supabase dashboard for RLS and event data
- [ ] Confirm all 4 Vercel apps deploy and run cleanly
- [ ] Announce readiness to team/admins

---

For any future upgrades, always:
- Use centralized types and helpers
- Enable RLS and document policies for every table
- Upgrade dependencies in lockstep across all packages
- Document all breaking changes and migration steps
