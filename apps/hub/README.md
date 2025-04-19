# Hub App

Welcome to the Hub app—your command center for navigating all Neothink DAO sites, managing meta-governance, and accessing research and admin features.

---

## 🧭 Start Here
- **Who is this for?** All users, admins, and contributors seeking to connect across the DAO ecosystem.
- [Universal onboarding & glossary](../../README.md#start-here-universal-onboarding)
- [Flagship papers & research](../../papers/README.md)
- [Governance model](../../DAO_GOVERNANCE.md)

---

## 🌟 Key Features
- Cross-app navigation and user management
- Meta-governance dashboard
- Research and feedback aggregation

---

## 🤝 How to Contribute or Give Feedback
- [Contribution guide](../../CONTRIBUTORS.md)
- [Open a GitHub Issue](https://github.com/neothink-dao/neothink.io/issues)

---

## 🟢 Production Readiness Checklist
- [x] Onboarding and branding aligned
- [x] Research and feedback links present
- [x] Linting, formatting, and type-checking enforced
- [x] CI/CD green

---

## Getting Started

### 1. Clone the Monorepo
```sh
git clone https://github.com/neothink-dao/neothink.io.git
cd neothink.io
```

### 2. Install Dependencies
```sh
pnpm install
```

### 3. Configure Environment Variables
- Copy the example file:
  ```sh
  cp apps/hub/.env.example apps/hub/.env
  ```
- Fill in the following variables (get values from your Supabase/Vercel dashboards):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `NEXT_PUBLIC_SITE_URL`

### 4. Supabase Redirect URLs
- Go to your Supabase project dashboard → Authentication → URL Configuration.
- Add the following URLs:
  - Production: `https://hub.yourdomain.com`
  - Preview: `https://hub-<branch>--yourdomain.vercel.app`
  - Local: `http://localhost:3000`

### 5. Local Development
```sh
pnpm dev --filter @neothink/hub
```

### 6. Build & Deploy
- Production builds are handled by Vercel via GitHub integration.
- To build locally:
  ```sh
  pnpm build --filter @neothink/hub
  ```

## Supabase Security (RLS)
- Row Level Security (RLS) is enabled on all tables.
- Policies are granular for `anon` and `authenticated` roles (see `/supabase/migrations/` for SQL).
- Never share your service key publicly.

## Useful Links
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## Onboarding Checklist
- [ ] Environment variables configured
- [ ] Supabase redirect URLs set
- [ ] Local dev works
- [ ] All tests pass
- [ ] Review RLS policies

---
For more details, see the root `LAUNCH_CHECKLIST.md` and monorepo README.