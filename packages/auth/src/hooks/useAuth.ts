import { useCallback, useEffect, useState } from 'react';
import { 
  Session, 
  User, 
  UserResponse, 
  AuthError,
  AuthResponse
} from '@supabase/supabase-js';
import { createClient } from '@neothink/database';
import { AuthState, PlatformSlug } from '@neothink/database/src/types/models';

/**
 * Auth hook properties
 */
export interface UseAuthProps {
  /**
   * Platform identifier
   */
  platformSlug: PlatformSlug;
  
  /**
   * Optional redirect URL after auth actions
   */
  redirectUrl?: string;
}

/**
 * Authentication hook for managing user auth state and operations
 * @param props Configuration properties
 * @returns Authentication state and methods
 */
export const useAuth = ({ platformSlug, redirectUrl }: UseAuthProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize Supabase client with the platform slug
  const supabase = createClient(platformSlug);

  /**
   * Sign in with email and password
   */
  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await supabase.auth.signInWithPassword({ email, password });
        
        if (response.error) {
          setState((prev) => ({ 
            ...prev, 
            isLoading: false, 
            error: response.error 
          }));
          return response;
        }
        
        setState({
          user: response.data.user,
          session: response.data.session,
          isLoading: false,
          isAuthenticated: !!response.data.session,
          error: null,
        });
        
        return response;
      } catch (error) {
        const authError = error as AuthError;
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error: authError 
        }));
        return { data: { user: null, session: null }, error: authError };
      }
    },
    [supabase.auth]
  );

  /**
   * Sign in with magic link
   */
  const signInWithOtp = useCallback(
    async (email: string): Promise<AuthResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await supabase.auth.signInWithOtp({ 
          email,
          options: {
            emailRedirectTo: redirectUrl,
          }
        });
        
        setState((prev) => ({ 
          ...prev, 
          isLoading: false,
          error: response.error 
        }));
        
        return response;
      } catch (error) {
        const authError = error as AuthError;
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error: authError 
        }));
        return { data: { user: null, session: null }, error: authError };
      }
    },
    [supabase.auth, redirectUrl]
  );

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              platforms: [platformSlug],
            }
          }
        });
        
        setState((prev) => ({ 
          ...prev, 
          isLoading: false,
          error: response.error 
        }));
        
        return response;
      } catch (error) {
        const authError = error as AuthError;
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error: authError 
        }));
        return { data: { user: null, session: null }, error: authError };
      }
    },
    [supabase.auth, redirectUrl, platformSlug]
  );

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error 
        }));
        return { error };
      }
      
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: authError 
      }));
      return { error: authError };
    }
  }, [supabase.auth]);

  /**
   * Reset password
   */
  const resetPassword = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error 
        }));
        
        return { error };
      } catch (error) {
        const authError = error as AuthError;
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error: authError 
        }));
        return { error: authError };
      }
    },
    [supabase.auth, redirectUrl]
  );

  /**
   * Update user password
   */
  const updatePassword = useCallback(
    async (password: string): Promise<UserResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await supabase.auth.updateUser({ password });
        
        if (response.error) {
          setState((prev) => ({ 
            ...prev, 
            isLoading: false, 
            error: response.error 
          }));
          return response;
        }
        
        setState((prev) => ({ 
          ...prev, 
          user: response.data.user,
          isLoading: false,
          error: null,
        }));
        
        return response;
      } catch (error) {
        const authError = error as AuthError;
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error: authError 
        }));
        return { data: { user: null }, error: authError };
      }
    },
    [supabase.auth]
  );

  /**
   * Update user email
   */
  const updateEmail = useCallback(
    async (email: string): Promise<UserResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await supabase.auth.updateUser({ 
          email,
          options: {
            emailRedirectTo: redirectUrl,
          }
        });
        
        setState((prev) => ({ 
          ...prev, 
          isLoading: false,
          error: response.error 
        }));
        
        return response;
      } catch (error) {
        const authError = error as AuthError;
        setState((prev) => ({ 
          ...prev, 
          isLoading: false, 
          error: authError 
        }));
        return { data: { user: null }, error: authError };
      }
    },
    [supabase.auth, redirectUrl]
  );

  // Initialize user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error,
          });
          return;
        }
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          setState({
            user: userData.user,
            session: data.session,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          error: error as Error,
        });
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const { data: userData } = await supabase.auth.getUser();
          setState({
            user: userData.user,
            session,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, platformSlug]);

  return {
    ...state,
    signInWithPassword,
    signInWithOtp,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail,
  };
};

export default useAuth;