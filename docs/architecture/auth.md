# Authentication Package Documentation

The `@neothink/auth` package provides a standardized way to handle authentication and authorization across all Neothink platforms. It includes utilities for user authentication, route protection, and UI components for login and registration.

## Installation

```bash
# This package is included in the monorepo and doesn't need to be installed separately
# For local development, make sure to build the package
pnpm --filter=@neothink/auth build
```

## Usage

### Authentication Hook

The `useAuth` hook provides authentication state and methods:

```tsx
import { useAuth } from '@neothink/auth';

function MyComponent() {
  const { 
    user, 
    session, 
    isLoading, 
    isAuthenticated, 
    error,
    signInWithPassword,
    signInWithOtp,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail
  } = useAuth({ platformSlug: 'hub' });

  // Use authentication state and methods
  const handleLogin = async () => {
    const { error } = await signInWithPassword('user@example.com', 'password');
    if (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  );
}
```

### Protected Routes

The `useProtectedRoute` hook protects routes from unauthenticated users:

```tsx
import { useProtectedRoute } from '@neothink/auth';

function ProtectedPage() {
  const { isLoading, isAuthenticated, user } = useProtectedRoute({
    platformSlug: 'ascenders',
    redirectTo: '/auth/login',
    checkPlatformAccess: true,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
}
```

### Authentication Provider

The `AuthProvider` component provides authentication context to components:

```tsx
import { AuthProvider } from '@neothink/auth';

function App() {
  return (
    <AuthProvider platformSlug="hub">
      <YourApp />
    </AuthProvider>
  );
}

// Using the higher-order component
import { withAuth } from '@neothink/auth';

function MyComponent() {
  // Component has access to auth context
}

export default withAuth(MyComponent, 'hub');
```

### Login Form Component

The `LoginForm` component provides a standard login form:

```tsx
import { LoginForm } from '@neothink/auth';

function LoginPage() {
  return (
    <LoginForm
      platformSlug="hub"
      redirectUrl="/dashboard"
      onSuccess={() => console.log('Login successful')}
    />
  );
}
```

### Middleware for Next.js

The package includes a Next.js middleware for route protection:

```ts
// middleware.ts
import { middleware } from '@neothink/auth';

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Protected Routes

### Client-Side Protection

For client-side route protection, use the `useProtectedRoute` hook:

```tsx
import { useProtectedRoute } from '@neothink/auth';

function ProtectedPage() {
  useProtectedRoute({
    platformSlug: 'hub',
    redirectTo: '/auth/login',
  });
  
  return <div>Protected content</div>;
}
```

### Server-Side Protection

For server-side route protection, use the middleware:

```ts
// middleware.ts
import { middleware } from '@neothink/auth';

export default middleware;
```

## Platform Access Control

The auth package includes utilities for checking if a user has access to a specific platform:

```tsx
import { useProtectedRoute } from '@neothink/auth';

function AscendersPage() {
  useProtectedRoute({
    platformSlug: 'ascenders',
    checkPlatformAccess: true,
  });
  
  return <div>Ascenders content</div>;
}
```

## Best Practices

1. **Context Usage**: Use the `AuthProvider` at the root of your application to provide authentication context.

2. **Protected Routes**: Use the `useProtectedRoute` hook or middleware to protect routes.

3. **Platform Access**: Check platform access for platform-specific content.

4. **Error Handling**: Handle authentication errors gracefully.

5. **Loading States**: Display loading states during authentication operations.

6. **Logout**: Always provide a way for users to sign out.

7. **Secure Storage**: Ensure secure storage of tokens (handled by the package).

## Security Considerations

1. **HTTPS**: Always use HTTPS for authentication.

2. **CSRF Protection**: The middleware includes CSRF protection.

3. **Session Expiry**: Sessions automatically expire and refresh.

4. **Rate Limiting**: The middleware includes rate limiting for sensitive operations.

5. **Error Messages**: Generic error messages prevent user enumeration.

## Examples

### Complete Login Flow

```tsx
import { useAuth } from '@neothink/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithPassword, isLoading, error } = useAuth({ platformSlug: 'hub' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signInWithPassword(email, password);
    if (!error) {
      // Redirect after successful login
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error.message}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </button>
    </form>
  );
} 