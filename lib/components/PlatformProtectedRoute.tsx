import React, { ReactNode } from 'react';
import { usePlatformAccess } from '../hooks/use-platform-access';
import { PlatformSlug } from '../supabase/auth-client';
import LoadingSpinner from './LoadingSpinner';

interface PlatformProtectedRouteProps {
  /** The platform slug to check access for */
  platform: PlatformSlug;
  
  /** Whether to redirect on access failure */
  redirectOnFailure?: boolean;
  
  /** The children to render if access is granted */
  children: ReactNode;
  
  /** Optional loading component override */
  LoadingComponent?: React.ComponentType;
  
  /** Optional failure component override */
  FailureComponent?: React.ComponentType<{ error?: Error }>;
}

/**
 * A component that renders children only if the user has access to the specified platform
 */
export default function PlatformProtectedRoute({
  platform,
  redirectOnFailure = true,
  children,
  LoadingComponent,
  FailureComponent,
}: PlatformProtectedRouteProps) {
  const { hasAccess, isLoading, error } = usePlatformAccess(platform, redirectOnFailure);
  
  // Show loading state
  if (isLoading) {
    return LoadingComponent ? <LoadingComponent /> : <LoadingSpinner />;
  }
  
  // Show error state (if not redirecting)
  if (error || !hasAccess) {
    if (!redirectOnFailure && FailureComponent) {
      return <FailureComponent error={error || undefined} />;
    }
    
    // If redirectOnFailure is true, the redirect will happen in the hook
    // This is just a fallback in case the redirect hasn't happened yet
    return <LoadingSpinner />;
  }
  
  // If access is granted, render children
  return <>{children}</>;
}

/**
 * Default loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

/**
 * Default access denied component
 */
export function AccessDenied({ error }: { error?: Error }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="mb-6">
        You don't have permission to access this platform. Please contact an administrator if you believe this is an error.
      </p>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <a
        href="/auth/login"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Go to Login
      </a>
    </div>
  );
} 