---
title: gamification_events Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
  - token_sinks
  - token_conversions
---

# gamification_events Table

Tracks all user interactions and gamification-related events for analytics, engagement, and rewards.

## Fields
| Column             | Type      | Constraints                | Description                                     |
|--------------------|-----------|----------------------------|-------------------------------------------------|
| id                 | bigserial | PK, not null               | Unique event identifier                         |
| user_id            | uuid      | FK → users.id, not null    | User who generated the event                    |
| persona            | text      |                            | Persona type (e.g., ascender, neothinker, etc.) |
| site               | text      |                            | Site/app where event occurred                   |
| event_type         | text      |                            | Type of event (e.g., login, purchase, etc.)     |
| token_type         | text      |                            | Token involved (if any)                         |
| amount             | numeric   |                            | Amount of tokens or value                       |
| metadata           | jsonb     |                            | Additional event metadata                       |
| simulation_run_id  | text      |                            | Simulation tag (if part of a simulation)        |
| created_at         | timestamptz| not null                  | Timestamp of event creation                     |

## Example Query
```sql
select * from public.gamification_events where user_id = '...';
```

## RLS Policy Summary
- **select:** Any authenticated user
- **insert:** Authenticated users, amount >= 0
- **update/delete:** Not allowed (append-only)

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
