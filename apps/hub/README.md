# Neothink Hub App

## Overview
The Neothink Hub is one of four Vercel apps in the monorepo, sharing a single Supabase backend. This app is designed for seamless user and admin experiences, leveraging modern best practices for security, performance, and onboarding.

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