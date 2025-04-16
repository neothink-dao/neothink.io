var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_PREFERENCES, DB_TABLES, STORAGE_KEYS, TIME_CONFIG } from '../constants';
/**
 * Service for managing cross-platform state synchronization
 */
export class StateSyncService {
    /**
     * Save platform state for a user
     * @param userId User ID
     * @param platform Current platform
     * @param state State to save
     * @returns Success status
     */
    static async savePlatformState(userId, platform, state) {
        try {
            // Get current state
            const currentState = await this.getPlatformState(userId);
            // Update the state for the specific platform
            const updatedState = Object.assign(Object.assign({}, currentState), { currentPlatform: platform, lastVisited: Object.assign(Object.assign({}, currentState.lastVisited), { [platform]: new Date().toISOString() }), 
                // Update platform-specific state
                [platform]: Object.assign(Object.assign({}, currentState[platform]), state) });
            // Save to Supabase
            const { error } = await this.supabase
                .from(DB_TABLES.STATE)
                .upsert({
                user_id: userId,
                state: updatedState,
                updated_at: new Date().toISOString()
            });
            if (error)
                throw error;
            // Update local cache
            this.updateLocalStateCache(userId, updatedState);
            return true;
        }
        catch (error) {
            console.error('Failed to save platform state:', error);
            return false;
        }
    }
    /**
     * Get platform state for a user
     * @param userId User ID
     * @returns Platform state
     */
    static async getPlatformState(userId) {
        try {
            // Check local cache first for better performance
            const cachedState = this.getStateFromCache(userId);
            if (cachedState)
                return cachedState;
            // If not in cache, fetch from Supabase
            const { data, error } = await this.supabase
                .from(DB_TABLES.STATE)
                .select('state')
                .eq('user_id', userId)
                .single();
            if (error)
                throw error;
            // If found, update cache and return
            if (data === null || data === void 0 ? void 0 : data.state) {
                this.updateLocalStateCache(userId, data.state);
                return data.state;
            }
            // Return default state if not found
            return this.getDefaultState();
        }
        catch (error) {
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
    static async getInitialPlatformState(userId, platform) {
        try {
            const state = await this.getPlatformState(userId);
            // Update current platform and last visited
            await this.savePlatformState(userId, platform, {});
            // Return platform-specific state
            return state[platform] || {};
        }
        catch (error) {
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
    static async transferState(userId, fromPlatform, toPlatform, stateKeys) {
        try {
            const state = await this.getPlatformState(userId);
            // Get source state
            const sourceState = state[fromPlatform] || {};
            // Get target state
            const targetState = state[toPlatform] || {};
            // Create new state with transferred keys
            const newState = Object.assign({}, targetState);
            // Transfer all or specific keys
            if (stateKeys) {
                stateKeys.forEach(key => {
                    if (sourceState[key] !== undefined) {
                        newState[key] = sourceState[key];
                    }
                });
            }
            else {
                Object.assign(newState, sourceState);
            }
            // Save updated state
            return this.savePlatformState(userId, toPlatform, newState);
        }
        catch (error) {
            console.error('Failed to transfer state:', error);
            return false;
        }
    }
    /**
     * Get default platform state
     * @returns Default platform state
     */
    static getDefaultState() {
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
    static updateLocalStateCache(userId, state) {
        try {
            const stateWithMeta = Object.assign(Object.assign({}, state), { cachedAt: Date.now() });
            localStorage.setItem(`${STORAGE_KEYS.STATE}${userId}`, JSON.stringify(stateWithMeta));
        }
        catch (error) {
            console.error('Failed to update local state cache:', error);
        }
    }
    /**
     * Get state from local cache
     * @param userId User ID
     * @returns Cached state or null
     */
    static getStateFromCache(userId) {
        try {
            const cachedData = localStorage.getItem(`${STORAGE_KEYS.STATE}${userId}`);
            if (!cachedData)
                return null;
            const parsedData = JSON.parse(cachedData);
            // If no timestamp or cache is expired, return null
            if (!parsedData.cachedAt)
                return null;
            const cacheAge = Date.now() - parsedData.cachedAt;
            if (cacheAge > TIME_CONFIG.STATE_CACHE_TTL)
                return null;
            // Remove cache metadata before returning
            const { cachedAt } = parsedData, state = __rest(parsedData, ["cachedAt"]);
            return state;
        }
        catch (error) {
            console.error('Failed to get state from cache:', error);
            return null;
        }
    }
    /**
     * Clear state for a user
     * @param userId User ID
     * @returns Success status
     */
    static async clearState(userId) {
        try {
            // Remove from Supabase
            const { error } = await this.supabase
                .from(DB_TABLES.STATE)
                .delete()
                .eq('user_id', userId);
            if (error)
                throw error;
            // Clear local cache
            localStorage.removeItem(`${STORAGE_KEYS.STATE}${userId}`);
            return true;
        }
        catch (error) {
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
    static async addRecentItem(userId, platform, itemId, maxItems = 10) {
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
        }
        catch (error) {
            console.error('Failed to add recent item:', error);
            return false;
        }
    }
}
StateSyncService.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
export default StateSyncService;
//# sourceMappingURL=index.js.map