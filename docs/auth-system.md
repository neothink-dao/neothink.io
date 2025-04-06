# Authentication System Documentation

## Overview

The NeoThink unified authentication system provides a consistent authentication experience across all platform applications while maintaining proper separation of concerns and access control. The system supports multi-tenant authentication with different roles and permissions for each platform.

## Architecture

### Components

1. **Database Layer**
   - `profiles` table: Stores user profile information
   - `platform_access` table: Records which users have access to which platforms
   - `auth_logs` table: Audit trail for authentication events

2. **Server Layer**
   - Stored procedures and functions for managing user profiles and access
   - Row-level security policies to protect user data
   - Authorization checks via database functions

3. **Client Layer**
   - Authentication UI components (login, signup, password reset)
   - Session management via Supabase Auth
   - Auth middleware for protected routes

### Authentication Flow

1. User signs up through the platform-specific sign-up form
2. Backend creates a user in Supabase Auth
3. Trigger automatically creates a profile record and platform access record
4. Email verification is sent to the user
5. Once verified, the user can log in and access platform-specific features

## Database Schema

### Profiles Table

Stores user identity and platform access information:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_guardian BOOLEAN DEFAULT false,
  guardian_since TIMESTAMPTZ,
  platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_email_verified BOOLEAN DEFAULT false
);
```

### Platform Access Table

Records specific access levels and expiration for each platform:

```sql
CREATE TABLE public.platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  platform_slug TEXT NOT NULL,
  access_level TEXT,
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  granted_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(user_id, platform_slug)
);
```

### Auth Logs Table

Audit trail for authentication events:

```sql
CREATE TABLE public.auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  details JSONB
);
```

## Key Functions and Procedures

### `create_user_profile`

Creates a user profile during signup:

```sql
CREATE OR REPLACE PROCEDURE public.create_user_profile(
  user_id UUID,
  email TEXT,
  platform TEXT
)
```

### `has_platform_access`

Checks if a user has access to a specific platform:

```sql
CREATE OR REPLACE FUNCTION public.has_platform_access(platform_slug_param TEXT)
RETURNS BOOLEAN
```

## Frontend Components

### SignUpForm

Each platform has its own SignUpForm component that handles user registration:

```tsx
export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ...

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    // Form validation
    // Call API endpoint for signup
    // Redirect on success
  };

  // ...
}
```

### LoginForm

Handles user authentication:

```tsx
export function LoginForm({ className, ...props }: LoginFormProps) {
  // ...
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    // Authenticate user
    // Set session
    // Redirect to dashboard
  };
  // ...
}
```

### PermissionGate

Controls access to specific features based on user roles and platform access:

```tsx
export function PermissionGate({ 
  platform, 
  fallback, 
  children 
}: PermissionGateProps) {
  // Check if user has access to platform
  // Render children if access granted, fallback otherwise
}
```

## API Routes

Each platform has its own API routes for authentication:

- `/api/auth/signup` - Handles user registration
- `/api/auth/login` - Handles user login
- `/api/auth/logout` - Handles user logout
- `/api/auth/reset-password` - Handles password reset

## Usage Examples

### Protecting a Route

```tsx
// In a Next.js route file
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

### Checking Platform Access

```tsx
// In a React component
import { useAuth } from '@/lib/hooks/useAuth'

export function PlatformFeature() {
  const { user, hasPlatformAccess } = useAuth()
  
  if (!hasPlatformAccess('neothink')) {
    return <AccessDenied />
  }
  
  return <FeatureContent />
}
```

## Security Considerations

1. **Row-Level Security**: All tables have RLS policies to ensure users can only access their own data.
2. **SECURITY DEFINER Functions**: Critical functions run with elevated privileges but are securely implemented.
3. **Audit Logging**: All authentication events are logged for security auditing.
4. **Platform Isolation**: Users can only access platforms they have explicit permissions for.

## Future Improvements

1. **Social Authentication**: Add support for Google, GitHub, etc.
2. **MFA Support**: Implement multi-factor authentication.
3. **Enhanced Session Management**: Add support for managing multiple sessions.
4. **Access Control UI**: Admin interface for managing user access to platforms. 