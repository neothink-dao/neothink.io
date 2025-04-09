import { useState, useEffect } from 'react';
import { supabase } from '@neothink/core/database/client';
import type { Database } from '@neothink/types';
import type { User, Session } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];

type UseAuthOptions = {
  platform?: 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
  redirectTo?: string;
  redirectIfFound?: boolean;
};

/**
 * Custom hook for handling authentication
 * 
 * Features:
 * - Works across all platforms
 * - Fetches user profile data after authentication
 * - Handles sessions and tokens
 * - Compatible with RLS policies
 * 
 * @param options Configuration options
 */
export function useAuthentication(options: UseAuthOptions = {}) {
  const { platform } = options;
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`Auth event: ${event}`);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch the user's profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user profile data
      const query = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      // Add platform-specific filter if specified
      if (platform) {
        // Depending on the platform, we may need different filters
        if (platform === 'hub') {
          // No additional filters for hub
        } else if (platform === 'ascenders') {
          query.eq('is_ascender', true);
        } else if (platform === 'neothinkers') {
          query.eq('is_neothinker', true);
        } else if (platform === 'immortals') {
          query.eq('is_immortal', true);
        }
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err as Error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Check if user has access to a specific platform
  const hasPlatformAccess = (platformName: string): boolean => {
    if (!profile) return false;
    
    return (
      profile.platforms?.includes(platformName) ||
      (platformName === 'hub') || // Everyone has access to the hub
      (platformName === 'ascenders' && profile.is_ascender) ||
      (platformName === 'neothinkers' && profile.is_neothinker) ||
      (platformName === 'immortals' && profile.is_immortal)
    );
  };

  return {
    user,
    session,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    hasPlatformAccess,
    isAuthenticated: !!user,
  };
} 