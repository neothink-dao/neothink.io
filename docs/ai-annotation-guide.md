# AI-Friendly Documentation Guide

This guide explains how to write documentation and code comments that are optimized for AI tools like Cursor and Grok, making it easier for them to understand our codebase and provide better assistance.

## Table of Contents

- [General Principles](#general-principles)
- [Component Documentation](#component-documentation)
- [Database Documentation](#database-documentation)
- [Function Documentation](#function-documentation)
- [Relationship Documentation](#relationship-documentation)
- [Working with AI Tools](#working-with-ai-tools)
  - [Cursor](#cursor)
  - [Grok](#grok)

## General Principles

1. **Be explicit and consistent**: Use consistent patterns that AI can easily recognize
2. **Use structured annotations**: Follow the annotation formats in this guide
3. **Establish clear relationships**: Explicitly document connections between components
4. **Include contextual information**: Add business context, not just technical details
5. **Document why, not just what**: Explain reasoning behind implementations

## Component Documentation

React components should be documented using this structure:

```tsx
/**
 * @component UserProfile
 * @description Displays and manages user profile information for Neothink platforms
 * 
 * @ai-context
 * - Handles display and editing of user information
 * - Manages profile image uploads and changes
 * - Integrates with Supabase for data storage
 * - Uses role-based access control for permissions
 * 
 * @props
 * - userId: UUID of the user
 * - editable: Boolean indicating if the profile is editable
 * - platform: Platform context (ascender/neothinker/immortal)
 * 
 * @database
 * - profiles: Main user profile data
 * - platform_access: Platform-specific permissions
 * 
 * @related
 * - components/user/ProfileImage
 * - components/user/ProfileEditor
 * - hooks/useUserProfile
 * - lib/supabase/user-queries
 * 
 * @example
 * <UserProfile 
 *   userId="123e4567-e89b-12d3-a456-426614174000"
 *   editable={true}
 *   platform="ascender"
 * />
 */
```

## Database Documentation

SQL migrations and database-related code should follow this pattern:

```sql
/**
 * @table profiles
 * @description Main user profile storage for all platforms
 * 
 * @ai-context
 * - Core user data storage linked to auth.users
 * - Contains platform access flags
 * - Stores subscription information
 * 
 * @columns
 * - id: UUID PK, references auth.users
 * - email: User's email address
 * - full_name: User's full name
 * - avatar_url: Profile picture URL
 * - is_ascender: Flag for Ascender platform access
 * - is_neothinker: Flag for Neothinker platform access
 * - is_immortal: Flag for Immortal platform access
 * - subscription_status: Current subscription state
 * 
 * @relationships
 * - auth.users: One-to-one (id)
 * - platform_access: One-to-many (id -> user_id)
 * - health_metrics: One-to-many (id -> user_id)
 * 
 * @security
 * - RLS enabled
 * - Users can read/update their own profiles
 * - Admins can read/update all profiles
 */
```

## Function Documentation

Utility functions, hooks, and other code should be documented like this:

```typescript
/**
 * @function useUserRoles
 * @description Custom hook to fetch and manage user roles across platforms
 * 
 * @ai-context
 * - Provides role information for the current user
 * - Handles platform-specific role mapping
 * - Caches role data to reduce database queries
 * - Updates automatically when roles change
 * 
 * @param {UUID} userId - The user ID to fetch roles for
 * @param {string} platform - Optional platform to filter roles
 * @returns {Object} Object containing roles data and loading state
 * 
 * @related
 * - hooks/useAuth
 * - lib/rbac/role-utils
 * - contexts/RoleContext
 * 
 * @example
 * const { roles, isAdmin, isLoading } = useUserRoles(userId, 'ascender');
 */
```

## Relationship Documentation

When establishing relationships between components, use these patterns:

```typescript
/**
 * @relationship Content -> Comments
 * @description One-to-many relationship between content and comments
 * 
 * @ai-context
 * - Content can have multiple comments
 * - Comments belong to a single content item
 * - Deletion of content cascades to comments
 * 
 * @implementation
 * - Foreign key from comments.content_id to content.id
 * - Cascade delete enabled
 * - Bi-directional loading implemented in data hooks
 */
```

## Working with AI Tools

### Cursor

When working with Cursor, use these strategies:

1. **Clear questions**: "What does the UserProfile component do and how does it relate to ProfileImage?"
2. **Component analysis**: "Analyze the relationship between the profiles table and platform_access"
3. **Feature exploration**: "How is authentication implemented across the platforms?"
4. **Implementation guidance**: "How should I implement role-based access in the new AdminDashboard component?"

### Grok

For Grok's DeepSearch mode:

1. **Repository exploration**: Provide the repo link and use "DeepSearch: Map all components related to user authentication"
2. **Architectural analysis**: "DeepSearch: Analyze the database schema and relationships in the Neothink platforms codebase"
3. **Implementation patterns**: "DeepSearch: Identify all implementations of role-based access control across the codebase"
4. **Feature cohesion**: "DeepSearch: Show me how the analytics system is implemented across all platforms"

### Prompt Templates

**For Cursor:**
```
I'm working with the [component/feature]. Can you:
1. Explain how it relates to [other component/feature]?
2. Show me the key dependencies and data flow?
3. Help me understand how to implement [new feature] following our patterns?
```

**For Grok DeepSearch:**
```
DeepSearch: https://github.com/your-org/neothink-platforms

I need to understand:
1. How [feature] is implemented across platforms
2. The data flow between [component] and [database tables]
3. The architectural patterns used for [functionality]
4. How to implement [new feature] consistently with existing patterns
``` 