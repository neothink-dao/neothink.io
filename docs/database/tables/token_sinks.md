---
title: token_sinks Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
---

# token_sinks Table

Records where tokens are "spent" or removed from circulation (e.g., purchases, donations).

## Fields
| Column            | Type      | Constraints                | Description                        |
|-------------------|-----------|----------------------------|------------------------------------|
| id                | bigserial | PK, not null               | Unique sink identifier             |
| user_id           | uuid      | FK → users.id, not null    | User performing the sink action    |
| site              | text      |                            | Site/app where sink occurred       |
| sink_type         | text      |                            | Type of sink (purchase, etc.)      |
| token_type        | text      |                            | Token type spent                   |
| description       | text      |                            | Description of sink action         |
| simulation_run_id | text      |                            | Simulation tag (if simulation)     |
| created_at        | timestamptz| not null                  | Timestamp of sink action           |

## Example Query
```sql
select * from public.token_sinks where user_id = '...';
```

## RLS Policy Summary
- **select:** Any authenticated user
- **insert:** Authenticated users
- **update/delete:** Not allowed (append-only)

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
