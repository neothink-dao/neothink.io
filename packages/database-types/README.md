# @neothink/database-types

This package provides up-to-date TypeScript types generated from the shared Supabase database schema, ensuring type safety and consistency across all Neothink DAO apps (Ascender, Neothinker, Immortal, and Hub).

## Usage
- Import types from this package in any app or package within the monorepo to ensure type-safe database access.

## Generating Types
Run the following command in this directory to generate types from your Supabase project:

```sh
SUPABASE_PROJECT_ID=your-project-id supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema public > index.ts
```

- Replace `your-project-id` with your actual Supabase project ID.
- Requires the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and authenticated.

## Example Import
```ts
import type { Database } from '@neothink/database-types';
```

## Best Practices
- Always regenerate and commit types after any schema change or migration.
- Keep this package versioned and up to date in all apps.

---

For questions or improvements, open an Issue or PR in the main repo.
