import { useState, useEffect, useCallback } from 'react';
import { type Session, type User, type AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClientComponent } from '../supabase/auth-client';
import { PlatformSlug } from '../supabase/auth-client';
import { handleAuthError } from '../utils/auth-error-handler';
import { getUserAccessiblePlatforms } from '../utils/platform-access';

interface UseAuthOptions {
  platformSlug?: PlatformSlug;
  redirectTo?: string;
  onAuthStateChange?: (session: Session | null, user: User | null) => void;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  platformSlug: PlatformSlug;
  accessiblePlatforms: Array<{
    slug: PlatformSlug;
    name: string;
    role: string;
  }>;
}

interface UseAuthReturn extends AuthState {
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github' | 'apple') => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  
  // Session and profile management
  refreshSession: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  
  // Error handling
  error: AuthError | Error | null;
  clearError: () => void;
}

/**
 * Authentication hook that provides all auth functionality
 * 
 * Use this hook in your component to interact with auth features:
 * 
 * ```tsx
 * const { 
 *   user, 
 *   isAuthenticated, 
 *   signIn, 
 *   signOut 
 * } = useAuth({ platformSlug: 'ascenders' });
 * ```
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const {
    platformSlug = 'hub', 
    redirectTo,
    onAuthStateChange
  } = options;
  
  const router = useRouter();
  const supabase = createClientComponent(platformSlug);
  
  // Auth state
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    platformSlug,
    accessiblePlatforms: []
  });
  
  // Error state
  const [error, setError] = useState<AuthError | Error | null>(null);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Refresh session data
  const refreshSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Get user from session
      const user = session?.user || null;
      
      // Update authentication state
      const isAuthenticated = !!session && !!user;
      
      // If user is authenticated, get profile and accessible platforms
      let profile = null;
      let accessiblePlatforms: Array<{ slug: PlatformSlug; name: string; role: string }> = [];
      
      if (isAuthenticated && user) {
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        profile = profileData;
        
        // Get accessible platforms
        accessiblePlatforms = await getUserAccessiblePlatforms(supabase);
      }
      
      // Update state
      setState({
        session,
        user,
        profile,
        isLoading: false,
        isAuthenticated,
        platformSlug,
        accessiblePlatforms
      });
      
      // Call the onAuthStateChange callback if provided
      if (onAuthStateChange) {
        onAuthStateChange(session, user);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [supabase, platformSlug, onAuthStateChange]);
  
  // Initialize auth state
  useEffect(() => {
    refreshSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        const isAuthenticated = !!session && !!user;
        
        // Update state with new session data
        setState(prev => ({
          ...prev,
          session,
          user,
          isAuthenticated,
        }));
        
        // Refresh full state to get profile and platforms
        refreshSession();
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, refreshSession]);
  
  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      // Update state with new session
      setState(prev => ({
        ...prev,
        session: data.session,
        user: data.user,
        isAuthenticated: !!data.session && !!data.user,
        isLoading: false,
      }));
      
      // Refresh to get profile and accessible platforms
      refreshSession();
      
      // Redirect if specified
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      // If the error hasn't been set already, set it
      if (!error) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unexpected error occurred'));
        }
      }
    }
  }, [supabase, platformSlug, redirectTo, router, refreshSession, error]);
  
  // Sign in with OAuth provider
  const signInWithOAuth = useCallback(async (provider: 'google' | 'github' | 'apple') => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + (redirectTo || '/dashboard'),
        },
      });
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      // OAuth redirects, so we don't need to update state
      // The auth state will be updated when the user returns
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    }
  }, [supabase, platformSlug, redirectTo]);
  
  // Sign in with magic link
  const signInWithMagicLink = useCallback(async (email: string) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + (redirectTo || '/dashboard'),
        },
      });
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Return success indicator
      return { success: true };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
      
      return { success: false };
    }
  }, [supabase, platformSlug, redirectTo]);
  
  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, metadata: any = {}) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            platform_slug: platformSlug
          },
          emailRedirectTo: window.location.origin + (redirectTo || '/auth/confirm'),
        },
      });
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      setState(prev => ({
        ...prev,
        session: data.session,
        user: data.user,
        isAuthenticated: !!data.session && !!data.user,
        isLoading: false,
      }));
      
      // Create profile
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: metadata.full_name || '',
          platforms: [platformSlug],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      
      // Refresh session
      refreshSession();
      
      // Redirect if specified and user is confirmed
      if (redirectTo && data.user?.confirmed_at) {
        router.push(redirectTo);
      }
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    }
  }, [supabase, platformSlug, redirectTo, router, refreshSession]);
  
  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      // Reset state
      setState({
        session: null,
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        platformSlug,
        accessiblePlatforms: []
      });
      
      // Redirect to login
      router.push('/auth/login');
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    }
  }, [supabase, platformSlug, router]);
  
  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/update-password',
      });
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Return success indicator
      return { success: true };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
      
      return { success: false };
    }
  }, [supabase, platformSlug]);
  
  // Update password
  const updatePassword = useCallback(async (password: string) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        const handledError = handleAuthError(error, { platform: platformSlug });
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Redirect to dashboard
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/dashboard');
      }
      
      // Return success indicator
      return { success: true };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
      
      return { success: false };
    }
  }, [supabase, platformSlug, redirectTo, router]);
  
  // Update profile
  const updateProfile = useCallback(async (data: any) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      if (!state.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);
      
      if (error) {
        setError(error);
        setState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
      
      // Refresh session to get updated profile
      await refreshSession();
      
      return { success: true };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
      
      return { success: false };
    }
  }, [supabase, state.user, refreshSession]);
  
  return {
    ...state,
    signIn,
    signInWithOAuth,
    signInWithMagicLink,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    updateProfile,
    error,
    clearError,
  };
} 