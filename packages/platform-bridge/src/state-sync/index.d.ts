import { PlatformSlug, PlatformState } from '../types';
/**
 * Service for managing cross-platform state synchronization
 */
export declare class StateSyncService {
    private static supabase;
    /**
     * Save platform state for a user
     * @param userId User ID
     * @param platform Current platform
     * @param state State to save
     * @returns Success status
     */
    static savePlatformState(userId: string, platform: PlatformSlug, state: Record<string, unknown>): Promise<boolean>;
    /**
     * Get platform state for a user
     * @param userId User ID
     * @returns Platform state
     */
    static getPlatformState(userId: string): Promise<PlatformState>;
    /**
     * Get initial state for a specific platform
     * @param userId User ID
     * @param platform Platform slug
     * @returns Platform-specific state
     */
    static getInitialPlatformState(userId: string, platform: PlatformSlug): Promise<Record<string, unknown>>;
    /**
     * Transfer state from one platform to another
     * @param userId User ID
     * @param fromPlatform Source platform
     * @param toPlatform Target platform
     * @param stateKeys Keys to transfer (default: all keys)
     * @returns Success status
     */
    static transferState(userId: string, fromPlatform: PlatformSlug, toPlatform: PlatformSlug, stateKeys?: string[]): Promise<boolean>;
    /**
     * Get default platform state
     * @returns Default platform state
     */
    private static getDefaultState;
    /**
     * Update local state cache
     * @param userId User ID
     * @param state Platform state
     */
    private static updateLocalStateCache;
    /**
     * Get state from local cache
     * @param userId User ID
     * @returns Cached state or null
     */
    private static getStateFromCache;
    /**
     * Clear state for a user
     * @param userId User ID
     * @returns Success status
     */
    static clearState(userId: string): Promise<boolean>;
    /**
     * Add item to recent items
     * @param userId User ID
     * @param platform Current platform
     * @param itemId Item ID to add
     * @param maxItems Maximum number of items to keep (default: 10)
     * @returns Success status
     */
    static addRecentItem(userId: string, platform: PlatformSlug, itemId: string, maxItems?: number): Promise<boolean>;
}
export default StateSyncService;
//# sourceMappingURL=index.d.ts.map