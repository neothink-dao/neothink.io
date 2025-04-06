import { useEffect, useState } from 'react';
import { createClientComponent, PlatformSlug, checkPlatformAccess, getUserProfile, UserProfile } from '../supabase/auth-client';
import { useRouter } from 'next/router';

type PlatformAccessState = {
  hasAccess: boolean;
  isLoading: boolean;
  error: Error | null;
  profile: UserProfile | null;
};

/**
 * Hook to check if the current user has access to a specified platform
 * Will redirect to access denied page if access check fails
 * 
 * @param platform The platform slug to check access for
 * @param redirectOnFailure Whether to redirect to access-denied page if access check fails
 * @returns Access state object with hasAccess, isLoading, error, and profile properties
 */
export function usePlatformAccess(
  platform: PlatformSlug,
  redirectOnFailure: boolean = true
): PlatformAccessState {
  const [state, setState] = useState<PlatformAccessState>({
    hasAccess: false,
    isLoading: true,
    error: null,
    profile: null,
  });
  
  const router = useRouter();
  
  useEffect(() => {
    let isMounted = true;
    
    const checkAccess = async () => {
      try {
        // Create client for specified platform
        const supabase = createClientComponent(platform);
        
        // Get the user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, user doesn't have access
        if (!session) {
          if (isMounted) {
            setState({
              hasAccess: false,
              isLoading: false,
              error: new Error('No active session'),
              profile: null,
            });
          }
          
          // Redirect to login if specified
          if (redirectOnFailure) {
            router.push(`/auth/login?returnUrl=${encodeURIComponent(router.asPath)}`);
          }
          return;
        }
        
        // Get user profile
        const profile = await getUserProfile(supabase);
        
        // Check platform access
        const access = await checkPlatformAccess(supabase, platform);
        
        if (isMounted) {
          setState({
            hasAccess: access,
            isLoading: false,
            error: null,
            profile,
          });
        }
        
        // Redirect if no access and redirectOnFailure is true
        if (!access && redirectOnFailure) {
          router.push('/access-denied');
        }
      } catch (error) {
        if (isMounted) {
          setState({
            hasAccess: false,
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
            profile: null,
          });
        }
        
        // Redirect on error if specified
        if (redirectOnFailure) {
          router.push('/access-denied');
        }
      }
    };
    
    checkAccess();
    
    return () => {
      isMounted = false;
    };
  }, [platform, redirectOnFailure, router]);
  
  return state;
}

/**
 * Hook to check if current user is a guardian (admin)
 * @returns Boolean indicating if user is guardian and loading state
 */
export function useIsGuardian(): { isGuardian: boolean; isLoading: boolean; profile: UserProfile | null } {
  const [state, setState] = useState({
    isGuardian: false,
    isLoading: true,
    profile: null as UserProfile | null,
  });
  
  useEffect(() => {
    let isMounted = true;
    
    const checkGuardianStatus = async () => {
      try {
        const supabase = createClientComponent();
        
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, user isn't a guardian
        if (!session) {
          if (isMounted) {
            setState({
              isGuardian: false,
              isLoading: false,
              profile: null,
            });
          }
          return;
        }
        
        // Get user profile
        const profile = await getUserProfile(supabase);
        
        if (isMounted) {
          setState({
            isGuardian: profile?.is_guardian || false,
            isLoading: false,
            profile,
          });
        }
      } catch (error) {
        console.error('Error checking guardian status:', error);
        
        if (isMounted) {
          setState({
            isGuardian: false,
            isLoading: false,
            profile: null,
          });
        }
      }
    };
    
    checkGuardianStatus();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return state;
}

/**
 * Hook to get all platforms the user has access to
 * @returns Array of platform slugs the user has access to and loading state
 */
export function useAccessiblePlatforms(): {
  platforms: PlatformSlug[];
  isLoading: boolean;
  error: Error | null;
} {
  const [state, setState] = useState({
    platforms: [] as PlatformSlug[],
    isLoading: true,
    error: null as Error | null,
  });
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchAccessiblePlatforms = async () => {
      try {
        const supabase = createClientComponent();
        
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, return empty array
        if (!session) {
          if (isMounted) {
            setState({
              platforms: [],
              isLoading: false,
              error: null,
            });
          }
          return;
        }
        
        // Get user profile
        const profile = await getUserProfile(supabase);
        
        // If user is guardian, they have access to all platforms
        if (profile?.is_guardian) {
          if (isMounted) {
            setState({
              platforms: ['hub', 'ascenders', 'neothinkers', 'immortals'],
              isLoading: false,
              error: null,
            });
          }
          return;
        }
        
        // Check access for each platform
        const accessiblePlatforms: PlatformSlug[] = [];
        
        const platformSlugs: PlatformSlug[] = ['hub', 'ascenders', 'neothinkers', 'immortals'];
        
        for (const slug of platformSlugs) {
          const hasAccess = await checkPlatformAccess(supabase, slug);
          if (hasAccess) {
            accessiblePlatforms.push(slug);
          }
        }
        
        if (isMounted) {
          setState({
            platforms: accessiblePlatforms,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error fetching accessible platforms:', error);
        
        if (isMounted) {
          setState({
            platforms: [],
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    };
    
    fetchAccessiblePlatforms();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return state;
} 