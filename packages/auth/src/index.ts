// Export hooks
export { useAuth } from './hooks/useAuth';
export { useProtectedRoute } from './hooks/useProtectedRoute';

// Export components
export { default as AuthProvider, useAuthContext, withAuth } from './providers/AuthProvider';
export { LoginForm } from './components/LoginForm';

// Export middleware
export { middleware, getPlatformFromHost } from './utils/middleware'; 