import { createClient } from '@supabase/supabase-js';
import { PlatformPreferences, PlatformSlug, PlatformPreferencesEntity } from '../types';
import { DEFAULT_PREFERENCES, DB_TABLES, STORAGE_KEYS } from '../constants';

/**
 * Service for managing user preferences across platforms
 */
export class PreferencesService {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  /**
   * Get user preferences for a specific platform
   * @param userId User ID
   * @param platform Platform slug
   * @returns Platform preferences or default preferences
   */
  static async getUserPreferences(
    userId: string,
    platform: PlatformSlug
  ): Promise<PlatformPreferences> {
    try {
      // Try getting from cache first for better performance
      const cachedPreferences = this.getPreferencesFromCache(userId, platform);
      if (cachedPreferences) return cachedPreferences;
      
      // If not in cache, get from database
      const { data, error } = await this.supabase
        .from(DB_TABLES.PREFERENCES)
        .select('preferences')
        .eq('user_id', userId)
        .eq('platform_slug', platform)
        .single();
      
      if (error) throw error;
      
      const preferences = data?.preferences || DEFAULT_PREFERENCES;
      
      // Update cache
      this.updateLocalPreferencesCache(userId, platform, preferences);
      
      return preferences;
    } catch (error) {
      console.error(`Failed to get user preferences for ${platform}:`, error);
      return DEFAULT_PREFERENCES;
    }
  }
  
  /**
   * Save user preferences for a specific platform
   * @param userId User ID
   * @param platform Platform slug
   * @param preferences Platform preferences
   * @returns Success status
   */
  static async saveUserPreferences(
    userId: string,
    platform: PlatformSlug,
    preferences: Partial<PlatformPreferences>
  ): Promise<boolean> {
    try {
      // Get existing preferences or default
      const existingPreferences = await this.getUserPreferences(userId, platform);
      
      // Merge with new preferences
      const mergedPreferences = {
        ...existingPreferences,
        ...preferences
      };
      
      // Update last accessed timestamp
      const { error } = await this.supabase
        .from(DB_TABLES.PREFERENCES)
        .upsert({
          user_id: userId,
          platform_slug: platform,
          preferences: mergedPreferences,
          last_accessed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local storage cache for faster access
      this.updateLocalPreferencesCache(userId, platform, mergedPreferences);
      
      return true;
    } catch (error) {
      console.error(`Failed to save user preferences for ${platform}:`, error);
      return false;
    }
  }
  
  /**
   * Update local preferences cache
   * @param userId User ID
   * @param platform Platform slug
   * @param preferences Platform preferences
   */
  private static updateLocalPreferencesCache(
    userId: string,
    platform: PlatformSlug,
    preferences: PlatformPreferences
  ): void {
    try {
      const cacheKey = `${STORAGE_KEYS.PREFERENCES}${userId}`;
      const preferenceCache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      
      preferenceCache[platform] = {
        ...preferences,
        cachedAt: Date.now()
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(preferenceCache));
    } catch (error) {
      console.error('Failed to update local preferences cache:', error);
    }
  }
  
  /**
   * Get preferences from local cache
   * @param userId User ID
   * @param platform Platform slug
   * @returns Cached preferences or null
   */
  static getPreferencesFromCache(
    userId: string,
    platform: PlatformSlug
  ): PlatformPreferences | null {
    try {
      const cacheKey = `${STORAGE_KEYS.PREFERENCES}${userId}`;
      const preferenceCache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      const cachedData = preferenceCache[platform];
      
      // If no cached data or cache is expired, return null
      if (!cachedData || !cachedData.cachedAt) return null;
      
      // Return null if cache is older than the TTL
      const cacheAge = Date.now() - cachedData.cachedAt;
      if (cacheAge > 60 * 60 * 1000) return null; // 1 hour TTL
      
      // Remove cache metadata before returning
      const { cachedAt, ...preferences } = cachedData;
      return preferences;
    } catch (error) {
      console.error('Failed to get preferences from cache:', error);
      return null;
    }
  }
  
  /**
   * Sync preferences across platforms
   * @param userId User ID
   * @param preferences Preferences to sync
   * @param platforms Platforms to sync to (default: all platforms)
   * @returns Success status
   */
  static async syncPreferencesAcrossPlatforms(
    userId: string,
    preferences: Partial<PlatformPreferences>,
    platforms: PlatformSlug[] = ['hub', 'immortals', 'ascenders', 'neothinkers']
  ): Promise<boolean> {
    try {
      // For each platform, update preferences
      const results = await Promise.all(
        platforms.map(platform => 
          this.saveUserPreferences(userId, platform, preferences)
        )
      );
      
      // If all updates succeeded
      return results.every(result => result === true);
    } catch (error) {
      console.error('Failed to sync preferences across platforms:', error);
      return false;
    }
  }
  
  /**
   * Reset preferences to default for a specific platform
   * @param userId User ID
   * @param platform Platform to reset
   * @returns Success status
   */
  static async resetPreferences(
    userId: string,
    platform: PlatformSlug
  ): Promise<boolean> {
    return this.saveUserPreferences(userId, platform, DEFAULT_PREFERENCES);
  }
}

export default PreferencesService; 