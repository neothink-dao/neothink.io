# Supabase Schema & ER Diagram

This directory contains the full schema (DDL) export and a visual Entity-Relationship (ER) diagram for the Neothink ecosystem database, shared by all 4 sites/apps.

## Files
- `schema.sql`: The authoritative SQL DDL for all tables, relationships, indexes, and policies in the `public` and `auth` schemas.
- `er_diagram.dbml`: Editable DBML source for the ER diagram (import to [dbdiagram.io](https://dbdiagram.io) for instant visualization).
- `er_diagram.svg`: Visual ER diagram (exported from dbdiagram.io or similar).

## How to Update
1. Run the schema export command after any migration:
   ```sh
   npx supabase db dump --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.dlmpxgzxdtqxyzsmpaxx.supabase.co:5432/postgres" --schema public --schema auth --file supabase/schema/schema.sql
   ```
2. Paste the contents of `schema.sql` into [dbdiagram.io](https://dbdiagram.io) to update the ER diagram, then export as SVG and DBML.

## Why This Matters
- Guarantees your codebase always mirrors the database.
- Enables fast onboarding, code review, and analytics development.
- Surfaces all relationships, constraints, and policies for security and debugging.
