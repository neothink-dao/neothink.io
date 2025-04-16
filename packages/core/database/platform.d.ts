import type { Database } from '@neothink/types';
export type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
/**
 * Check if a user has access to a specific platform
 */
export declare function hasPlatformAccess(platformSlug: PlatformSlug, userId?: string): Promise<boolean>;
/**
 * Grant platform access to a user
 */
export declare function grantPlatformAccess(userId: string, platformSlug: PlatformSlug): Promise<boolean>;
/**
 * Revoke platform access from a user
 */
export declare function revokePlatformAccess(userId: string, platformSlug: PlatformSlug): Promise<boolean>;
/**
 * Get a user's platform-specific profile
 */
export declare function getPlatformProfile<T extends PlatformSlug>(platformSlug: T, userId?: string): Promise<Database['public']['Tables'][`${T}_profiles`]['Row'] | null>;
/**
 * Create or update a user's platform-specific profile
 */
export declare function upsertPlatformProfile<T extends PlatformSlug>(platformSlug: T, profile: Partial<Database['public']['Tables'][`${T}_profiles`]['Insert']>, userId?: string): Promise<Database['public']['Tables'][`${T}_profiles`]['Row'] | null>;
/**
 * Track an analytics event for a specific platform
 */
export declare function trackPlatformEvent(platform: PlatformSlug, eventName: string, properties?: Record<string, any>, userId?: string): Promise<boolean>;
/**
 * Platform database operations by platform slug
 */
export declare const platformDb: {
    hub: {
        /**
         * Get the platform-specific profile for the current user
         */
        getProfile: (userId?: string) => Promise<any>;
        /**
         * Create or update the platform-specific profile
         */
        upsertProfile: <T extends Database["public"]["Tables"][`${PlatformSlug}_profiles`]["Insert"]>(profile: Partial<T>, userId?: string) => Promise<any>;
        /**
         * Track an analytics event for this platform
         */
        trackEvent: (eventName: string, properties?: Record<string, any>, userId?: string) => Promise<boolean>;
        /**
         * Check if the current user has access to this platform
         */
        hasAccess: (userId?: string) => Promise<boolean>;
        /**
         * Grant access to this platform for a user
         */
        grantAccess: (userId: string) => Promise<boolean>;
        /**
         * Revoke access to this platform for a user
         */
        revokeAccess: (userId: string) => Promise<boolean>;
    };
    ascenders: {
        /**
         * Get the platform-specific profile for the current user
         */
        getProfile: (userId?: string) => Promise<any>;
        /**
         * Create or update the platform-specific profile
         */
        upsertProfile: <T extends Database["public"]["Tables"][`${PlatformSlug}_profiles`]["Insert"]>(profile: Partial<T>, userId?: string) => Promise<any>;
        /**
         * Track an analytics event for this platform
         */
        trackEvent: (eventName: string, properties?: Record<string, any>, userId?: string) => Promise<boolean>;
        /**
         * Check if the current user has access to this platform
         */
        hasAccess: (userId?: string) => Promise<boolean>;
        /**
         * Grant access to this platform for a user
         */
        grantAccess: (userId: string) => Promise<boolean>;
        /**
         * Revoke access to this platform for a user
         */
        revokeAccess: (userId: string) => Promise<boolean>;
    };
    neothinkers: {
        /**
         * Get the platform-specific profile for the current user
         */
        getProfile: (userId?: string) => Promise<any>;
        /**
         * Create or update the platform-specific profile
         */
        upsertProfile: <T extends Database["public"]["Tables"][`${PlatformSlug}_profiles`]["Insert"]>(profile: Partial<T>, userId?: string) => Promise<any>;
        /**
         * Track an analytics event for this platform
         */
        trackEvent: (eventName: string, properties?: Record<string, any>, userId?: string) => Promise<boolean>;
        /**
         * Check if the current user has access to this platform
         */
        hasAccess: (userId?: string) => Promise<boolean>;
        /**
         * Grant access to this platform for a user
         */
        grantAccess: (userId: string) => Promise<boolean>;
        /**
         * Revoke access to this platform for a user
         */
        revokeAccess: (userId: string) => Promise<boolean>;
    };
    immortals: {
        /**
         * Get the platform-specific profile for the current user
         */
        getProfile: (userId?: string) => Promise<any>;
        /**
         * Create or update the platform-specific profile
         */
        upsertProfile: <T extends Database["public"]["Tables"][`${PlatformSlug}_profiles`]["Insert"]>(profile: Partial<T>, userId?: string) => Promise<any>;
        /**
         * Track an analytics event for this platform
         */
        trackEvent: (eventName: string, properties?: Record<string, any>, userId?: string) => Promise<boolean>;
        /**
         * Check if the current user has access to this platform
         */
        hasAccess: (userId?: string) => Promise<boolean>;
        /**
         * Grant access to this platform for a user
         */
        grantAccess: (userId: string) => Promise<boolean>;
        /**
         * Revoke access to this platform for a user
         */
        revokeAccess: (userId: string) => Promise<boolean>;
    };
};
//# sourceMappingURL=platform.d.ts.map