# Troubleshooting Guide

## Overview

This guide provides solutions for common issues across the Neothink Sites monorepo.

## Authentication Issues

### 1. Session Expiration
```typescript
// Check session status
const { data: { session }, error } = await supabase.auth.getSession()

if (error) {
  // Handle session error
  console.error('Session error:', error.message)
}

if (!session) {
  // Redirect to login
  redirect('/login')
}
```

### 2. Token Validation
```typescript
// Verify token validity
const { data: { user }, error } = await supabase.auth.getUser()

if (error) {
  // Handle token error
  console.error('Token error:', error.message)
}

if (!user) {
  // Handle missing user
  console.error('No user found')
}
```

### 3. Cookie Issues
```typescript
// Check cookie settings
const cookieOptions = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7 // 1 week
}
```

## Database Issues

### 1. Connection Errors
```typescript
// Handle connection errors
try {
  const { data, error } = await supabase
    .from('table')
    .select('*')
    
  if (error) {
    throw error
  }
} catch (error) {
  console.error('Database error:', error.message)
  // Implement retry logic
}
```

### 2. RLS Policy Issues
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'table_name';

-- Verify policy conditions
EXPLAIN ANALYZE SELECT * FROM table_name;
```

### 3. Migration Problems
```bash
# Check migration status
supabase migration list

# Reset migrations
supabase db reset

# Apply specific migration
supabase migration up <migration_name>
```

## Deployment Issues

### 1. Build Failures
```bash
# Check build logs
vercel logs <project-id>

# Clear build cache
vercel --clear-cache

# Force rebuild
vercel --force
```

### 2. Environment Variables
```typescript
// Verify environment variables
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  // Add other variables
})
```

### 3. Edge Function Errors
```typescript
// Add error handling to edge functions
export default async function handler(req: Request) {
  try {
    // Function logic
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

## Performance Issues

### 1. Slow Queries
```sql
-- Identify slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 2. Memory Leaks
```typescript
// Monitor memory usage
const used = process.memoryUsage()
console.log('Memory usage:', {
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`
})
```

### 3. API Timeouts
```typescript
// Add timeout handling
const timeout = 5000 // 5 seconds

try {
  const response = await Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
} catch (error) {
  console.error('Request timeout:', error)
}
```

## Common Error Messages

### 1. Authentication Errors
```
Error: Invalid login credentials
Solution: Verify email/password or reset password

Error: Email not confirmed
Solution: Check email for verification link

Error: Session expired
Solution: Refresh session or re-login
```

### 2. Database Errors
```
Error: relation does not exist
Solution: Check table name and migrations

Error: permission denied
Solution: Verify RLS policies and user role

Error: connection refused
Solution: Check database connection settings
```

### 3. Deployment Errors
```
Error: Build failed
Solution: Check build logs and dependencies

Error: Environment variables missing
Solution: Verify .env file and Vercel settings

Error: Function timeout
Solution: Optimize function or increase timeout
```

## Debugging Tools

### 1. Logging
```typescript
// Add debug logging
const debug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data)
  }
}
```

### 2. Monitoring
```typescript
// Add performance monitoring
const startTime = performance.now()
// Code to monitor
const endTime = performance.now()
console.log(`Execution time: ${endTime - startTime}ms`)
```

### 3. Error Tracking
```typescript
// Add error tracking
try {
  // Code that might fail
} catch (error) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context: {
      // Add relevant context
    }
  })
}
```

## Recovery Procedures

### 1. Database Recovery
```sql
-- Create backup
pg_dump -U username -d database > backup.sql

-- Restore from backup
psql -U username -d database < backup.sql
```

### 2. Deployment Rollback
```bash
# Revert to previous deployment
vercel rollback <deployment-id>

# Or redeploy specific version
vercel deploy --prod <commit-hash>
```

### 3. Cache Clearing
```typescript
// Clear various caches
const clearCaches = async () => {
  // Clear browser cache
  if (typeof window !== 'undefined') {
    window.location.reload(true)
  }
  
  // Clear API cache
  await fetch('/api/clear-cache', { method: 'POST' })
}
```

## Best Practices

1. **Prevention**
   - Regular backups
   - Monitoring and alerts
   - Automated testing
   - Documentation updates

2. **Response**
   - Quick identification
   - Clear communication
   - Systematic debugging
   - Documented solutions

3. **Recovery**
   - Backup verification
   - Gradual rollout
   - Post-mortem analysis
   - Prevention measures 