# Supabase Schema Overview

This document provides a high-level overview of the database schema for the Neothink+ Platform, hosted on Supabase.

**Core Concepts:**

*   **Platforms:** The system comprises multiple distinct user-facing applications (Hub, Ascenders, Neothinkers, Immortals) sharing a common backend.
*   **Users & Authentication:** Managed by Supabase Auth (`auth.users` table) with associated profiles.
*   **Content:** Various types of content exist across platforms (modules, lessons, posts, resources, events).
*   **Gamification:** Tokens (LUCK, LIVE, LOVE, LIFE), points, achievements, streaks, and teams are used for engagement.
*   **AI Integration:** Vector embeddings are used for search and recommendations; conversations are stored.
*   **Realtime:** Used for features like chat and potentially notifications.
*   **Security & Auditing:** RLS is enforced, and various logging tables exist.

## Key Table Groups

### User & Profile Management

*   `auth.users`: Core Supabase authentication table. Stores login data, emails, etc.
*   `public.profiles`: Stores general user profile information (full name, avatar, bio, platform access flags like `is_ascender`). Linked 1:1 with `auth.users`.
*   `public.hub_profiles`, `public.ascenders_profiles`, `public.neothinkers_profiles`, `public.immortals_profiles`: Store platform-specific profile details and preferences. Linked 1:1 with `auth.users`.
*   `public.user_platform_preferences`: Tracks user preferences per platform.
*   `public.platform_access`: Manages explicit access grants for users to specific platforms.
*   `public.tenant_users`, `public.tenant_roles`, `public.permissions`, `public.role_permissions`: Likely related to multi-tenancy or advanced RBAC (details TBC).

### Content Management

*   `public.content_modules`, `public.lessons`: Structure educational content, likely for Neothinkers/Ascenders.
*   `public.resources`: General resources available on platforms.
*   `public.posts`: User-generated posts (e.g., forum, activity feed). Includes `token_tag` and visibility settings.
*   `public.post_comments`, `public.post_likes`, `public.post_reactions`: Engagement related to posts.
*   `public.shared_content`, `public.content_categories`, `public.content_tags`: Potential system for sharing/categorizing content across tenants or platforms.
*   `public.content_versions`, `public.content_workflow`, `public.content_schedule`: Suggests a CMS-like workflow for content creation and publishing.

### Social & Community

*   `public.chat_rooms`, `public.chat_participants`, `public.messages`: Realtime chat functionality. Messages include `token_tag`.
*   `public.events`, `public.event_attendees`, `public.event_registrations`: Event scheduling and participation.
*   `public.activity_feed`, `public.social_interactions`, `public.user_mentions`: Tracks user activities and social interactions.
*   `public.user_connections`: Manages relationships between users (e.g., following).
*   `public.discussion_topics`, `public.discussion_posts`: Forum-like discussion features.

### Gamification & Rewards

*   `public.token_balances`: Stores user balances for LUCK, LIVE, LOVE, LIFE tokens.
*   `public.token_transactions`: Logs changes to token balances with source information.
*   `public.achievements`, `public.user_achievements`: Defines available badges/achievements and tracks user progress.
*   `public.user_points`: Logs points awarded to users for specific actions.
*   `public.user_gamification_stats`: Aggregated stats like total points, role, streak, subscriptions.
*   `public.teams`: Allows users to form teams, tracks members and collective earnings.
*   `public.zoom_attendance`: Tracks attendance for Zoom meetings, potentially for rewards.

### AI & Search

*   `public.ai_conversations`, `public.ai_messages`: Stores history of interactions with AI assistants.
*   `public.ai_embeddings`, `public.ai_vector_documents`, `public.ai_vector_collections`: Stores vector embeddings for content, likely used for semantic search and recommendations via `pgvector`.
*   `public.search_vectors`: Older table, potentially replaced by `ai_embeddings`, used for full-text search.
*   `public.ai_suggestions`, `public.user_ai_preferences`: Manage AI-generated suggestions and user settings related to AI.
*   `public.search_analytics`, `public.popular_searches`, `public.search_suggestions`: Tracks search usage and provides suggestions.

### Platform & System

*   `public.platform_settings`, `public.feature_flags`, `public.platform_customization`: Configuration for platforms.
*   `public.notifications`, `public.notification_templates`, `public.notification_preferences`: System for sending notifications.
*   `public.feedback`: User feedback collection table (partitioned by platform).
*   `public.audit_logs`, `public.auth_logs`, `public.security_logs`, `public.security_events`, `public.suspicious_activities`, `public.login_attempts`: Various tables for logging and security monitoring.
*   `public.system_health_checks`, `public.performance_metrics`, `public.error_logs`: System monitoring tables.

### Immortals (Health) Specific

*   `public.health_integrations`: Manages connections to third-party health data providers.
*   `public.health_metrics`, `public.vital_signs`: Stores health data points synced from integrations or entered manually.
*   `public.integration_settings`, `public.data_transfer_logs`: Related to managing health data integrations.

*(Note: This is a high-level overview based on table names and relationships. Further detail requires examining specific migrations and code.)* 