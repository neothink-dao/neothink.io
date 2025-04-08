# Neothink Database Schema

This document provides a comprehensive overview of the Neothink platform's database schema. The database is designed to support multiple platforms, tenant isolation, and a sophisticated role-based access control system.

## Table of Contents

- [Overview](#overview)
- [Core Tables](#core-tables)
- [Authentication and Authorization](#authentication-and-authorization)
- [Content Management](#content-management)
- [User Progress and Learning](#user-progress-and-learning)
- [Communication and Community](#communication-and-community)
- [Analytics and Reporting](#analytics-and-reporting)
- [Platform Configuration](#platform-configuration)
- [Relationships Diagram](#relationships-diagram)
- [Schema Evolution](#schema-evolution)

## Overview

The Neothink database is built on PostgreSQL using Supabase and implements:

- **Multi-tenant architecture**: Data isolation between platforms
- **Role-based access control**: Granular permissions system
- **Row-level security**: Security policies for all tables
- **Realtime capabilities**: Subscriptions for instant updates
- **Audit logging**: Tracking of system changes and security events

## Core Tables

### Users Table
- `users`: Contains user accounts registered through Supabase Auth
  - `id`: UUID primary key (from Auth.users)
  - `email`: User's email address
  - `created_at`: Timestamp when user was created
  - `updated_at`: Timestamp when user was last updated
  - `deleted_at`: Soft deletion timestamp
  - `first_name`: User's first name
  - `last_name`: User's last name
  - `full_name`: Computed column combining first and last name
  - `avatar_url`: URL to user's profile image
  - `onboarding_completed`: Boolean indicating if onboarding is complete
  - `status`: User account status

### Profiles Table
- `profiles`: Extended user profile information
  - `id`: UUID primary key (references users.id)
  - `created_at`: Timestamp when profile was created
  - `updated_at`: Timestamp when profile was last updated
  - `address_line1`: First line of address
  - `address_line2`: Second line of address
  - `city`: City
  - `state`: State/province
  - `postal_code`: Postal/ZIP code
  - `country`: Country
  - `phone`: Phone number
  - `bio`: User biography

## Organizations

### Organizations Table
- `organizations`: Represents business/group entities
  - `id`: UUID primary key
  - `created_at`: Timestamp when organization was created
  - `updated_at`: Timestamp when organization was last updated
  - `deleted_at`: Soft deletion timestamp
  - `name`: Organization name
  - `slug`: URL-friendly unique identifier
  - `description`: Organization description
  - `logo_url`: URL to organization logo
  - `website_url`: Organization website
  - `industry`: Industry category
  - `size`: Organization size (employees)
  - `status`: Organization status

### Organization Memberships
- `organization_members`: Maps users to organizations with roles
  - `id`: UUID primary key
  - `created_at`: Timestamp when membership was created
  - `updated_at`: Timestamp when membership was last updated
  - `user_id`: References users.id
  - `organization_id`: References organizations.id
  - `role_id`: References roles.id (member role in organization)
  - `status`: Membership status (active, pending, etc.)

## RBAC System

### Roles Table
- `roles`: Defines system roles
  - `id`: UUID primary key
  - `created_at`: Timestamp when role was created
  - `updated_at`: Timestamp when role was last updated
  - `name`: Role name (e.g., 'admin', 'member')
  - `description`: Role description
  - `slug`: URL-friendly unique identifier
  - `is_system_role`: Boolean indicating if this is a system-defined role
  - `color`: Display color for the role
  - `priority`: Numeric priority for role (lower has higher priority)

### Permissions Table
- `permissions`: Defines system permissions
  - `id`: UUID primary key
  - `created_at`: Timestamp when permission was created
  - `updated_at`: Timestamp when permission was last updated
  - `action`: The action being permitted (create, read, update, delete)
  - `subject`: The resource/entity being acted upon
  - `conditions`: JSON object with conditional requirements
  - `description`: Human-readable description
  - `is_system_permission`: Boolean indicating if this is a system-defined permission

### Role Permissions Table
- `role_permissions`: Maps roles to permissions
  - `id`: UUID primary key
  - `created_at`: Timestamp when mapping was created
  - `updated_at`: Timestamp when mapping was last updated
  - `role_id`: References roles.id
  - `permission_id`: References permissions.id

### User Roles Table
- `user_roles`: Assigns roles directly to users (global roles)
  - `id`: UUID primary key
  - `created_at`: Timestamp when assignment was created
  - `updated_at`: Timestamp when assignment was last updated
  - `user_id`: References users.id
  - `role_id`: References roles.id

## Subscriptions & Billing

### Subscriptions Table
- `subscriptions`: User subscription information
  - `id`: UUID primary key
  - `created_at`: Timestamp when subscription was created
  - `updated_at`: Timestamp when subscription was last updated
  - `user_id`: References users.id
  - `status`: Subscription status (active, canceled, etc.)
  - `plan_id`: The subscription plan
  - `current_period_start`: Start of current billing period
  - `current_period_end`: End of current billing period
  - `cancel_at`: When subscription is scheduled to cancel
  - `canceled_at`: When subscription was canceled
  - `ended_at`: When subscription ended
  - `trial_start`: When trial started
  - `trial_end`: When trial ends/ended
  - `provider`: Payment provider (stripe, etc.)
  - `provider_subscription_id`: ID from payment provider
  - `metadata`: JSON field for additional data

### Plans Table
- `plans`: Available subscription plans
  - `id`: UUID primary key
  - `created_at`: Timestamp when plan was created
  - `updated_at`: Timestamp when plan was last updated
  - `name`: Plan name
  - `description`: Plan description
  - `price`: Plan price in cents
  - `currency`: Price currency (USD, etc.)
  - `billing_interval`: Billing frequency (monthly, yearly)
  - `features`: JSON array of included features
  - `is_active`: Boolean indicating if plan is active
  - `provider`: Payment provider this plan exists in
  - `provider_plan_id`: ID from payment provider
  - `metadata`: JSON field for additional data

## Platform-specific Tables

### Platform Access Table
- `platform_access`: Records which platforms a user has access to
  - `id`: UUID primary key
  - `created_at`: Timestamp when access was granted
  - `updated_at`: Timestamp when access was last updated
  - `user_id`: References users.id
  - `platform`: Platform identifier (ascender, neothinker, immortal, superachiever)
  - `status`: Access status (active, revoked, etc.)
  - `access_level`: Level of access within the platform
  - `granted_at`: When access was granted
  - `expires_at`: When access expires (if applicable)

### Platform Usage Table
- `platform_usage`: Tracks user engagement with platforms
  - `id`: UUID primary key
  - `created_at`: Timestamp of the usage event
  - `user_id`: References users.id
  - `platform`: Platform identifier
  - `action`: Action performed (login, feature_used, etc.)
  - `resource`: Specific resource accessed (if applicable)
  - `metadata`: JSON field for additional data

## Database Functions & Triggers

### Role Management Functions
- `check_user_permission(user_id UUID, action TEXT, subject TEXT, conditions JSONB)`: Checks if a user has a specific permission
- `get_user_permissions(user_id UUID)`: Returns all permissions a user has
- `get_user_roles(user_id UUID)`: Returns all roles a user has

### Trigger Functions
- `handle_new_user()`: Automatically creates profile and assigns default role when new user is created
- `handle_updated_subscription()`: Updates platform access based on subscription changes
- `set_updated_at()`: Automatically updates updated_at timestamp when records are modified

## Database Indexes
- `idx_users_email`: Index on users.email
- `idx_organizations_slug`: Index on organizations.slug
- `idx_subscriptions_user_id`: Index on subscriptions.user_id
- `idx_organization_members_user_id_organization_id`: Composite index for faster lookups
- `idx_user_roles_user_id`: Index on user_roles.user_id
- `idx_role_permissions_role_id`: Index on role_permissions.role_id
- `idx_permissions_action_subject`: Composite index on permissions.action and permissions.subject
- `idx_platform_access_user_id_platform`: Composite index on platform_access.user_id and platform_access.platform

## Row Level Security (RLS) Policies
All tables implement RLS policies to restrict access based on user roles and permissions, implementing a secure-by-default database design.

## Authentication and Authorization

### Role-Based Access Control

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `tenant_roles` | Defines roles for each tenant | id, tenant_id, name, slug, priority, role_category |
| `role_capabilities` | Defines what each role can do | tenant_id, role_slug, feature_name, can_view, can_create, can_edit, can_delete, can_approve |
| `permissions` | Granular permissions definitions | id, name, slug, description, category |
| `role_permissions` | Maps roles to permissions | role_id, permission_id |
| `user_permissions` | Direct permission assignments | user_id, permission_id, tenant_id |

**Key Features:**
- Role hierarchy with priority levels
- Feature-based capability system
- Permission inheritance through roles

### Security and Audit

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `auth_logs` | Authentication and security event logs | id, user_id, action, ip_address, created_at, details |
| `audit_logs` | General system audit logs | id, user_id, table_name, record_id, action, old_data, new_data |
| `platform_access` | Platform access grants | id, user_id, platform_slug, access_level, expires_at |

**Security Implementation:**
- Row-level security policies on all tables
- SECURITY DEFINER functions for critical operations
- Audit logging for security-relevant actions

## Content Management

### Core Content Structure

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `content_modules` | Primary content containers | id, title, description, type, status, tenant_id |
| `content_versions` | Version control for content | id, content_id, version, data, status |
| `content_workflow` | Content approval workflow | id, content_id, status, assignee_id |
| `content_tags` | Content categorization | id, name, slug, tenant_id |
| `content_categories` | Hierarchical categorization | id, name, parent_id, tenant_id |

**Content Types:**
- Courses
- Thought exercises
- Learning paths
- Discussions
- Resources

### Related Content Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `courses` | Course-specific content | id, content_id, level, duration |
| `lessons` | Course lessons | id, course_id, title, order |
| `resources` | Supplementary materials | id, content_id, type, url |
| `content_dependencies` | Content prerequisites | id, content_id, dependency_id |
| `content_similarity` | Related content suggestions | id, content_id, similar_content_id, score |

**Key Features:**
- Version control
- Workflow approval process
- Content relationships and dependencies
- Tagging and categorization

## User Progress and Learning

### Progress Tracking

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `learning_progress` | Overall learning progress | id, user_id, content_id, status, completion_percentage |
| `user_concept_progress` | Progress on specific concepts | id, user_id, concept_id, proficiency_level |
| `user_exercise_progress` | Progress on exercises | id, user_id, exercise_id, completed_at, score |
| `thinking_assessments` | Thinking skill assessments | id, user_id, assessment_date, scores |

**Tracking Implementation:**
- Progressive skill development metrics
- Concept mastery tracking
- Exercise completion and scoring
- Assessment-based skill evaluation

### Learning Paths

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `learning_paths` | Structured learning journeys | id, name, description, tenant_id |
| `learning_path_items` | Items in learning paths | id, path_id, content_id, order, required |
| `user_progress` | Progress through learning paths | id, user_id, path_id, current_item_id, completed_percentage |
| `learning_recommendations` | Personalized recommendations | id, user_id, content_id, reason, score |

**Key Features:**
- Customizable learning paths
- Automated and manual recommendations
- Progress visualization
- Adaptive learning support

## Communication and Community

### Discussions and Posts

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `discussion_topics` | Discussion threads | id, title, user_id, tenant_id, created_at |
| `discussion_posts` | Individual posts | id, topic_id, user_id, content, created_at |
| `post_comments` | Comments on posts | id, post_id, user_id, content, created_at |
| `post_likes` | User likes on posts | id, post_id, user_id, created_at |

**Features:**
- Nested discussion structure
- Reaction tracking
- Community engagement metrics

### Messaging & Notifications

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `chat_rooms` | Chat room containers | id, name, type, tenant_id |
| `chat_participants` | Chat room members | id, room_id, user_id, joined_at |
| `messages` | Individual messages | id, room_id, user_id, content, created_at |
| `notifications` | User notifications | id, user_id, title, message, read, created_at |
| `notification_preferences` | Notification settings | id, user_id, type, enabled, channels |

**Implementation Details:**
- Realtime message delivery
- Notification prioritization
- Delivery channel preferences
- Read status tracking

## Analytics and Reporting

### Metrics and Reporting

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `analytics_metrics` | Raw metrics data | id, tenant_id, metric_name, value, timestamp |
| `analytics_reports` | Generated reports | id, tenant_id, name, data, created_at |
| `analytics_summaries` | Metrics summaries | id, tenant_id, period, metrics, generated_at |
| `search_analytics` | Search usage tracking | id, user_id, query, results_count, timestamp |

**Analytics Capabilities:**
- Platform usage metrics
- User engagement tracking
- Content effectiveness measurement
- Search behavior analysis

### Health and Performance

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `health_metrics` | User health data | id, user_id, metric_type, value, recorded_at |
| `health_integrations` | External health data sources | id, user_id, provider, access_token, last_sync |
| `performance_metrics` | System performance | id, service, metric, value, timestamp |
| `system_health_checks` | System health status | id, component, status, details, checked_at |

**Health Data Features:**
- Secure storage of health metrics
- External data integrations
- Performance monitoring
- System health tracking

## Platform Configuration

### Settings and Configuration

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `platform_settings` | Global and tenant settings | id, tenant_id, key, value, type |
| `platform_customization` | UI/UX customizations | id, tenant_id, theme, layout, branding |
| `feature_flags` | Feature toggles | id, name, enabled, tenant_id, conditions |
| `integration_settings` | Third-party integrations | id, tenant_id, provider, credentials, enabled |

**Configuration Features:**
- Tenant-specific settings
- Feature flag system
- White-label customization
- Integration management

## Relationships Diagram

For a visual representation of the database schema and table relationships, refer to the [Database Diagram](./database/database_diagram.md) document.

## Schema Evolution

The database schema evolves through managed migrations in the `supabase/migrations` directory. Key migrations include:

| Migration | Description | Key Tables Added |
|-----------|-------------|-----------------|
| `20240406_01_analytics_tables.sql` | Analytics foundation | analytics_metrics, analytics_reports |
| `20240406_02_notification_tables.sql` | Notification system | notifications, notification_preferences |
| `20240407_01_shared_content_tables.sql` | Shared content features | shared_content, tenant_shared_content |
| `20240408_01_content_comments_tables.sql` | Content commenting | post_comments, content_comments |
| `20240409_01_subscription_management.sql` | Subscription system | tenant_subscriptions, subscription_invoices |
| `20240518_unified_auth_system.sql` | Authentication system | auth_logs, platform_access, access_requests |
| `20240606_role_utility_functions.sql` | Role system utilities | (Functions only) |
| `20240606_security_enhancements.sql` | Security improvements | (Security features) |

For more detailed information on database functions and stored procedures, refer to the [Database Functions](./database/DATABASE_FUNCTIONS.md) document.

## Security Considerations

For details on the security implementation of the database, including row-level security policies, refer to the [Security Documentation](./security.md). 