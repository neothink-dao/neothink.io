import { createClient } from '@supabase/supabase-js';
import { PlatformSlug, PlatformState, PlatformStateEntity } from '../types';
import { DEFAULT_PREFERENCES, DB_TABLES, STORAGE_KEYS, TIME_CONFIG } from '../constants';

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
    state: Record<string, unknown>
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
        .from(DB_TABLES.STATE)
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
        .from(DB_TABLES.STATE)
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
  ): Promise<Record<string, unknown>> {
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
      const newState: Record<string, unknown> = { ...targetState };
      
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
      hub: {},
      immortals: {},
      ascenders: {},
      neothinkers: {},
      currentPlatform: 'hub',
      lastVisited: {
        hub: null,
        immortals: null,
        ascenders: null,
        neothinkers: null
      },
      preferences: {
        hub: DEFAULT_PREFERENCES,
        immortals: DEFAULT_PREFERENCES,
        ascenders: DEFAULT_PREFERENCES,
        neothinkers: DEFAULT_PREFERENCES
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
      const stateWithMeta = {
        ...state,
        cachedAt: Date.now()
      };
      localStorage.setItem(`${STORAGE_KEYS.STATE}${userId}`, JSON.stringify(stateWithMeta));
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
      const cachedData = localStorage.getItem(`${STORAGE_KEYS.STATE}${userId}`);
      if (!cachedData) return null;
      
      const parsedData = JSON.parse(cachedData);
      
      // If no timestamp or cache is expired, return null
      if (!parsedData.cachedAt) return null;
      
      const cacheAge = Date.now() - parsedData.cachedAt;
      if (cacheAge > TIME_CONFIG.STATE_CACHE_TTL) return null;
      
      // Remove cache metadata before returning
      const { cachedAt, ...state } = parsedData;
      return state;
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
        .from(DB_TABLES.STATE)
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Clear local cache
      localStorage.removeItem(`${STORAGE_KEYS.STATE}${userId}`);
      
      return true;
    } catch (error) {
      console.error('Failed to clear state:', error);
      return false;
    }
  }
  
  /**
   * Add item to recent items
   * @param userId User ID
   * @param platform Current platform
   * @param itemId Item ID to add
   * @param maxItems Maximum number of items to keep (default: 10)
   * @returns Success status
   */
  static async addRecentItem(
    userId: string,
    platform: PlatformSlug,
    itemId: string,
    maxItems: number = 10
  ): Promise<boolean> {
    try {
      const state = await this.getPlatformState(userId);
      
      // Get current recent items
      const recentItems = [...(state.recentItems[platform] || [])];
      
      // Remove item if it exists to avoid duplicates
      const existingIndex = recentItems.indexOf(itemId);
      if (existingIndex > -1) {
        recentItems.splice(existingIndex, 1);
      }
      
      // Add item to the beginning
      recentItems.unshift(itemId);
      
      // Limit the number of items
      const limitedItems = recentItems.slice(0, maxItems);
      
      // Update state
      return this.savePlatformState(userId, platform, {
        recentItems: limitedItems
      });
    } catch (error) {
      console.error('Failed to add recent item:', error);
      return false;
    }
  }
}

export default StateSyncService; 