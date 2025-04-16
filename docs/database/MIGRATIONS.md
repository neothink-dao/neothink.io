# Database Migrations Guide

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../../LICENSE) file for details.

> **How to use this guide:**
> - After every migration, update the [Schema Documentation](./schema_documentation.md) and [ERD](./database_diagram.md)
> - Reference the [Supabase Integration Guide](./SUPABASE-INTEGRATION.md) for environment and client setup
> - See [Getting Started](../getting-started/README.md) for onboarding and developer workflow

<!--
@metadata
{
  "type": "guide",
  "category": "database",
  "related": [
    "SHARED-SUPABASE.md",
    "SCHEMA.md",
    "QUERY-PATTERNS.md"
  ],
  "tags": ["migrations", "database", "supabase", "versioning"],
  "last_updated": "2024-03-20"
}
-->

## Migration Automation & CI/CD Integration

**Checklist:**
- [ ] All schema changes are made via migration files (no ad-hoc changes)
- [ ] Migrations are tested locally and in CI before production
- [ ] Migrations are applied automatically in CI/CD on deploy
- [ ] Rollback procedures are documented and tested

**Sample GitHub Actions Workflow:**
```yaml
name: Apply Supabase Migrations
on:
  push:
    branches: [main]
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: npx supabase db push
        env:
          SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
```

See the rest of this guide for migration structure, safety, and rollback best practices.

This guide explains how to manage database migrations across the Neothink Platform's four applications.

## 📦 Migration Structure

<!-- @codeblock-start: migration-structure -->
```
migrations/
├── shared/              # Shared migrations
│   ├── 001_initial.sql
│   ├── 002_users.sql
│   └── 003_sessions.sql
├── hub/                # Hub-specific migrations
│   ├── 001_profiles.sql
│   └── 002_settings.sql
├── ascenders/          # Ascenders-specific migrations
│   ├── 001_profiles.sql
│   └── 002_achievements.sql
├── neothinkers/        # Neothinkers-specific migrations
│   ├── 001_profiles.sql
│   └── 002_contributions.sql
└── immortals/          # Immortals-specific migrations
    ├── 001_profiles.sql
    └── 002_legacy.sql
```
<!-- @codeblock-end: migration-structure -->

## 🔄 Migration Process

### 1. Create Migration File
<!-- @command-start: create-migration -->
```bash
pnpm supabase migration new <migration-name>
```
<!-- @command-end: create-migration -->

### 2. Write Migration SQL
<!-- @sql-start: example-migration -->
```sql
-- Example migration
BEGIN;

-- Create table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_policy"
ON public.users
FOR SELECT
USING (auth.uid() = id);

COMMIT;
```
<!-- @sql-end: example-migration -->

### 3. Apply Migration
<!-- @command-start: apply-migration -->
```bash
# Apply all migrations
pnpm supabase db push

# Apply specific migration
pnpm supabase db push --version <version>
```
<!-- @command-end: apply-migration -->

## 🔒 Migration Safety

### Best Practices
<!-- @list-start: best-practices -->
1. Always use transactions
2. Include rollback steps
3. Test migrations locally first
4. Backup database before applying
5. Apply migrations in order
<!-- @list-end: best-practices -->

### Rollback Process

#### 1. Create Rollback File
<!-- @sql-start: rollback-example -->
```sql
-- Example rollback
BEGIN;

DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP TABLE IF EXISTS public.users;

COMMIT;
```
<!-- @sql-end: rollback-example -->

#### 2. Apply Rollback
<!-- @command-start: apply-rollback -->
```bash
pnpm supabase db reset
```
<!-- @command-end: apply-rollback -->

## 📊 Version Control

### Migration Versioning
<!-- @list-start: versioning-rules -->
- Use semantic versioning (e.g., 1.0.0)
- Track versions in `migrations/versions.json`
- Document breaking changes
<!-- @list-end: versioning-rules -->

### Version File
<!-- @json-start: version-file -->
```json
{
  "current": "1.0.0",
  "migrations": {
    "shared": {
      "001_initial.sql": "1.0.0",
      "002_users.sql": "1.0.1"
    },
    "hub": {
      "001_profiles.sql": "1.0.0"
    }
  }
}
```
<!-- @json-end: version-file -->

## 🔧 Maintenance

### Regular Tasks
<!-- @list-start: regular-tasks -->
1. Review migration history
2. Clean up old migrations
3. Update version tracking
4. Test rollback procedures
5. Document changes
<!-- @list-end: regular-tasks -->

### Emergency Procedures
<!-- @list-start: emergency-procedures -->
1. Stop all applications
2. Backup current state
3. Apply rollback if needed
4. Notify team members
5. Update documentation
<!-- @list-end: emergency-procedures -->

## 📚 Resources
<!-- @links-start: resources -->
- [Schema Documentation](./schema_documentation.md)
- [Database Diagram (ERD)](./database_diagram.md)
- [Supabase Integration Guide](./SUPABASE-INTEGRATION.md)
- [Getting Started](../getting-started/README.md)
- [Supabase Migrations](https://supabase.com/docs/guides/database/migrations)
- [Database Versioning](https://supabase.com/docs/guides/database/versioning)
- [Migration Best Practices](https://supabase.com/docs/guides/database/best-practices)
<!-- @links-end: resources --> 