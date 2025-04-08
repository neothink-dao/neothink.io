# Database Functions and Security Procedures

This document provides comprehensive documentation of the database functions and security procedures implemented in the Neothink platform's Supabase backend.

## Table of Contents

- [Overview](#overview)
- [Role and Permission Functions](#role-and-permission-functions)
- [Authentication and Security Functions](#authentication-and-security-functions)
- [Platform Access Functions](#platform-access-functions)
- [Utility Functions](#utility-functions)
- [Triggers and Notifications](#triggers-and-notifications)
- [Security Best Practices](#security-best-practices)
- [Function Reference](#function-reference)

## Overview

The Neothink platform uses PostgreSQL functions extensively for security, access control, and business logic implementation. These functions provide the following benefits:

- **Security**: Functions run with defined security contexts (`SECURITY DEFINER`)
- **Consistency**: Business logic is centralized in the database
- **Performance**: Complex permission checks execute directly in the database
- **Maintainability**: Changes to security logic can be made in one place

Most functions are implemented with the `SECURITY DEFINER` attribute, which allows them to run with the privileges of the function creator rather than the caller, ensuring consistent application of security policies.

## Role and Permission Functions

### Role Checking Functions

| Function | Purpose | Returns | Security Context |
|----------|---------|---------|-----------------|
| `user_has_role` | Checks if a user has a specific role | BOOLEAN | SECURITY DEFINER |
| `user_is_admin` | Checks if a user has any admin role | BOOLEAN | SECURITY DEFINER |
| `user_has_min_role_priority` | Checks if a user has a role with minimum priority | BOOLEAN | SECURITY DEFINER |

#### `user_has_role(_user_id UUID, _role_slug TEXT, _tenant_id UUID DEFAULT NULL)`

This function checks if a user has a specific role, either in a specific tenant or across all tenants.

**Usage:**
```sql
SELECT user_has_role('123e4567-e89b-12d3-a456-426614174000', 'contributor');
-- Check in a specific tenant
SELECT user_has_role('123e4567-e89b-12d3-a456-426614174000', 'contributor', '456e4567-e89b-12d3-a456-426614174000');
```

**Implementation Details:**
- Looks up the user's role in the profiles table
- Joins with tenant_roles to get the role slug
- If tenant_id is NULL, checks across all tenants
- Otherwise, checks only in the specified tenant

#### `user_is_admin(_user_id UUID, _tenant_id UUID DEFAULT NULL)`

Checks if a user has an admin role category (associate, builder, or partner).

**Usage:**
```sql
SELECT user_is_admin('123e4567-e89b-12d3-a456-426614174000');
-- Check in a specific tenant
SELECT user_is_admin('123e4567-e89b-12d3-a456-426614174000', '456e4567-e89b-12d3-a456-426614174000');
```

**Implementation Details:**
- Looks up the user's role in the profiles table
- Joins with tenant_roles to get the role category
- Checks if the role_category is 'admin'

#### `user_has_min_role_priority(_user_id UUID, _min_priority INTEGER, _tenant_id UUID DEFAULT NULL)`

Checks if a user has a role with at least the specified priority level.

**Usage:**
```sql
-- Check if user has at least contributor level (priority 30)
SELECT user_has_min_role_priority('123e4567-e89b-12d3-a456-426614174000', 30);
```

**Implementation Details:**
- Role priorities are defined as: subscriber (10), participant (20), contributor (30), associate (40), builder (50), partner (60)
- Higher numbers indicate higher privilege levels
- Useful for checking if a user has at least a certain level of access

### Feature and Action Permission Functions

| Function | Purpose | Returns | Security Context |
|----------|---------|---------|-----------------|
| `user_can_access_feature` | Checks if a user can view a feature | BOOLEAN | SECURITY DEFINER |
| `user_can_perform_action` | Checks if a user can perform an action on a feature | BOOLEAN | SECURITY DEFINER |
| `has_permission` | Checks if a user has a specific permission | BOOLEAN | SECURITY DEFINER |

#### `user_can_access_feature(_user_id UUID, _feature_name TEXT, _tenant_id UUID DEFAULT NULL)`

Checks if a user has view access to a specific feature.

**Usage:**
```sql
SELECT user_can_access_feature('123e4567-e89b-12d3-a456-426614174000', 'discussions');
```

**Implementation Details:**
- Gets the user's role from profiles and tenant_roles
- Checks the role_capabilities table for the feature_name
- Verifies that can_view is true for the given role and feature

#### `user_can_perform_action(_user_id UUID, _feature_name TEXT, _action TEXT, _tenant_id UUID DEFAULT NULL)`

Checks if a user can perform a specific action on a feature.

**Usage:**
```sql
SELECT user_can_perform_action('123e4567-e89b-12d3-a456-426614174000', 'discussions', 'create');
```

**Implementation Details:**
- Gets the user's role from profiles and tenant_roles
- Checks the role_capabilities table for the feature_name
- Verifies that the specific action capability (can_create, can_edit, etc.) is true

#### `has_permission(_user_id UUID, _permission TEXT, _tenant_id UUID DEFAULT NULL)`

General-purpose function to check if a user has a specific permission.

**Usage:**
```sql
SELECT has_permission('123e4567-e89b-12d3-a456-426614174000', 'manage_users');
```

**Implementation Details:**
- First checks if user is a guardian (system admin) and returns true if so
- Checks user_permissions table for direct permission grants
- Checks role_permissions through tenant_roles for role-based permissions

### Data Retrieval Functions

| Function | Purpose | Returns | Security Context |
|----------|---------|---------|-----------------|
| `get_user_role` | Gets details about a user's role | TABLE | SECURITY DEFINER |
| `get_user_capabilities` | Gets all feature capabilities for a user | TABLE | SECURITY DEFINER |
| `get_user_permissions` | Gets all permissions for a user | TABLE | SECURITY DEFINER |

#### `get_user_role(_user_id UUID, _tenant_id UUID DEFAULT NULL)`

Retrieves detailed information about a user's role.

**Returns:**
- role_id: UUID
- role_name: TEXT
- role_slug: TEXT
- role_category: TEXT
- role_priority: INTEGER
- tenant_id: UUID
- tenant_name: TEXT

**Usage:**
```sql
SELECT * FROM get_user_role('123e4567-e89b-12d3-a456-426614174000');
```

#### `get_user_capabilities(_user_id UUID, _tenant_id UUID DEFAULT NULL)`

Retrieves all feature capabilities for a user.

**Returns:**
- feature_name: TEXT
- can_view: BOOLEAN
- can_create: BOOLEAN
- can_edit: BOOLEAN
- can_delete: BOOLEAN
- can_approve: BOOLEAN
- tenant_id: UUID
- tenant_name: TEXT

**Usage:**
```sql
SELECT * FROM get_user_capabilities('123e4567-e89b-12d3-a456-426614174000');
```

#### `get_user_permissions(_user_id UUID, _tenant_slug TEXT DEFAULT NULL)`

Retrieves all permissions for a user, with information about how they were granted.

**Returns:**
- permission_id: UUID
- permission_slug: TEXT
- permission_name: TEXT
- permission_description: TEXT
- permission_category: TEXT
- permission_scope: TEXT
- granted_via: TEXT

**Usage:**
```sql
SELECT * FROM get_user_permissions('123e4567-e89b-12d3-a456-426614174000');
```

## Authentication and Security Functions

### Authentication Utility Functions

| Function | Purpose | Returns | Security Context |
|----------|---------|---------|-----------------|
| `auth.current_user_id` | Gets the current authenticated user ID | UUID | STABLE |
| `log_security_event` | Records security-relevant events | VOID | SECURITY DEFINER |
| `check_suspicious_login` | Detects potentially suspicious logins | BOOLEAN | SECURITY DEFINER |
| `rate_limit_password_reset` | Prevents abuse of password reset feature | BOOLEAN | SECURITY DEFINER |

#### `auth.current_user_id()`

Gets the ID of the currently authenticated user from the JWT token.

**Usage:**
```sql
SELECT auth.current_user_id();
```

#### `log_security_event(_action TEXT, _details JSONB DEFAULT '{}'::jsonb)`

Records security-relevant events in the auth_logs table.

**Usage:**
```sql
SELECT log_security_event('password_changed', '{"method": "email", "ip": "192.168.1.1"}'::jsonb);
```

#### `check_suspicious_login(user_id UUID, ip_address TEXT)`

Detects potentially suspicious logins by comparing with previous login IP addresses.

**Usage:**
```sql
SELECT check_suspicious_login('123e4567-e89b-12d3-a456-426614174000', '192.168.1.1');
```

#### `rate_limit_password_reset(email TEXT)`

Prevents abuse of the password reset feature by limiting the number of reset requests.

**Usage:**
```sql
SELECT rate_limit_password_reset('user@example.com');
```

### Security Validation Functions

| Function | Purpose | Returns | Security Context |
|----------|---------|---------|-----------------|
| `is_trusted_email_domain` | Checks if an email domain is trusted | BOOLEAN | Normal |
| `sanitize_input` | Sanitizes user input to prevent injection | TEXT | Normal |

#### `is_trusted_email_domain(email TEXT)`

Checks if an email domain is in the list of trusted domains.

**Usage:**
```sql
SELECT is_trusted_email_domain('user@neothink.io');
```

#### `sanitize_input(input TEXT)`

Sanitizes user input to prevent injection attacks.

**Usage:**
```sql
SELECT sanitize_input('<script>alert("XSS")</script>');
```

## Platform Access Functions

### Platform Access Management

| Function | Purpose | Returns | Security Context |
|----------|---------|---------|-----------------|
| `user_has_platform_access` | Checks if a user has access to a platform | BOOLEAN | SECURITY DEFINER |
| `grant_platform_access` | Grants platform access to a user | VOID (procedure) | SECURITY DEFINER |
| `revoke_platform_access` | Revokes platform access from a user | VOID (procedure) | SECURITY DEFINER |

#### `user_has_platform_access(_user_id UUID, _platform_slug TEXT)`

Checks if a user has access to a specific platform.

**Usage:**
```sql
SELECT user_has_platform_access('123e4567-e89b-12d3-a456-426614174000', 'neothinkers');
```

#### `grant_platform_access(_user_id UUID, _platform_slug TEXT, _access_level TEXT DEFAULT 'full', _expires_at TIMESTAMPTZ DEFAULT NULL, _granted_by UUID DEFAULT NULL, _comment TEXT DEFAULT NULL)`

Grants platform access to a user.

**Usage:**
```sql
CALL grant_platform_access(
  '123e4567-e89b-12d3-a456-426614174000',
  'neothinkers',
  'full',
  NULL,
  '456e4567-e89b-12d3-a456-426614174000',
  'Approved application'
);
```

#### `revoke_platform_access(_user_id UUID, _platform_slug TEXT, _revoked_by UUID DEFAULT NULL, _comment TEXT DEFAULT NULL)`

Revokes platform access from a user.

**Usage:**
```sql
CALL revoke_platform_access(
  '123e4567-e89b-12d3-a456-426614174000',
  'neothinkers',
  '456e4567-e89b-12d3-a456-426614174000',
  'Membership expired'
);
```

## Triggers and Notifications

| Trigger | Purpose | Applied To | Implementation |
|---------|---------|------------|---------------|
| `tenant_user_audit_trigger` | Logs changes to tenant user assignments | tenant_users | log_tenant_user_changes() |
| `notify_new_notification_trigger` | Sends realtime notification when notifications are created | notifications | notify_new_notification() |

#### `tenant_user_audit_trigger`

Logs changes to tenant user assignments for audit purposes.

**Implementation:**
- Fires after INSERT, UPDATE, or DELETE on tenant_users table
- Records the change in the auth_logs table with appropriate action type
- Stores relevant details in the log record

#### `notify_new_notification_trigger`

Sends a realtime notification using PostgreSQL's pg_notify when a new notification is created.

**Implementation:**
- Fires after INSERT on notifications table
- Sends a JSON object with basic notification details through pg_notify

## Security Best Practices

The database functions implement several security best practices:

1. **Principle of Least Privilege**: Functions only expose the minimum necessary functionality
2. **Defense in Depth**: Multiple layers of permission checks
3. **SECURITY DEFINER**: Critical functions run with elevated privileges
4. **Input Validation**: Functions validate input where necessary
5. **Audit Logging**: Security-relevant actions are logged
6. **Tenant Isolation**: Multi-tenant data is properly isolated

## Function Reference

The following files contain the database function implementations:

- `supabase/migrations/20240606_role_utility_functions.sql`: Core role and permission functions
- `supabase/migrations/20240518_unified_auth_system.sql`: Authentication and platform access
- `supabase/migrations/20240606_security_enhancements.sql`: Security utilities and optimizations

For implementation details, refer to these files directly.

## Integration with Frontend

The database functions are typically accessed from the frontend through:

1. **Direct RPC Calls**: Using Supabase client's `.rpc()` method
2. **TypeScript Wrapper Functions**: In `lib/supabase/role-utils.ts`
3. **React Context Hooks**: Through `useRole()` hook in components

This layered approach ensures consistent security enforcement while providing a developer-friendly API. 