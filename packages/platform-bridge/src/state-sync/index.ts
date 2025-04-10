import { createClient } from '@supabase/supabase-js';
import { PlatformSlug, PlatformState } from '../types';

/**
 * Service for managing cross-platform state synchronization
 */
export class StateSyncService {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  /**
   * Save platform state for a user
   * @param userId User ID
   * @param platform Current platform
   * @param state State to save
   * @returns Success status
   */
  static async savePlatformState(
    userId: string,
    platform: PlatformSlug,
    state: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get current state
      const currentState = await this.getPlatformState(userId);
      
      // Update the state for the specific platform
      const updatedState = {
        ...currentState,
        currentPlatform: platform,
        lastVisited: {
          ...currentState.lastVisited,
          [platform]: new Date().toISOString()
        },
        // Update platform-specific state
        [platform]: {
          ...currentState[platform],
          ...state
        }
      };
      
      // Save to Supabase
      const { error } = await this.supabase
        .from('user_platform_state')
        .upsert({
          user_id: userId,
          state: updatedState,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local cache
      this.updateLocalStateCache(userId, updatedState);
      
      return true;
    } catch (error) {
      console.error('Failed to save platform state:', error);
      return false;
    }
  }
  
  /**
   * Get platform state for a user
   * @param userId User ID
   * @returns Platform state
   */
  static async getPlatformState(userId: string): Promise<PlatformState> {
    try {
      // Check local cache first for better performance
      const cachedState = this.getStateFromCache(userId);
      if (cachedState) return cachedState;
      
      // If not in cache, fetch from Supabase
      const { data, error } = await this.supabase
        .from('user_platform_state')
        .select('state')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      // If found, update cache and return
      if (data?.state) {
        this.updateLocalStateCache(userId, data.state);
        return data.state;
      }
      
      // Return default state if not found
      return this.getDefaultState();
    } catch (error) {
      console.error('Failed to get platform state:', error);
      return this.getDefaultState();
    }
  }
  
  /**
   * Get initial state for a specific platform
   * @param userId User ID
   * @param platform Platform slug
   * @returns Platform-specific state
   */
  static async getInitialPlatformState(
    userId: string,
    platform: PlatformSlug
  ): Promise<Record<string, any>> {
    try {
      const state = await this.getPlatformState(userId);
      
      // Update current platform and last visited
      await this.savePlatformState(userId, platform, {});
      
      // Return platform-specific state
      return state[platform] || {};
    } catch (error) {
      console.error(`Failed to get initial state for ${platform}:`, error);
      return {};
    }
  }
  
  /**
   * Transfer state from one platform to another
   * @param userId User ID
   * @param fromPlatform Source platform
   * @param toPlatform Target platform
   * @param stateKeys Keys to transfer (default: all keys)
   * @returns Success status
   */
  static async transferState(
    userId: string,
    fromPlatform: PlatformSlug,
    toPlatform: PlatformSlug,
    stateKeys?: string[]
  ): Promise<boolean> {
    try {
      const state = await this.getPlatformState(userId);
      
      // Get source state
      const sourceState = state[fromPlatform] || {};
      
      // Get target state
      const targetState = state[toPlatform] || {};
      
      // Create new state with transferred keys
      const newState: Record<string, any> = { ...targetState };
      
      // Transfer all or specific keys
      if (stateKeys) {
        stateKeys.forEach(key => {
          if (sourceState[key] !== undefined) {
            newState[key] = sourceState[key];
          }
        });
      } else {
        Object.assign(newState, sourceState);
      }
      
      // Save updated state
      return this.savePlatformState(userId, toPlatform, newState);
    } catch (error) {
      console.error('Failed to transfer state:', error);
      return false;
    }
  }
  
  /**
   * Get default platform state
   * @returns Default platform state
   */
  private static getDefaultState(): PlatformState {
    return {
      currentPlatform: 'hub',
      lastVisited: {
        hub: null,
        immortals: null,
        ascenders: null,
        neothinkers: null
      },
      preferences: {
        hub: {
          theme: 'system',
          notifications: true,
          emailDigest: 'weekly',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          accessibility: {
            reduceMotion: false,
            highContrast: false,
            largeText: false
          }
        },
        immortals: {
          theme: 'system',
          notifications: true,
          emailDigest: 'weekly',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          accessibility: {
            reduceMotion: false,
            highContrast: false,
            largeText: false
          }
        },
        ascenders: {
          theme: 'system',
          notifications: true,
          emailDigest: 'weekly',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          accessibility: {
            reduceMotion: false,
            highContrast: false,
            largeText: false
          }
        },
        neothinkers: {
          theme: 'system',
          notifications: true,
          emailDigest: 'weekly',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          accessibility: {
            reduceMotion: false,
            highContrast: false,
            largeText: false
          }
        }
      },
      recentItems: {
        hub: [],
        immortals: [],
        ascenders: [],
        neothinkers: []
      },
      userProfile: {
        hub: {},
        immortals: {},
        ascenders: {},
        neothinkers: {}
      }
    };
  }
  
  /**
   * Update local state cache
   * @param userId User ID
   * @param state Platform state
   */
  private static updateLocalStateCache(userId: string, state: PlatformState): void {
    try {
      localStorage.setItem(`neothink_state_${userId}`, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to update local state cache:', error);
    }
  }
  
  /**
   * Get state from local cache
   * @param userId User ID
   * @returns Cached state or null
   */
  private static getStateFromCache(userId: string): PlatformState | null {
    try {
      const cachedState = localStorage.getItem(`neothink_state_${userId}`);
      return cachedState ? JSON.parse(cachedState) : null;
    } catch (error) {
      console.error('Failed to get state from cache:', error);
      return null;
    }
  }
  
  /**
   * Clear state for a user
   * @param userId User ID
   * @returns Success status
   */
  static async clearState(userId: string): Promise<boolean> {
    try {
      // Remove from Supabase
      const { error } = await this.supabase
        .from('user_platform_state')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Clear local cache
      localStorage.removeItem(`neothink_state_${userId}`);
      
      return true;
    } catch (error) {
      console.error('Failed to clear state:', error);
      return false;
    }
  }
}

export default StateSyncService; 