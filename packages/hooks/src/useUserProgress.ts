import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createClient } from '@neothink/core';

// Types for our user progress hook
export type PlatformType = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
export type FeatureStatus = 'unlocked' | 'locked' | 'hidden';
export type UnlockedFeatures = Record<string, boolean>;

export interface UserProgressData {
  id: string;
  user_id: string;
  platform: PlatformType;
  week_number: number;
  unlocked_features: UnlockedFeatures;
  last_updated: string;
}

export interface UseUserProgressReturn {
  isLoading: boolean;
  error: Error | null;
  userProgress: UserProgressData | null;
  weekNumber: number;
  checkFeatureStatus: (featureName: string) => FeatureStatus;
  unlockFeature: (featureName: string) => Promise<boolean>;
  advanceWeek: () => Promise<boolean>;
  refreshProgress: () => Promise<void>;
}

/**
 * Hook to manage user progress and feature unlocking
 * @param platform - The platform to check progress for
 * @returns User progress data and helper functions
 * 
 * @example
 * ```tsx
 * // See DEVELOPMENT.md for more details on user progress
 * const { checkFeatureStatus, weekNumber } = useUserProgress('hub');
 * const onboardStatus = checkFeatureStatus('onboard');
 * 
 * if (onboardStatus === 'unlocked') {
 *   return <OnboardContent />;
 * } else if (onboardStatus === 'locked') {
 *   return <LockedFeatureTeaser feature="onboard" />;
 * } else {
 *   return null; // Hidden feature
 * }
 * ```
 */
export function useUserProgress(platform: PlatformType): UseUserProgressReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgressData | null>(null);
  
  const supabase = useSupabaseClient();
  const client = createClient(supabase);
  const user = useUser();

  const fetchUserProgress = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .single();
      
      if (error) throw error;
      
      setUserProgress(data as UserProgressData);
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProgress();
  }, [user, platform]);

  const checkFeatureStatus = (featureName: string): FeatureStatus => {
    if (!userProgress) return 'hidden';
    
    // Special logic for each platform
    if (platform === 'hub') {
      // Hub logic: discover is always unlocked, onboard in week 2, progress in week 3, endgame in week 4
      if (featureName === 'discover') return 'unlocked';
      if (featureName === 'onboard') return userProgress.week_number >= 2 ? 'unlocked' : 'locked';
      if (featureName === 'progress') return userProgress.week_number >= 3 ? 'unlocked' : 'hidden';
      if (featureName === 'endgame') return userProgress.week_number >= 4 ? 'unlocked' : 'hidden';
    } 
    else if (platform === 'neothinkers') {
      // Neothinkers logic: only revolution is unlocked initially
      if (featureName === 'revolution') return 'unlocked';
      if (['fellowship', 'curriculum', 'council'].includes(featureName)) {
        return userProgress.week_number >= 2 ? 'unlocked' : 'locked';
      }
    }
    
    // For other platforms or generic features, check the unlocked_features object
    return userProgress.unlocked_features[featureName] ? 'unlocked' : 'locked';
  };

  const unlockFeature = async (featureName: string): Promise<boolean> => {
    if (!user || !userProgress) return false;
    
    try {
      // Call the Supabase function to update user progress
      const { data, error } = await supabase.rpc('update_user_progress', {
        p_user_id: user.id,
        p_platform: platform,
        p_feature: featureName,
        p_unlock: true
      });
      
      if (error) throw error;
      
      // Update local state
      await fetchUserProgress();
      return true;
    } catch (err) {
      console.error('Error unlocking feature:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const advanceWeek = async (): Promise<boolean> => {
    if (!user || !userProgress) return false;
    
    try {
      // Call the Supabase function to advance the week
      const { data, error } = await supabase.rpc('advance_user_week', {
        p_user_id: user.id,
        p_platform: platform
      });
      
      if (error) throw error;
      
      // Update local state
      await fetchUserProgress();
      return true;
    } catch (err) {
      console.error('Error advancing week:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const refreshProgress = async (): Promise<void> => {
    await fetchUserProgress();
  };

  return {
    isLoading,
    error,
    userProgress,
    weekNumber: userProgress?.week_number || 1,
    checkFeatureStatus,
    unlockFeature,
    advanceWeek,
    refreshProgress
  };
} 