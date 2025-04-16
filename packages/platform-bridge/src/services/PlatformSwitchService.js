import { createClient } from '@supabase/supabase-js';
export class PlatformSwitchService {
    constructor(supabaseUrl, supabaseKey) {
        this.userId = null;
        this.client = createClient(supabaseUrl, supabaseKey);
    }
    async initialize(userId) {
        this.userId = userId;
    }
    async checkAccess(platformSlug) {
        if (!this.userId)
            return false;
        const { data, error } = await this.client
            .from('platform_access')
            .select('*')
            .eq('user_id', this.userId)
            .eq('platform_slug', platformSlug)
            .single();
        if (error || !data) {
            return false;
        }
        return true;
    }
    async preserveState(platformSlug, customState) {
        if (!this.userId)
            return false;
        const state = Object.assign({ currentPlatform: platformSlug, lastVisited: new Date().toISOString(), preferences: {
                theme: 'system',
                notifications: true,
                language: 'en',
            }, recentItems: [], navigation: {
                lastPath: '/',
                scrollPosition: 0,
                breadcrumbs: [],
            }, progress: {
                level: 1,
                achievements: [],
                completedModules: [],
            }, timestamp: new Date().toISOString(), platformData: {} }, customState);
        const { error } = await this.client
            .from('platform_state')
            .upsert({
            user_id: this.userId,
            platform_slug: platformSlug,
            state_data: state,
            updated_at: new Date().toISOString(),
        });
        return !error;
    }
    async restoreState(platformSlug) {
        if (!this.userId)
            return null;
        const { data, error } = await this.client
            .from('platform_state')
            .select('state_data')
            .eq('user_id', this.userId)
            .eq('platform_slug', platformSlug)
            .single();
        if (error || !data) {
            return null;
        }
        return (data === null || data === void 0 ? void 0 : data.state_data) || null;
    }
    async switchPlatform(targetPlatform, preserveCurrentState = true, currentPlatform) {
        if (!this.userId) {
            const switchError = {
                code: 'SWITCH_FAILED',
                message: 'User not authenticated',
                details: 'You must be signed in to switch platforms'
            };
            return { success: false, error: switchError };
        }
        // Check if user has access to the target platform
        const hasAccess = await this.checkAccess(targetPlatform);
        if (!hasAccess) {
            const switchError = {
                code: 'ACCESS_DENIED',
                message: 'Access denied',
                details: 'You do not have access to this platform'
            };
            return { success: false, error: switchError };
        }
        try {
            // Preserve state from current platform
            if (preserveCurrentState && currentPlatform) {
                await this.preserveState(currentPlatform);
            }
            // Restore state for target platform
            const restoredState = await this.restoreState(targetPlatform);
            // Record switch in analytics
            await this.client
                .from('platform_switches')
                .insert({
                user_id: this.userId,
                from_platform: currentPlatform,
                to_platform: targetPlatform,
                timestamp: new Date().toISOString()
            });
            return {
                success: true,
                state: restoredState !== null && restoredState !== void 0 ? restoredState : undefined
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const switchError = {
                code: 'SWITCH_FAILED',
                message: 'Failed to switch platforms',
                details: errorMessage
            };
            return { success: false, error: switchError };
        }
    }
    async getPlatformAccess() {
        if (!this.userId)
            return [];
        const { data, error } = await this.client
            .from('platform_access')
            .select('*')
            .eq('user_id', this.userId);
        if (error || !data) {
            return [];
        }
        return data;
    }
}
//# sourceMappingURL=PlatformSwitchService.js.map