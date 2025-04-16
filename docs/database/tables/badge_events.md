---
title: badge_events Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
  - badges
---

# badge_events Table

Tracks badge-related events for users, including earning, revoking, or updating badges.

## Fields
| Column           | Type      | Constraints                | Description                         |
|------------------|-----------|----------------------------|-------------------------------------|
| id               | uuid      | PK, not null               | Unique badge event identifier       |
| user_id          | uuid      | FK → users.id, not null    | User associated with the event      |
| badge_id         | uuid      | FK → badges.id             | Badge involved in the event         |
| event_type       | text      |                            | Type of badge event (earned, etc.)  |
| metadata         | jsonb     |                            | Extra event info                    |
| simulation_run_id| text      |                            | Simulation tag (if simulation)      |
| created_at       | timestamptz| not null                  | Timestamp of event                  |

## Example Query
```sql
select * from public.badge_events where user_id = '...';
```

## RLS Policy Summary
- **select:** Authenticated users if `auth.uid() = user_id`
- **insert:** Authenticated users if `auth.uid() = user_id`
- **update/delete:** Not allowed

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
