# Using Declarative Schemas for the Neothink Roles System

This guide explains how to use Supabase's declarative schemas to manage and extend the Neothink roles system.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Adding a New Role](#adding-a-new-role)
4. [Adding Role Capabilities](#adding-role-capabilities)
5. [Generating Migrations](#generating-migrations)
6. [Syncing TypeScript Types](#syncing-typescript-types)
7. [Troubleshooting](#troubleshooting)

## Overview

We use Supabase's declarative schemas to define our database structure in a clear, centralized, and version-controlled manner. This approach makes it easier to maintain and extend our roles system.

Benefits of declarative schemas:
- **Single source of truth**: All schema definitions in one place
- **Version control**: Track changes to your schema over time
- **Automatic migrations**: Generate migration files from schema changes
- **Code review**: Easily review changes to your database schema

## Directory Structure

```
supabase/
├── schemas/
│   ├── 00_roles.sql          # Core roles tables definitions
│   ├── 01_default_roles.sql  # Default roles for each tenant
│   ├── 02_role_capabilities.sql  # Default capabilities for each role
│   └── ...                   # Other schema files
├── migrations/
│   └── ...                   # Generated migration files
└── config.toml               # Schema configuration
```

## Adding a New Role

To add a new role to the system:

1. **Edit the schema file**:

   Open `supabase/schemas/01_default_roles.sql` and add your new role:

   ```sql
   -- Add a new role for Neothinkers tenant
   insert into tenant_roles (tenant_id, name, slug, description, is_system_role, role_category, priority)
   values 
   ('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'SuperUser', 'super_user', 'Enhanced user with special privileges', false, 'member', 35);
   ```

2. **Update TypeScript types**:

   Open `lib/types/roles.ts` and add the new role to the appropriate type:

   ```typescript
   // User role types
   export type UserRoleType = 'subscriber' | 'participant' | 'contributor' | 'super_user';
   ```

3. **Generate a migration** (see [Generating Migrations](#generating-migrations) section)

## Adding Role Capabilities

To define capabilities for a new role or add capabilities to an existing role:

1. **Edit the capabilities schema file**:

   Open `supabase/schemas/02_role_capabilities.sql` and add the capabilities:

   ```sql
   -- Add capabilities for the new role
   insert into role_capabilities (tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve)
   values
   ('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'super_user', 'thought_exercises', true, true, true, true, false),
   ('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'super_user', 'concepts', true, true, true, true, false),
   ('d2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d', 'super_user', 'discussions', true, true, true, true, false);
   ```

2. **Generate a migration** (see next section)

## Generating Migrations

After making changes to the schema files, you need to generate a migration file:

1. **Stop the local Supabase instance** (if running):

   ```bash
   supabase stop
   ```

2. **Generate a migration**:

   ```bash
   supabase db diff -f add_super_user_role
   ```

   This will create a new migration file in `supabase/migrations/` with the specified name prefixed with a timestamp.

3. **Review the generated migration**:

   Verify that the migration file contains the expected changes.

4. **Start Supabase and apply the migration**:

   ```bash
   supabase start
   supabase migration up
   ```

## Syncing TypeScript Types

When adding new roles or capabilities, make sure to update the TypeScript types to keep them in sync with the database schema:

1. **Update role types**:

   ```typescript
   // lib/types/roles.ts
   export type UserRoleType = 'subscriber' | 'participant' | 'contributor' | 'super_user';
   ```

2. **Update permissions in the DefaultRolePermissions constant** (if applicable):

   ```typescript
   export const DefaultRolePermissions: Record<RoleType, {
     // ...existing properties
   }> = {
     // ...existing roles
     super_user: {
       description: 'Enhanced user with special privileges',
       canCreateContent: true,
       canEditContent: true,
       canModerateOthers: true,
       canAccessAdmin: false
     },
     // ...other roles
   };
   ```

## Troubleshooting

### Migration Generation Issues

If you encounter errors when generating migrations:

1. **Syntax issues**: Make sure your SQL is valid and follows PostgreSQL syntax.
2. **Dependencies**: Ensure that tables referenced in foreign keys exist.
3. **Duplicate inserts**: Check for duplicate inserts that might conflict with existing data.

### Database Sync Issues

If your database doesn't match your schema:

1. **Check migration order**: Ensure your schema files are being applied in the correct order in `config.toml`.
2. **Reset development database**: In development, you can reset your database:
   ```bash
   supabase db reset
   ```

### TypeScript Type Errors

If you see TypeScript errors after adding a new role:

1. **Check for missing imports**: Ensure you're importing the updated types.
2. **Update all references**: Update all places where the role types are used.
3. **Restart your TypeScript server**: Sometimes the TypeScript server needs to be restarted to pick up type changes.

## Further Reading

- [Supabase Declarative Schemas Documentation](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
- [Neothink Roles Schema Documentation](../database/ROLES_SCHEMA.md) 