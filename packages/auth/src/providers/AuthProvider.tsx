'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth, UseAuthProps } from '../hooks/useAuth';
import { User, Session } from '@supabase/supabase-js';
import { PlatformSlug } from '@neothink/database';

// Define the context shape with all auth data and methods
interface AuthContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;

  // Auth methods
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithOtp: (email: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  updateEmail: (email: string) => Promise<any>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps extends UseAuthProps {
  children: ReactNode;
}

/**
 * Auth Provider component that wraps the application and provides auth context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  platformSlug,
  redirectUrl,
}) => {
  // Use the auth hook to get auth state and methods
  const auth = useAuth({ platformSlug, redirectUrl });

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => auth, [auth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use the auth context in components
 * @returns Auth context with state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Higher-order component that wraps a component with the AuthProvider
 * @param Component Component to wrap
 * @param platformSlug Platform slug for authentication
 * @param redirectUrl Optional redirect URL
 * @returns Wrapped component with auth context
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  platformSlug: PlatformSlug,
  redirectUrl?: string
) {
  const WithAuthComponent = (props: P) => (
    <AuthProvider platformSlug={platformSlug} redirectUrl={redirectUrl}>
      <Component {...props} />
    </AuthProvider>
  );

  // Set display name for better debugging
  WithAuthComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;
  
  return WithAuthComponent;
}

export default AuthProvider; 