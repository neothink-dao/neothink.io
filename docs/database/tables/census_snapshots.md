---
title: census_snapshots Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
---

# census_snapshots Table

Captures periodic snapshots of user or team activity, population, and assets for analytics and reporting.

## Fields
| Column            | Type      | Constraints                | Description                        |
|-------------------|-----------|----------------------------|------------------------------------|
| id                | uuid      | PK, not null               | Unique snapshot identifier         |
| user_id           | uuid      | FK → users.id, not null    | User (or team) for the snapshot    |
| scope             | text      |                            | Scope of the snapshot              |
| population        | integer   |                            | Population count                   |
| activity_count    | integer   |                            | Number of activities in period     |
| assets            | integer   |                            | Asset count                        |
| metadata          | jsonb     |                            | Additional metadata                |
| simulation_run_id | text      |                            | Simulation tag (if simulation)     |
| created_at        | timestamptz| not null                  | Timestamp of snapshot              |

## Example Query
```sql
select * from public.census_snapshots where user_id = '...';
```

## RLS Policy Summary
- **select:** Authenticated users if `auth.uid() = user_id`
- **insert:** Authenticated users if `auth.uid() = user_id`
- **update/delete:** Not allowed

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
