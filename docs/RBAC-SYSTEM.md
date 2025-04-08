# Role-Based Access Control (RBAC) System

## Overview

The Neothink platform implements a comprehensive Role-Based Access Control (RBAC) system to manage user permissions across multiple platforms and organizations. This document outlines the core concepts and implementation details.

## Core Components

### Roles

Roles are collections of permissions that can be assigned to users. The system supports two types of roles:

1. **Global Roles**: Assigned directly to users and apply across the entire system
2. **Organization Roles**: Assigned to users within the context of specific organizations

Each role has:
- Unique identifier
- Name and description
- Priority level (lower number = higher priority)
- Visual styling attributes (color)
- Flag indicating if it's a system-defined role

### Permissions

Permissions define specific actions that can be performed on resources. Each permission consists of:

- Action: The operation being performed (create, read, update, delete)
- Subject: The resource being acted upon (users, organizations, content, etc.)
- Conditions: Optional JSON object containing additional constraints
- Description: Human-readable explanation of the permission

### Role-Permission Relationships

Roles are linked to permissions through the `role_permissions` junction table, allowing:
- Many-to-many relationships between roles and permissions
- Flexible permission assignment and management
- Easy auditing of which roles have which permissions

## Default System Roles

The system includes the following pre-defined roles:

| Role Name | Description | Priority | Scope |
|-----------|-------------|----------|-------|
| Super Admin | Full system access | 10 | Global |
| Admin | Administrative access to platform features | 20 | Global/Organization |
| Manager | Can manage most resources but not system settings | 30 | Organization |
| Member | Standard user with basic access | 40 | Organization |
| Guest | Limited read-only access | 50 | Organization |

## Permission Structure

Permissions follow a structured format:

```
{action}:{subject}[:attribute]
```

Examples:
- `create:users` - Can create new users
- `read:organizations` - Can view organizations
- `update:content:published` - Can update published content

## Role Assignment

Users can have roles assigned in two ways:

1. **User Roles**: Direct assignment of global roles via the `user_roles` table
2. **Organization Memberships**: Assignment of organization-specific roles via the `organization_members` table

## Permission Checking

The system provides the following functions for permission checking:

- `check_user_permission(user_id, action, subject, conditions)`: Checks if a user has a specific permission
- `get_user_permissions(user_id)`: Gets all permissions a user has
- `get_user_roles(user_id)`: Gets all roles a user has (both global and organization-specific)

## Platform-Specific Access Control

The RBAC system integrates with platform access control via:

1. **Platform Access Table**: Records which platforms a user has access to
2. **Subscription-Based Access**: Automatically grants appropriate roles based on subscription status
3. **Platform-Specific Permissions**: Certain permissions only apply within specific platforms

## API Integration

The RBAC system integrates with the application API through:

1. **Authorization Middleware**: Validates permissions for API requests
2. **User Context**: Provides role and permission information to the frontend
3. **UI Adapters**: Controls UI element visibility based on permissions

## Security Considerations

The RBAC implementation follows these security principles:

1. **Least Privilege**: Users are granted the minimal permissions required
2. **Defense in Depth**: Multiple security layers (database RLS, API middleware, UI controls)
3. **Secure by Default**: Access is denied unless explicitly granted
4. **Separation of Concerns**: Role definition is separate from role assignment

## Database Implementation

The RBAC system is implemented in the following database tables:

- `roles`: Defines available roles
- `permissions`: Defines individual permissions
- `role_permissions`: Maps roles to permissions
- `user_roles`: Assigns global roles to users
- `organization_members`: Assigns organization-specific roles

## Row Level Security (RLS)

Database tables are protected with Row Level Security policies that check user permissions. This provides an additional security layer beyond application code.

## Audit and Logging

Changes to roles and permissions are tracked through:

1. **Timestamps**: All tables include created_at and updated_at fields
2. **Audit Logs**: Major permission changes are recorded in the audit log
3. **Action History**: User permission checks can be traced for security review

## Extension and Customization

The RBAC system supports customization through:

1. **Custom Roles**: Organizations can define custom roles with specific permissions
2. **Permission Conditions**: Flexible conditions allow for fine-grained access control
3. **Permission Inheritance**: Roles can be structured hierarchically 