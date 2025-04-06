import { useEffect, useState, useCallback, useMemo, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User, Session } from '@supabase/auth-helpers-nextjs';
import { getPlatformSlug } from '@/lib/utils/tenant-detection';

// Define the Auth Context types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  platformSlug: string;
  hasPlatformAccess: (platformSlug?: string) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Default context state
const defaultContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  platformSlug: '',
  hasPlatformAccess: () => false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  refreshSession: async () => {},
};

// Create the Auth Context
const AuthContext = createContext<AuthContextType>(defaultContext);

// Custom Error handler for auth operations
const handleAuthError = (error: any, context = {}) => {
  console.error('Auth error:', error, context);
  let message = 'An unexpected error occurred';
  
  // Customize error messages based on Supabase error codes
  if (error.message) {
    if (error.message.includes('Email not confirmed')) {
      message = 'Please verify your email before logging in';
    } else if (error.message.includes('Invalid login')) {
      message = 'Invalid email or password';
    } else if (error.message.includes('already registered')) {
      message = 'This email is already registered';
    } else {
      message = error.message;
    }
  }
  
  return new Error(message);
};

// Types for useAuth hook options
interface UseAuthOptions {
  redirectTo?: string;
  platformOverride?: string;
}

// Return type for useAuth hook
interface UseAuthReturn extends AuthContextType {}

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use Auth
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { redirectTo, platformOverride } = options;
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // Get the platform slug from the current URL
  const platformSlug = useMemo(() => 
    platformOverride || getPlatformSlug() || 'neothink', 
  [platformOverride]);
  
  // Auth state
  const [state, setState] = useState({
    user: null as User | null,
    session: null as Session | null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  // Error state
  const [error, setError] = useState<Error | null>(null);
  
  // Platform access cache to avoid repeated database calls
  const [platformAccessCache, setPlatformAccessCache] = useState<Record<string, boolean>>({});
  
  // Initialize session
  useEffect(() => {
    let mounted = true;
    
    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            session,
            user: session?.user || null,
            isAuthenticated: !!session?.user,
            isLoading: false,
          }));
          
          // If we have a session, also load platform access data
          if (session?.user) {
            await loadPlatformAccess(session.user);
          }
        }
      } catch (e) {
        console.error('Error getting initial session:', e);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    }
    
    getInitialSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setState(prev => ({
            ...prev,
            session,
            user: session?.user || null,
            isAuthenticated: !!session?.user,
            isLoading: false,
          }));
          
          // Reset platform access cache on auth changes
          setPlatformAccessCache({});
          
          // If we have a session, load platform access data
          if (session?.user) {
            await loadPlatformAccess(session.user);
          }
          
          // Handle various auth events
          switch (event) {
            case 'SIGNED_IN':
              if (redirectTo) {
                router.push(redirectTo);
              }
              break;
            case 'SIGNED_OUT':
              // Clear any cached data and redirect to home
              setPlatformAccessCache({});
              router.push('/');
              break;
            default:
              break;
          }
        }
      }
    );
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, platformSlug, redirectTo, router]);
  
  // Function to load and cache platform access data
  const loadPlatformAccess = async (user: User) => {
    try {
      // Query access for all platforms at once
      const { data, error } = await supabase.rpc('has_platform_access', { 
        platform_slug_param: platformSlug 
      });
      
      if (error) throw error;
      
      // Cache the current platform's access
      setPlatformAccessCache(prev => ({ 
        ...prev,
        [platformSlug]: !!data
      }));
      
      // Also load access for other known platforms
      const otherPlatforms = ['neothink', 'ascenders', 'neothinkers', 'immortals']
        .filter(slug => slug !== platformSlug);
      
      for (const slug of otherPlatforms) {
        const { data, error } = await supabase.rpc('has_platform_access', { 
          platform_slug_param: slug 
        });
        
        if (!error) {
          setPlatformAccessCache(prev => ({ 
            ...prev,
            [slug]: !!data
          }));
        }
      }
    } catch (err) {
      console.error('Error loading platform access:', err);
    }
  };
  
  // Check if user has access to a specific platform
  const hasPlatformAccess = useCallback((checkPlatform?: string) => {
    const platformToCheck = checkPlatform || platformSlug;
    
    // If we have a cached result, use it
    if (platformAccessCache[platformToCheck] !== undefined) {
      return platformAccessCache[platformToCheck];
    }
    
    // If no cache but we have a user, we need to check (will be updated on next render)
    if (state.user) {
      // Return true for now and let the cache get updated
      return true;
    }
    
    // No user means no access
    return false;
  }, [state.user, platformSlug, platformAccessCache]);
  
  // Refresh session information
  const refreshSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setState(prev => ({
        ...prev,
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }));
      
      // If we have a session, also load platform access data
      if (session?.user) {
        await loadPlatformAccess(session.user);
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [supabase]);
  
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
        setError(handledError);
        setState(prev => ({ ...prev, isLoading: false }));
        throw handledError;
      }
      
      setState(prev => ({
        ...prev,
        session: data.session,
        user: data.user,
        isAuthenticated: !!data.session && !!data.user,
        isLoading: false,
      }));
      
      // Load platform access data
      if (data.user) {
        await loadPlatformAccess(data.user);
      }
      
      // Redirect if specified
      if (redirectTo) {
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
  }, [supabase, platformSlug, redirectTo, router]);
  
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
            platform: platformSlug
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
        const handledError = handleAuthError(error);
        setError(handledError);
        setState(prev => ({ ...prev, isLoading: false }));
        throw handledError;
      }
      
      setState(prev => ({
        ...prev,
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }));
      
      // Clear platform access cache
      setPlatformAccessCache({});
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    }
  }, [supabase, router]);
  
  // Reset password (send reset email)
  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/update-password',
      });
      
      if (error) {
        const handledError = handleAuthError(error);
        setError(handledError);
        setState(prev => ({ ...prev, isLoading: false }));
        throw handledError;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    }
  }, [supabase]);
  
  // Update password
  const updatePassword = useCallback(async (password: string) => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        const handledError = handleAuthError(error);
        setError(handledError);
        setState(prev => ({ ...prev, isLoading: false }));
        throw handledError;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Redirect to dashboard after password update
      router.push('/dashboard');
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unexpected error occurred'));
      }
    }
  }, [supabase, router]);
  
  // Return the auth context
  return {
    ...state,
    error,
    platformSlug,
    hasPlatformAccess,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  };
}

// Hook to use the Auth Context
export const useAuthContext = () => useContext(AuthContext); 