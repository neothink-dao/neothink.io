---
title: Keeping Types & Schema in Sync
last_updated: 2025-04-15
summary: How to keep TypeScript types in sync with the Supabase database schema for flawless developer/AI productivity.
---

# Keeping Types & Schema in Sync

To ensure type safety and a flawless developer/AI experience, always keep your TypeScript types in sync with the Supabase database schema.

## 1. **Auto-Generated Types Location**
- The canonical types live in [`types/database.ts`](../../types/database.ts).
- This file is **auto-generated**. Do not edit it manually.

## 2. **Generating Types**
- Run the following command from the project root:

  ```sh
  pnpm generate:types
  ```
- This will run [`scripts/generate-types.ts`](../../scripts/generate-types.ts) and update the types file.

## 3. **When to Regenerate**
- After any Supabase migration or schema change
- Before opening a PR that changes database structure
- As part of CI/CD (recommended)

## 4. **CI/CD Automation (Optional)**
- Add `pnpm generate:types` to your pre-commit hooks or CI pipeline to enforce type sync.
- Example (GitHub Actions step):
  ```yaml
  - name: Generate DB Types
    run: pnpm generate:types
  ```

## 5. **References in the Codebase**
- All API endpoints and services use these types for maximum safety and productivity.
- Docs and OpenAPI references link to this file for type details.

## 6. **Troubleshooting**
- If types are out of sync, regenerate and commit the updated file.
- If you see type errors after a migration, always run the generate script first.

---

> By keeping types and schema perfectly aligned, you ensure a flawless, scalable, and AI-friendly developer experience.
