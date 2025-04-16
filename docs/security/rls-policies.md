# Supabase Row Level Security (RLS) Policies

This document tracks all RLS policies implemented in the Neothink Supabase database. Keeping this up to date is critical for security audits, onboarding, and ongoing development.

## Policy Table

| Table         | Policy Name         | Action   | Policy Expression         | Purpose/Notes                |
|--------------|--------------------|----------|--------------------------|------------------------------|
| `user_profiles` | "Users can insert their own profile" | INSERT | See migration SQL or Supabase dashboard | Allows users to create their own profile record |
| `user_profiles` | "Users can read their own profile" | SELECT | See migration SQL or Supabase dashboard | Allows users to view their own profile |
| `user_profiles` | "Users can update their own profile" | UPDATE | See migration SQL or Supabase dashboard | Allows users to update their own profile |
| `profiles` | "Allow owner full access" | ALL | See migration SQL or Supabase dashboard | Owners have full access to their profile |
| `profiles` | "Guardians can manage all profiles" | ALL | See migration SQL or Supabase dashboard | Guardian role can manage all profiles |
| `profiles` | "Tenant isolation for profiles" | ALL | See migration SQL or Supabase dashboard | Ensures tenant data isolation |
| `profiles` | "Users can update their own profile" | UPDATE | See migration SQL or Supabase dashboard | Allows users to update their own profile |
| `profiles` | "Users can view basic info of users in the same platform" | SELECT | See migration SQL or Supabase dashboard | Users can view basic info of users on the same platform |
| `posts` | "Anyone can read posts" | SELECT | See migration SQL or Supabase dashboard | All users can read posts |
| `posts` | "Premium posts require premium subscription" | SELECT | See migration SQL or Supabase dashboard | Only premium users can view premium posts |
| `posts` | "Public posts are viewable by everyone" | SELECT | See migration SQL or Supabase dashboard | Public posts are accessible to all |
| `posts` | "Users can create posts based on subscription" | INSERT | See migration SQL or Supabase dashboard | Users can create posts if their subscription allows |
| `posts` | "Users can update their own posts" | UPDATE | See migration SQL or Supabase dashboard | Users can update their own posts |
| `posts` | "create_posts" | INSERT | See migration SQL or Supabase dashboard | Policy for creating posts (see dashboard for details) |
| `posts` | "delete_own_posts" | DELETE | See migration SQL or Supabase dashboard | Users can delete their own posts |
| `posts` | "insert_own_posts" | INSERT | See migration SQL or Supabase dashboard | Users can insert their own posts |
| `posts` | "read_posts" | SELECT | See migration SQL or Supabase dashboard | General read access to posts |
| `posts` | "update_own_posts" | UPDATE | See migration SQL or Supabase dashboard | Users can update their own posts |
| `posts` | "view_all_posts" | SELECT | See migration SQL or Supabase dashboard | Authenticated users can view all posts |
| `ai_configurations` | "Admin can access all AI configurations" | ALL | See migration SQL or Supabase dashboard | Admins have full access to AI configurations |
| `ai_configurations` | "Everyone can read AI configurations" | SELECT | See migration SQL or Supabase dashboard | All users can read AI configurations |
| `ai_conversations` | "Users can only see their own conversations" | ALL | See migration SQL or Supabase dashboard | Users can only access their own AI conversations |
| `ai_messages` | "Users can only see messages from their conversations" | SELECT | See migration SQL or Supabase dashboard | Users can only read messages from their own conversations |
| ...           | ...                | ...      | ...                      | ...                          |

*Add a row for each policy. See Supabase dashboard or migrations for details.*

## Example

| Table         | Policy Name         | Action   | Policy Expression         | Purpose/Notes                |
|--------------|--------------------|----------|--------------------------|------------------------------|
| `profiles`    | "Users can view their own profile" | SELECT | `auth.uid() = id` | Only allow users to view their own profile |
| `posts`       | "Users can insert posts" | INSERT | `auth.uid() = user_id` | Only allow users to create posts as themselves |

## RLS Audit & Testing Checklist
- [ ] All tables with sensitive data have RLS enabled
- [ ] No overly permissive ("allow all") policies exist
- [ ] Policies are tested with integration tests for unauthorized access
- [ ] Policy documentation is kept up to date with schema changes
- [ ] RLS policies are reviewed during code reviews and migrations

## References
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Neothink Schema Documentation](../database/schema_documentation.md) 