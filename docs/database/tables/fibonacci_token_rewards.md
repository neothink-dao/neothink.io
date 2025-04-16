---
title: fibonacci_token_rewards Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
  - teams
---

# fibonacci_token_rewards Table

Tracks token rewards distributed to users based on Fibonacci-based gamification logic (e.g., streaks, achievements).

## Fields
| Column           | Type        | Constraints                | Description                         |
|------------------|-------------|----------------------------|-------------------------------------|
| id               | uuid        | PK, not null               | Unique reward identifier            |
| user_id          | uuid        | FK → users.id, not null    | User receiving the reward           |
| action_id        | uuid        |                            | Related action triggering reward    |
| team_id          | uuid        | FK → teams.id              | Team associated with the reward     |
| tokens_awarded   | numeric     |                            | Amount of tokens awarded            |
| reward_type      | text        |                            | Type of reward                     |
| simulation_run_id| text        |                            | Simulation tag (if simulation)      |
| awarded_at       | timestamptz |                            | Timestamp of reward                 |

## Example Query
```sql
select * from public.fibonacci_token_rewards where user_id = '...';
```

## RLS Policy Summary
- **select:** Authenticated users if `auth.uid() = user_id`
- **insert:** Authenticated users if `auth.uid() = user_id`
- **update/delete:** Not allowed

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
