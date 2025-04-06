import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useSubscription } from './useSubscription';

type PlatformAccessProps = {
  requiredPlatform?: string; // If not provided, uses current platform from env
  redirectTo?: string; // Where to redirect if no access
};

/**
 * Hook for checking if the current user has access to the current platform
 * Automatically redirects unauthenticated users to login
 * Redirects users without the required platform access to the hub
 */
export function usePlatformAccess({
  requiredPlatform,
  redirectTo = process.env.NEXT_PUBLIC_HUB_URL || 'https://go.neothink.io'
}: PlatformAccessProps = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const { hasPlatformAccess, loading: subscriptionLoading } = useSubscription();
  
  // Get the current platform slug from environment or props
  const platformSlug = requiredPlatform || process.env.NEXT_PUBLIC_PLATFORM_SLUG || '';
  
  // Handle authentication redirects
  useEffect(() => {
    // Skip on the hub platform as it handles its own auth redirects
    if (platformSlug === 'hub') {
      setIsLoading(false);
      return;
    }
    
    const handleAuthChange = async (event: 'SIGNED_IN' | 'SIGNED_OUT') => {
      if (event === 'SIGNED_OUT' && router.pathname !== '/') {
        // Redirect to login page with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        await router.push(`${redirectTo}/auth/login?returnUrl=${returnUrl}`);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router, redirectTo, platformSlug]);

  // Check platform access
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      
      // Skip on hub platform (everyone can access the hub)
      if (platformSlug === 'hub') {
        setHasAccess(true);
        setIsAccessChecked(true);
        setIsLoading(false);
        return;
      }
      
      // Wait for user and subscription data to load
      if (!user || subscriptionLoading) {
        return;
      }

      // Check if the user has access to this platform
      const access = hasPlatformAccess(platformSlug);
      setHasAccess(access);
      setIsAccessChecked(true);
      setIsLoading(false);
      
      // If no access and already checked, redirect to hub
      if (!access && router.pathname !== '/no-access') {
        const returnUrl = encodeURIComponent(window.location.href);
        router.push(`${redirectTo}/subscriptions?platform=${platformSlug}&returnUrl=${returnUrl}`);
      }
    };

    checkAccess();
  }, [user, platformSlug, hasPlatformAccess, subscriptionLoading, router, redirectTo]);

  /**
   * Redirect to the hub to manage subscriptions
   */
  const redirectToHub = useCallback(async () => {
    const returnUrl = encodeURIComponent(window.location.href);
    await router.push(`${redirectTo}/subscriptions?platform=${platformSlug}&returnUrl=${returnUrl}`);
  }, [router, redirectTo, platformSlug]);

  /**
   * Request access to a platform
   */
  const requestAccess = useCallback(async () => {
    // This would typically show a dialog to upgrade or purchase access
    await redirectToHub();
  }, [redirectToHub]);

  return {
    hasAccess,
    isLoading,
    isAccessChecked,
    redirectToHub,
    requestAccess,
    user,
    platformSlug
  };
} 