---
title: teams Table
last_updated: 2025-04-15
owner: Neothink DAO
related_tables:
  - users
  - team_memberships
---

# teams Table

Represents collaborative teams within the platform, including governance and mission.

## Fields
| Column            | Type      | Constraints                | Description                       |
|-------------------|-----------|----------------------------|-----------------------------------|
| id                | uuid      | PK, not null               | Unique team identifier            |
| name              | text      | not null                   | Team name                         |
| description       | text      |                            | Team description                  |
| created_by        | uuid      | FK → users.id              | User who created the team         |
| governance_model  | text      |                            | Governance model description      |
| mission           | text      |                            | Team mission                      |
| admission_criteria| text      |                            | Criteria for joining              |
| virtual_capital   | text      |                            | Virtual capital managed by team   |
| physical_footprint| jsonb     |                            | Physical presence info            |
| census_data       | jsonb     |                            | Team census/analytics             |
| created_at        | timestamptz| not null                  | Timestamp of team creation        |

## Example Query
```sql
select * from public.teams where id = '...';
```

## RLS Policy Summary
- **select:** Any authenticated user
- **insert:** Authenticated users
- **update/delete:** Only by team creator (`created_by = auth.uid()`)

## Related Docs
- [Database Schema](../schema_documentation.md)
- [ER Diagram](../database_diagram.md)
- [RLS Policy Documentation](../../security/authorization.md)
