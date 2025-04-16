# Application Routes Overview

This document lists the main routes/pages for each app in the Neothink DAO monorepo, following Next.js App Router conventions. Each route is grouped by app and route group, with a brief description.

---

## Hub App (`apps/hub`)

- `/` — Home page
- `/dashboard` — User dashboard
- `/admin` — Admin dashboard (protected)
- `/api/*` — API routes
- `/globals.css` — Global styles

### Route Groups
- `(auth)`
  - `/login` — User login
  - `/signup` — User registration
  - `/signupconfirm` — Signup confirmation
  - `/confirm` — Email confirmation (API route)
  - `/forgotpassword` — Password reset
  - `/update` — Update user info
  - `/error` — Auth error page
- `(routes)`
  - `/chat` — Chat interface
  - `/discover` — Discover content
  - `/endgame` — Endgame content
  - `/onboard` — Onboarding flow
  - `/progress` — Progress tracking
- `(authenticated)`
  - `/discover` — Authenticated discover page
- `(marketing)`
  - `/about` — About page
  - `/features` — Features overview
  - `/pricing` — Pricing info
  - `/` — Marketing landing page

---

## Ascenders App (`apps/ascenders`)

- `/` — Home page
- `/dashboard` — User dashboard
- `/admin` — Admin dashboard (protected)
- `/api/*` — API routes
- `(auth)` — Auth routes (login, signup, etc.)
- Other route groups and pages follow similar conventions as hub.

---

## Immortals App (`apps/immortals`)

- `/` — Home page
- `/dashboard` — User dashboard
- `/admin` — Admin dashboard (protected)
- `/api/*` — API routes
- `(auth)` — Auth routes (login, signup, etc.)
- `(routes)`
  - `/immortals` — Immortals community
  - `/immortal` — Immortal journey page
- `(marketing)`
  - `/about` — About page
  - `/features` — Features overview
  - `/pricing` — Pricing info

---

## Neothinkers App (`apps/neothinkers`)

- `/` — Home/landing page
- `/dashboard` — User dashboard
- `/admin` — Admin dashboard (protected)
- `/api/*` — API routes
- `(auth)` — Auth routes (login, signup, etc.)
- Other route groups and pages follow similar conventions as hub.

---

## Notes
- All apps use centralized security middleware from `@neothink/auth`.
- All routes use lowercase, hyphen-separated names.
- Dynamic routes use `[param]` syntax.
- API routes use `route.ts` and export the correct handler.
- Each `page.tsx` exports a default React component.

For more details, see the source code in each app's `/app` directory. 