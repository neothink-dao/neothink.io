# Supabase Migrations Guide

## Philosophy
This project uses timestamped, incremental migrations for all schema changes. Each file is a single source of truth for a set of related changes. Migrations are **never** edited after being applied in production—subsequent changes are made in new migrations.

## Naming Convention
- Format: `YYYYMMDDHHmmss_short_description.sql`
- Example: `20250415230635_advanced_gamification_tokenomics.sql`
- Use UTC for timestamps.

## Best Practices
- **Header Comments:** Every migration must have a header with purpose, timestamp, affected tables, and special considerations.
- **RLS:** All tables must have Row Level Security enabled and granular policies for each action and role.
- **Destructive Changes:** Clearly comment any destructive actions (drops, deletes, truncates).
- **Superseded Migrations:** If a migration is deprecated, mark it clearly at the top and do not apply it to new databases.
- **Order:** Migrations must be applied in order. Do not reorder or delete files after they are in production.

## Applying Migrations
Use the Supabase CLI or your preferred migration tool. Always run migrations in a staging environment before production.

## Deprecated Migrations
Some older migrations are retained for historical reference. They are marked as DEPRECATED and should not be applied to new databases.

## Questions?
Contact the core engineering team or open an issue in the repository.
