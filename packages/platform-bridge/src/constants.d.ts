import { PlatformPreferences, PlatformSlug } from './types';
/**
 * Default platform preferences
 */
export declare const DEFAULT_PREFERENCES: PlatformPreferences;
/**
 * Platform URLs - Production
 */
export declare const PLATFORM_URLS: Record<PlatformSlug, string>;
/**
 * Platform names - Display friendly
 */
export declare const PLATFORM_NAMES: Record<PlatformSlug, string>;
/**
 * Platform colors - CSS variables
 */
export declare const PLATFORM_COLORS: Record<PlatformSlug, string>;
/**
 * Platform colors - Raw RGB values for manipulations
 */
export declare const PLATFORM_COLORS_RGB: Record<PlatformSlug, [number, number, number]>;
/**
 * Local storage keys for caching
 */
export declare const STORAGE_KEYS: {
    PREFERENCES: string;
    STATE: string;
    LAST_LOCATIONS: string;
};
/**
 * Database table names
 */
export declare const DB_TABLES: {
    PREFERENCES: string;
    STATE: string;
    NOTIFICATIONS: string;
};
/**
 * Default time configs
 */
export declare const TIME_CONFIG: {
    PREFERENCE_CACHE_TTL: number;
    STATE_CACHE_TTL: number;
    NOTIFICATION_CHECK_INTERVAL: number;
};
//# sourceMappingURL=constants.d.ts.map