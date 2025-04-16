---
title: token_conversions Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
---

# token_conversions Table

Tracks conversions between different token types for gamification and tokenomics.

## Fields
| Column            | Type      | Constraints                | Description                              |
|-------------------|-----------|----------------------------|------------------------------------------|
| id                | bigserial | PK, not null               | Unique conversion identifier             |
| user_id           | uuid      | FK → users.id, not null    | User performing the conversion           |
| from_token        | text      | not null                   | Token type converted from                |
| to_token          | text      | not null                   | Token type converted to                  |
| amount            | numeric   | not null                   | Amount converted                         |
| rate              | numeric   |                            | Conversion rate                          |
| site              | text      |                            | Site/app where conversion occurred       |
| simulation_run_id | text      |                            | Simulation tag (if part of simulation)   |
| created_at        | timestamptz| not null                  | Timestamp of conversion                  |

## Example Query
```sql
select * from public.token_conversions where user_id = '...';
```

## RLS Policy Summary
- **select:** Any authenticated user
- **insert:** Authenticated users
- **update/delete:** Not allowed (append-only)

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
