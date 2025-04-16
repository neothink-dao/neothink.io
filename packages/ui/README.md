# UI Package

## Purpose
This package contains all shared UI components for the monorepo, including those from the Supabase UI Library and custom components used across all apps.

## Features
- Supabase UI Library components (auth, forms, notifications, etc.)
- Custom shared components for branding and delight
- Consistent design system (Tailwind 4, dark/light, accessibility)

## Usage
Import components from this package in any app:

```tsx
import { Button, AuthForm, Notification } from '@neothink/ui';
```

## Contribution
- Add new shared components here, not in individual apps.
- Follow the design system and accessibility guidelines.
- Document all new components with usage examples.

See the root `CONTRIBUTING.md` for more details. 