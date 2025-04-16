---
title: xp_events Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
---

# xp_events Table

Tracks XP (experience point) related events for users, powering gamification and progression systems.

## Fields
| Column            | Type      | Constraints                | Description                        |
|-------------------|-----------|----------------------------|------------------------------------|
| id                | uuid      | PK, not null               | Unique XP event identifier         |
| user_id           | uuid      | FK → users.id, not null    | User associated with the event     |
| event_type        | text      |                            | Type of XP event                   |
| xp_amount         | numeric   |                            | Amount of XP earned                |
| metadata          | jsonb     |                            | Additional event metadata          |
| simulation_run_id | text      |                            | Simulation tag (if simulation)     |
| created_at        | timestamptz| not null                  | Timestamp of event                 |

## Example Query
```sql
select * from public.xp_events where user_id = '...';
```

## RLS Policy Summary
- **select:** Authenticated users if `auth.uid() = user_id`
- **insert:** Authenticated users if `auth.uid() = user_id`
- **update/delete:** Not allowed

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
