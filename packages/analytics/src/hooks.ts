import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { analytics } from './index';
import type { Platform, EventName, EventProperties } from './types';
import { useAuth } from '@neothink/core/auth/hooks';
import type { Database } from '@neothink/types/supabase';

type Tables = Database['public']['Tables'];
type AnalyticsEvent = Tables['analytics_events']['Insert'];
type Content = Tables['content']['Row'];
type Progress = Tables['progress']['Row'];
type Profile = Tables['profiles']['Row'];

/**
 * Hook to track page views
 */
export function usePageView(platform: Platform) {
  const router = useRouter();
  
  useEffect(() => {
    // Track initial page view
    analytics.page(platform, router.asPath);
    
    // Track on route change
    const handleRouteChange = (url: string) => {
      analytics.page(platform, url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, platform]);
}

/**
 * Hook to track user identification
 */
export function useIdentify() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      analytics.identify(user.id);
    } else {
      analytics.reset();
    }
  }, [user]);
}

/**
 * Hook to track content views
 */
export function useContentView(platform: Platform) {
  return async (contentId: string, metadata?: Record<string, any>) => {
    await analytics.track('content_view', {
      platform,
      contentId,
      metadata
    });
  };
}

/**
 * Hook to track progress updates
 */
export function useProgressTracker(platform: Platform) {
  return async (contentId: string, progressValue: number, metadata?: Record<string, any>) => {
    await analytics.track('progress_updated', {
      platform,
      contentId,
      progressValue,
      metadata
    });
  };
}

/**
 * Hook to track profile updates
 */
export function useProfileTracker(platform: Platform) {
  return async (metadata: Record<string, any>) => {
    await analytics.track('profile_updated', {
      platform,
      metadata
    });
  };
}

/**
 * Hook to track feedback submissions
 */
export function useFeedbackTracker(platform: Platform) {
  return async (contentId: string, metadata: Record<string, any>) => {
    await analytics.track('feedback_submitted', {
      platform,
      contentId,
      metadata
    });
  };
}

/**
 * Hook to track achievement unlocks
 */
export function useAchievementTracker(platform: Platform) {
  return async (achievementId: string, metadata?: Record<string, any>) => {
    await analytics.track('achievement_unlocked', {
      platform,
      achievementId,
      metadata
    });
  };
}

/**
 * Hook that combines page view and user identification tracking
 */
export function useAnalytics(platform: Platform) {
  usePageView(platform);
  useIdentify();
}

/**
 * Hook to track content views
 */
export function useContentTracking() {
  return {
    trackContentView: (platform: Platform, contentId: string, metadata?: Record<string, any>) => {
      analytics.track('content_view', {
        platform,
        contentId,
        metadata
      });
    }
  };
}

/**
 * Hook to track progress updates
 */
export function useProgressTracking() {
  return {
    trackProgressUpdate: (platform: Platform, progressValue: number, metadata?: Record<string, any>) => {
      analytics.track('progress_updated', {
        platform, 
        progressValue,
        metadata
      });
    }
  };
}

/**
 * Hook to track achievement unlocks
 */
export function useAchievementTracking() {
  return {
    trackAchievementUnlocked: (platform: Platform, achievementId: string, metadata?: Record<string, any>) => {
      analytics.track('achievement_unlocked', {
        platform,
        achievementId,
        metadata
      });
    }
  };
} 