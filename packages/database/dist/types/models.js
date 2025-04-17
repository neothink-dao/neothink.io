/**
 * Type definitions for shared models across the platform
 */
// PlatformSlug as a value for type-only import compatibility
export const PLATFORM_SLUGS_VALUES = ['hub', 'ascenders', 'neothinkers', 'immortals', 'app', 'admin'];
export const __PlatformSlug = null;
/**
 * Platform identifier
 */
export const PLATFORM_SLUGS = PLATFORM_SLUGS_VALUES;
export const ALL_PLATFORM_SLUGS = PLATFORM_SLUGS_VALUES;
export const __SecurityLog = null;
export const __SecurityEventType = null;
export const __SecurityEventSeverity = null;
export const __SecurityEvent = null;
/**
 * Enumerates all possible security event types (array form).
 */
export const SecurityEventTypes = [
    'login',
    'logout',
    'password_reset',
    'unauthorized_access',
    'user_created',
    'user_deleted',
    'role_changed',
    'other'
];
export const __SecurityEventTypes = null;
