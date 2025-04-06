# Supabase Standardization

This document outlines the standardized approach for using Supabase across all Neothink sites.

## Client Implementation

We have standardized the Supabase client implementation across all sites. The implementation includes:

1. **Browser Client** (`lib/supabase/client.ts`)
   - Uses `@supabase/ssr`'s `createBrowserClient`
   - Handles client-side authentication and data fetching

2. **Server Client** (`lib/supabase/server.ts`)
   - Uses `@supabase/ssr`'s `createServerClient`
   - Handles server-side authentication and data fetching
   - Manages cookies for session persistence

3. **Middleware** (`lib/supabase/middleware.ts`)
   - Handles authentication middleware
   - Manages session cookies
   - Protects routes as needed

## Type System

We have implemented a comprehensive type system for our database schema:

1. **Generated Types** (`types/database.ts`)
   - Automatically generated from our database schema
   - Includes interfaces for all tables
   - Provides type safety across the application

2. **Platform Types**
   - Standardized platform types: 'neothink' | 'ascenders' | 'immortals' | 'neothinkers'
   - Used across all platform-specific tables

## Implementation Steps

1. **Update Dependencies**
   ```bash
   # Run the update script
   ts-node scripts/update-dependencies.ts
   ```

2. **Install New Dependencies**
   ```bash
   # In each site directory
   npm install
   ```

3. **Generate Types**
   ```bash
   # Run the type generation script
   ts-node scripts/generate-types.ts
   ```

4. **Update Client Usage**
   - Replace all instances of `@supabase/supabase-js`'s `createClient` with our standardized implementation
   - Update imports to use the new client files

## Best Practices

1. **Client Usage**
   - Always use the standardized client implementations
   - Never create Supabase clients directly
   - Use the appropriate client (browser/server) based on context

2. **Type Safety**
   - Always import and use the generated types
   - Add type annotations to all Supabase queries
   - Use TypeScript's type checking to catch errors early

3. **Authentication**
   - Use the middleware for route protection
   - Handle authentication state consistently
   - Implement proper error handling for auth failures

## Migration Guide

When migrating existing code:

1. Update imports to use the new client files
2. Replace direct Supabase client creation with our standardized implementation
3. Add type annotations to all database queries
4. Test authentication flows thoroughly
5. Verify all protected routes are working correctly

## Troubleshooting

Common issues and solutions:

1. **Authentication Errors**
   - Verify environment variables are set correctly
   - Check cookie settings in the middleware
   - Ensure proper error handling is in place

2. **Type Errors**
   - Run the type generation script
   - Verify all queries have proper type annotations
   - Check for any mismatches between database schema and types

3. **Performance Issues**
   - Use appropriate client (browser/server) for the context
   - Implement proper caching strategies
   - Monitor query performance 