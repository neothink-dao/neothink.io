# Neothink Admin App

## Overview
The Neothink Admin app is part of a four-app Vercel monorepo, sharing a single Supabase backend. This app is designed for secure, efficient, and delightful admin experiences, following best practices for onboarding, security, and deployment.

## Getting Started

### 1. Clone the Monorepo
```sh
git clone https://github.com/your-org/neothink-dao.git
cd neothink-dao
```

### 2. Install Dependencies
```sh
pnpm install
```

### 3. Configure Environment Variables
- Copy the example file:
  ```sh
  cp apps/admin/.env.example apps/admin/.env
  ```
- Fill in the following variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `NEXT_PUBLIC_SITE_URL`

### 4. Supabase Redirect URLs
- In Supabase dashboard → Authentication → URL Configuration, add:
  - Production: `https://admin.yourdomain.com`
  - Preview: `https://admin-<branch>--yourdomain.vercel.app`
  - Local: `http://localhost:3000`

### 5. Local Development
```sh
pnpm dev --filter @neothink/admin
```

### 6. Build & Deploy
- Production builds via Vercel CI/CD.
- Local build:
  ```sh
  pnpm build --filter @neothink/admin
  ```

## Supabase Security (RLS)
- RLS enabled on all tables.
- Policies for `anon` and `authenticated` roles (see `/supabase/migrations/`).
- Never share your service key publicly.

## Onboarding Checklist
- [ ] Environment variables configured
- [ ] Supabase redirect URLs set
- [ ] Local dev works
- [ ] All tests pass
- [ ] Review RLS policies

---
See root `LAUNCH_CHECKLIST.md` and monorepo README for more details.
