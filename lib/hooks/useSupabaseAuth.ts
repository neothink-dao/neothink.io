import { useEffect, useState, useCallback } from 'react';
import { createClient, PlatformSlug } from '../supabase/client-factory';
import { Session, User } from '@supabase/supabase-js';
import { usePlatform } from './usePlatform';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for Supabase authentication that handles platform-specific session management
 */
export function useSupabaseAuth() {
  const { platformSlug } = usePlatform();
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    error: null
  });

  // Create a platform-specific client
  const getClient = useCallback(() => {
    return createClient(platformSlug);
  }, [platformSlug]);

  // Sign in with email and password
  const signInWithPassword = useCallback(async (email: string, password: string) => {
    try {
      const client = getClient();
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }, [getClient]);

  // Sign in with magic link
  const signInWithOtp = useCallback(async (email: string) => {
    try {
      const client = getClient();
      const { data, error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined
        }
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Magic link error:', error);
      return { data: null, error };
    }
  }, [getClient]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const client = getClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined
        }
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  }, [getClient]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const client = getClient();
      const { error } = await client.auth.signOut();

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }, [getClient]);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const client = getClient();
      const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/reset-password`
          : undefined
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  }, [getClient]);

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const client = getClient();
      const { data, error } = await client.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  }, [getClient]);

  // Get session and user on mount or platform change
  useEffect(() => {
    let mounted = true;
    const client = getClient();

    setAuthState(prev => ({ ...prev, loading: true }));

    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;

      if (error) {
        setAuthState({
          session: null,
          user: null,
          loading: false,
          error
        });
        return;
      }

      setAuthState({
        session,
        user: session?.user || null,
        loading: false,
        error: null
      });
    });

    // Set up auth state change listener
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setAuthState({
          session,
          user: session?.user || null,
          loading: false,
          error: null
        });
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [platformSlug, getClient]);

  return {
    ...authState,
    signInWithPassword,
    signInWithOtp,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
}

export default useSupabaseAuth; 