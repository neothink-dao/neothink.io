# Troubleshooting Guide

> **For Users & Admins:** This guide helps you resolve common issues when working with the Neothink platform. For urgent or unresolved problems, see [Support](../support/README.md).

## Common Issues & Solutions

### 1. Environment Setup Problems
- **Node or pnpm version errors:**
  - Ensure you are using Node.js 22.x+ and pnpm 9.x+ (`node -v`, `pnpm -v`).
- **Missing environment variables:**
  - Copy `.env.example` to `.env` and fill in all required values. See [Getting Started](../getting-started/README.md#prerequisites).

### 2. Database & Supabase
- **Migration errors:**
  - Run `pnpm db:push` and check for errors in your SQL migrations.
- **RLS/Authorization issues:**
  - Review [RLS Policy Documentation](../security/authorization.md) and [Security Guide](../security/security.md).

### 3. Local Development
- **pnpm install fails:**
  - Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install` again.
- **Dev server won’t start:**
  - Check logs for errors; ensure all required services (Supabase, Postgres) are running.

### 4. Deployment
- **Vercel build failures:**
  - Confirm all environment variables are set in Vercel dashboard.
  - Ensure all migrations have been applied and schema is up to date.

### 5. Authentication
- **Login issues:**
  - Confirm Supabase Auth is configured and redirect URLs are correct.
  - Check [Authentication Security](../security/authentication.md).

## Where to Get Help
- See [Support](../support/README.md) for direct help or to report a bug.
- For security issues, see [Security Guide](../security/security.md) and [How to Report a Security Issue](../security/security.md#how-to-report-a-security-issue).

---
> Continuous improvement: If you spot a recurring issue or have a suggestion, please [open an issue](https://github.com/neothink-dao/neothink.io/issues/new/choose) or submit a PR to improve this guide!
