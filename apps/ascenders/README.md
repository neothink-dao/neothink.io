# Ascenders App

Welcome to the Ascenders app—your portal to maximizing prosperity, value creation, and entrepreneurial success in the Neothink DAO ecosystem.

---

## 🧭 Start Here
- **Who is this for?** Ascenders and anyone seeking to optimize prosperity using the LIVE token.
- [Universal onboarding & glossary](../../README.md#start-here-universal-onboarding)
- [Flagship papers & research](../../papers/README.md)
- [Governance model](../../DAO_GOVERNANCE.md)

---

## 🌟 Key Features
- Real-time tracking of prosperity journeys
- Fractal, meritocratic, and sociocratic governance
- Seamless feedback and peer review integration

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
  cp apps/ascenders/.env.example apps/ascenders/.env
  ```
- Fill in the following variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `NEXT_PUBLIC_SITE_URL`

### 4. Supabase Redirect URLs
- In Supabase dashboard → Authentication → URL Configuration, add:
  - Production: `https://ascenders.yourdomain.com`
  - Preview: `https://ascenders-<branch>--yourdomain.vercel.app`
  - Local: `http://localhost:3000`

### 5. Local Development
```sh
pnpm dev --filter @neothink/ascenders
```

### 6. Build & Deploy
- Production builds via Vercel CI/CD.
- Local build:
  ```sh
  pnpm build --filter @neothink/ascenders
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