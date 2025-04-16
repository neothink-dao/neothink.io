import { PlatformPreferences, PlatformSlug } from '../types';
/**
 * Service for managing user preferences across platforms
 */
export declare class PreferencesService {
    private static supabase;
    /**
     * Get user preferences for a specific platform
     * @param userId User ID
     * @param platform Platform slug
     * @returns Platform preferences or default preferences
     */
    static getUserPreferences(userId: string, platform: PlatformSlug): Promise<PlatformPreferences>;
    /**
     * Save user preferences for a specific platform
     * @param userId User ID
     * @param platform Platform slug
     * @param preferences Platform preferences
     * @returns Success status
     */
    static saveUserPreferences(userId: string, platform: PlatformSlug, preferences: Partial<PlatformPreferences>): Promise<boolean>;
    /**
     * Update local preferences cache
     * @param userId User ID
     * @param platform Platform slug
     * @param preferences Platform preferences
     */
    private static updateLocalPreferencesCache;
    /**
     * Get preferences from local cache
     * @param userId User ID
     * @param platform Platform slug
     * @returns Cached preferences or null
     */
    static getPreferencesFromCache(userId: string, platform: PlatformSlug): PlatformPreferences | null;
    /**
     * Sync preferences across platforms
     * @param userId User ID
     * @param preferences Preferences to sync
     * @param platforms Platforms to sync to (default: all platforms)
     * @returns Success status
     */
    static syncPreferencesAcrossPlatforms(userId: string, preferences: Partial<PlatformPreferences>, platforms?: PlatformSlug[]): Promise<boolean>;
    /**
     * Reset preferences to default for a specific platform
     * @param userId User ID
     * @param platform Platform to reset
     * @returns Success status
     */
    static resetPreferences(userId: string, platform: PlatformSlug): Promise<boolean>;
}
export default PreferencesService;
//# sourceMappingURL=index.d.ts.map