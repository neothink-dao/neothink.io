import { useState, useCallback, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PlatformSlug, PlatformState, SwitchError } from '../types';
import { PlatformSwitchService } from '../services/PlatformSwitchService';
import { useRouter } from 'next/navigation';

interface UsePlatformSwitchReturn {
  switchPlatform: (targetPlatform: PlatformSlug) => Promise<void>;
  isLoading: boolean;
  error: SwitchError | null;
  currentPlatform: PlatformSlug | null;
  switchingFrom: PlatformSlug | null;
  switchingTo: PlatformSlug | null;
}

export function usePlatformSwitch(): UsePlatformSwitchReturn {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SwitchError | null>(null);
  const [switchingFrom, setSwitchingFrom] = useState<PlatformSlug | null>(null);
  const [switchingTo, setSwitchingTo] = useState<PlatformSlug | null>(null);

  // Initialize service
  const service = PlatformSwitchService.getInstance(supabase);

  // Get current platform
  const currentPlatform = service.getCurrentPlatform();

  // Handle platform switch
  const switchPlatform = useCallback(async (targetPlatform: PlatformSlug) => {
    setIsLoading(true);
    setError(null);
    setSwitchingFrom(currentPlatform);
    setSwitchingTo(targetPlatform);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const result = await service.switchPlatform(user.id, targetPlatform, {
        preserveState: true,
        syncProgress: true
      });

      if (!result.success || result.error) {
        throw result.error || new Error('Switch failed');
      }

      // Handle successful switch
      if (result.state) {
        // Restore navigation state
        const { navigation } = result.state;
        if (navigation?.lastPath) {
          router.push(navigation.lastPath);
          if (typeof window !== 'undefined' && navigation.scrollPosition) {
            window.scrollTo(0, navigation.scrollPosition);
          }
        } else {
          // Default to platform home
          router.push(`/${targetPlatform}`);
        }
      }
    } catch (err) {
      const switchError = err as SwitchError;
      setError(switchError);
      
      // Show user-friendly error message
      if (switchError.code === 'ACCESS_DENIED') {
        // You might want to show a modal or redirect to an access request page
        router.push(`/${targetPlatform}/request-access`);
      }
    } finally {
      setIsLoading(false);
      setSwitchingFrom(null);
      setSwitchingTo(null);
    }
  }, [supabase, router, currentPlatform]);

  // Subscribe to switching state changes
  useEffect(() => {
    const interval = setInterval(() => {
      const state = service.getSwitchingState();
      setIsLoading(state.inProgress);
      setError(state.error);
      setSwitchingFrom(state.from);
      setSwitchingTo(state.to);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return {
    switchPlatform,
    isLoading,
    error,
    currentPlatform,
    switchingFrom,
    switchingTo
  };
} 