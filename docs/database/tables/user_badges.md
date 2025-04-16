---
title: user_badges Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
  - badges
---

# user_badges Table

Records badges earned by users for achievements and milestones.

## Fields
| Column     | Type      | Constraints                | Description                      |
|------------|-----------|----------------------------|----------------------------------|
| id         | uuid      | PK, not null               | Unique badge assignment          |
| user_id    | uuid      | FK → users.id, not null    | User who earned the badge        |
| badge_id   | uuid      | FK → badges.id, not null   | Badge earned                     |
| earned_at  | timestamptz| not null                  | Timestamp badge was earned       |

## Example Query
```sql
select * from public.user_badges where user_id = '...';
```

## RLS Policy Summary
- **select:** Authenticated users if `auth.uid() = user_id`
- **insert:** Authenticated users if `auth.uid() = user_id`
- **update/delete:** Not allowed

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
