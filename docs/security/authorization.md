# Authorization

## Overview

This document describes the authorization model for the Neothink DAO project. It covers how access is controlled, the use of Supabase Row Level Security (RLS), roles, and best practices for managing permissions.

## Roles and Permissions

| Role         | Description                        | Key Permissions                |
|--------------|------------------------------------|-------------------------------|
| Admin        | Full access to all resources        | Manage users, data, settings  |
| Member       | Standard DAO participant           | View and interact with DAO    |
| Guest        | Limited, read-only access          | View public data              |
| ...          | ...                                | ...                           |

*See the Supabase dashboard or `docs/security/rls-policies.md` for detailed policy definitions.*

## Row Level Security (RLS) Policies

- RLS is enabled on all tables containing sensitive or user-specific data.
- Policies are defined and managed in the Supabase dashboard and tracked in the `supabase/migrations` directory.
- For a detailed list of policies, see [`docs/security/rls-policies.md`](./rls-policies.md).

## Requesting or Changing Permissions

- To request elevated permissions or changes to your role, open a ticket in the project's issue tracker or contact an Admin.
- All permission changes are logged and reviewed.

## Best Practices

- **Principle of Least Privilege:** Only grant the minimum permissions necessary for each role.
- **Review RLS Policies Regularly:** Ensure policies are up-to-date with the current data model and business logic.
- **Document Changes:** Update this documentation and migration files whenever policies or roles change.
- **Onboarding:** New contributors should review this document and the RLS policy documentation before making changes to authorization logic.

---

*For more details on security, see the [Security Overview](../README.md) and [RLS Policies](./rls-policies.md).* 