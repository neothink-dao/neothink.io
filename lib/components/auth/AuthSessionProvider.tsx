'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { createClientComponent } from '../../supabase/client-factory';
import { PlatformSlug } from '../../supabase/client-factory';
import { handleAuthError } from '../../utils/auth-error-handler';

// Context type
interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  platformSlug: PlatformSlug;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  platformSlug: 'hub',
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  error: null,
  clearError: () => {},
  refreshSession: async () => {},
});

// Props for the AuthProvider component
interface AuthSessionProviderProps {
  children: React.ReactNode;
  platformSlug: PlatformSlug;
  redirectToOnSignOut?: string;
  redirectToOnAuthError?: string;
}

/**
 * Authentication provider component
 * Manages authentication state and provides methods for auth operations
 */
export function AuthSessionProvider({
  children,
  platformSlug,
  redirectToOnSignOut = '/auth/login',
  redirectToOnAuthError = '/auth/login'
}: AuthSessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize Supabase client with the platform slug
  const supabase = createClientComponent(platformSlug);
  
  // Function to refresh session data
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const { data: { session: newSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setSession(newSession);
      setUser(newSession?.user || null);
    } catch (error: any) {
      const { message } = handleAuthError(error, { platformSlug, action: 'refreshSession' });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize auth state on mount
  useEffect(() => {
    refreshSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      setIsLoading(false);
    });
    
    // Check for return URL in query params
    const returnUrl = searchParams.get('returnUrl');
    
    // If user is signed in and there's a return URL, redirect
    if (user && returnUrl && !pathname?.includes('/auth/')) {
      router.push(returnUrl);
    }
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Handle return URL if present
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        router.push(returnUrl);
      }
    } catch (error: any) {
      const { message } = handleAuthError(error, { platformSlug, action: 'signIn', email });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback?platformSlug=${platformSlug}`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // If email confirmation is required
      if (!data.session) {
        setError('Please check your email for a confirmation link.');
      }
    } catch (error: any) {
      const { message } = handleAuthError(error, { platformSlug, action: 'signUp', email });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Redirect to sign in page
      router.push(redirectToOnSignOut);
    } catch (error: any) {
      const { message } = handleAuthError(error, { platformSlug, action: 'signOut' });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password (send reset email)
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password?platformSlug=${platformSlug}`,
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      setError('Check your email for a password reset link.');
    } catch (error: any) {
      const { message } = handleAuthError(error, { platformSlug, action: 'resetPassword', email });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update password
  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      const { message } = handleAuthError(error, { platformSlug, action: 'updatePassword' });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear error state
  const clearError = () => setError(null);
  
  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAuthenticated: !!user,
        platformSlug,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        error,
        clearError,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication in components
 * @returns Authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 