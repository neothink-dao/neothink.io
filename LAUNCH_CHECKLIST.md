# 🚀 Neothink Monorepo Launch Checklist

This checklist ensures your monorepo of 4 Vercel apps, powered by a shared Supabase backend, is fully production-ready and delivers a magnetic, delightful experience for users and admins.

---

## 1. Monorepo & Build Health
- [ ] All packages and apps build cleanly (`pnpm build`)
- [ ] All TypeScript types are correct and exported
- [ ] No unresolved imports/exports
- [ ] No dead code or ambiguous dependencies

## 2. Environment Variables
- [ ] `.env.example` present and accurate for every app
- [ ] All Vercel projects have correct env vars set
- [ ] No secrets in public code or version control

## 3. Supabase Configuration
- [ ] Row Level Security (RLS) enabled on all tables (see summary below)
- [ ] RLS policies are granular (one per operation/role)
- [ ] Policies reviewed for both `anon` and `authenticated` roles
- [ ] Supabase redirect URLs set for each app:
  - Production, Preview, Local

### RLS Policy Coverage Summary

| Schema   | Table                    | RLS Enabled | Notes                          |
|----------|--------------------------|-------------|--------------------------------|
| auth     | users                    | ✅          | User login data                |
| public   | user_profiles            | ✅          | User profile data              |
| public   | xp_events                | ✅          | Gamification event logs        |
| public   | user_concept_progress    | ❌          | Review if intentional (system?)|
| auth     | settings                 | ❌          | System config table            |
| ...      | ...                      | ...         | ...                            |

- For any table without RLS, document the rationale in `/supabase/migrations/` and/or here.

## 4. CI/CD & Deployment
- [ ] Vercel projects connected to repo (one per app)
- [ ] PRs trigger preview deployments
- [ ] Main branch triggers production deploys
- [ ] Vercel Analytics enabled for all apps
- [ ] Error monitoring/logging enabled

## 5. User/Admin Experience
- [ ] All user flows tested (sign up, sign in, password reset, onboarding)
- [ ] All admin flows tested (dashboard, user management, analytics)
- [ ] UI/UX is modern, accessible, and responsive
- [ ] Edge cases and error states handled gracefully

## 6. Documentation & Onboarding
- [ ] Each app has a clear, up-to-date `README.md`
- [ ] Onboarding steps are documented for new devs
- [ ] Supabase RLS policies documented in `/supabase/migrations/`
- [ ] Launch checklist reviewed and completed

---

## Final Pre-Launch Steps
- [ ] Run `pnpm build` and resolve any errors
- [ ] Deploy all apps to Vercel and verify production URLs
- [ ] Perform end-to-end testing as a new user and admin
- [ ] Review analytics and error logs after first users join

---

For questions or onboarding, see each app’s `README.md` and `/supabase/migrations/` for security policies.
