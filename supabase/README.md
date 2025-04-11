# Supabase Database Schema for Neothink Platform

This directory contains database schema migrations and utilities for the Neothink platform's Supabase instance, optimized for AI integrations and scalability across four Next.js applications: `hub`, `ascenders`, `immortals`, and `neothinkers`.

## Schema Overview

The database schema has been architected with the following design principles:
- **Performance**: Optimized indexes and query patterns
- **Security**: Fine-grained RLS policies for data access control
- **Scalability**: Support for high volume through table partitioning and application sharding
- **Real-time**: Support for live data subscriptions through Supabase Realtime

### Core Tables

1. **feedback**
   - Stores user feedback across all platforms
   - Includes sentiment analysis capabilities
   - Status tracking for workflow management ('pending', 'processing', 'processed', 'archived')
   - Partitioned by app_name for query optimization
   - Comprehensive indexing for performance
   - Extended with metadata JSON for flexible attributes

2. **chat_history**
   - Records AI chatbot interactions for all users
   - Supports conversation history across platforms
   - Indexed for performance with high volume
   - Tracking of tokens used for cost monitoring
   - Conversation context management for coherent AI responses

3. **auth.users** (extended)
   - Extended with custom metadata:
     - `role` ('user', 'admin')
     - `app_subscriptions` (array of app access rights)
   - Extended profiles for personalized AI interactions

## Row-Level Security Policies

Each table implements granular RLS policies:

- **Admins**: Full read access to all tables, write access to their own records
- **Users**: Read/write access only to their own data
- **Anonymous**: No access to sensitive data, limited read access to public data

## Indexing Strategy

Optimized indexes have been configured for common query patterns:

- **Composite indexes** for combined filtering (e.g., app_name + user_id)
- **Partial indexes** for specific status values
- **Text search indexes** for content searching
- **Expression indexes** for computed values

## Realtime Subscriptions

The schema supports real-time updates through Supabase Realtime. Example subscription patterns:

- Chat updates for real-time conversation
- Feedback status changes for admin dashboards
- User activity monitoring

## Scalability Considerations

For high-volume scenarios, several scaling strategies are implemented:

1. **Table Partitioning**: The feedback table is partitioned by app_name
2. **Application-level Sharding**: Utilities for distributed querying when data exceeds Supabase limits
3. **Query Optimization**: Efficient use of indexes and proper filtering
4. **Declarative Schemas**: For easier maintenance and evolution

## Extensions

The following Postgres extensions are enabled:

- **uuid-ossp**: For UUID generation
- **pg_stat_statements**: For query performance monitoring
- **pg_trgm**: For text search optimization
- **plv8**: For JavaScript stored procedures (optional)

## How to Apply Migrations

Apply migrations using the Supabase MCP server or CLI:

```bash
# Using Supabase CLI (local development)
supabase migration up

# In production, migrations are applied through the MCP server
```

## Implementation Examples

The codebase includes working examples of:

1. **Real-time chat subscriptions** at `apps/hub/lib/supabase/chat-subscription.ts`
2. **Feedback management dashboard** at `apps/hub/lib/supabase/feedback-subscription.ts`
3. **Application-level sharding utilities** at `apps/shared/utils/database-sharding.ts`

## Best Practices

- Use the declarative schema format for all migrations
- Add comments to tables and columns for better documentation
- Apply RLS policies to all tables
- Test performance with representative data volumes
- Monitor query performance using pg_stat_statements

## Maintenance and Monitoring

For monitoring database performance:

1. **Query analyzer**: Review slow queries regularly
2. **Table statistics**: Monitor table sizes and growth
3. **Connection pooling**: Configure appropriately as app scales
4. **Backups**: Ensure regular backups are configured

## Helper Functions

- **set_user_role**: Update a user's role
- **update_user_app_subscriptions**: Manage app subscriptions
- **analyze_sentiment**: Placeholder for sentiment analysis
- **summarize_feedback**: Generate feedback reports for admins

## Future Enhancements

Potential improvements:
- Add pgvector extension for AI embeddings
- Create Content table for AI-generated content
- Add analytics functions for cross-platform insights 

1. **Database migrations** in `supabase/migrations`
2. **Database types** in `packages/database-types` 