---
title: team_memberships Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - teams
  - users
---

# team_memberships Table

Links users to teams, recording their membership and role within the team.

## Fields
| Column     | Type      | Constraints                | Description                  |
|------------|-----------|----------------------------|------------------------------|
| id         | uuid      | PK, not null               | Unique membership identifier |
| team_id    | uuid      | FK → teams.id, not null    | Team joined                  |
| user_id    | uuid      | FK → users.id, not null    | User who joined              |
| role       | text      |                            | Role within the team         |
| joined_at  | timestamptz| not null                  | Timestamp of joining         |

## Example Query
```sql
select * from public.team_memberships where user_id = '...';
```

## RLS Policy Summary
- **select:** Authenticated users if `auth.uid() = user_id` or team member
- **insert:** Authenticated users
- **update/delete:** Only by team creator or user

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
