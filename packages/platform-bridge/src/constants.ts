import { PlatformPreferences, PlatformSlug } from './types';

/**
 * Default platform preferences
 */
export const DEFAULT_PREFERENCES: PlatformPreferences = {
  theme: 'system',
  notifications: true,
  emailDigest: 'weekly',
  language: 'en',
  timezone: typeof Intl !== 'undefined' 
    ? Intl.DateTimeFormat().resolvedOptions().timeZone 
    : 'UTC',
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false
  }
};

/**
 * Platform URLs - Production
 */
export const PLATFORM_URLS: Record<PlatformSlug, string> = {
  hub: 'https://go.neothink.io',
  immortals: 'https://www.joinimmortals.org',
  ascenders: 'https://www.joinascenders.org',
  neothinkers: 'https://www.joinneothinkers.org'
};

/**
 * Platform names - Display friendly
 */
export const PLATFORM_NAMES: Record<PlatformSlug, string> = {
  hub: 'Hub',
  immortals: 'Immortals',
  ascenders: 'Ascenders',
  neothinkers: 'Neothinkers'
};

/**
 * Platform colors - CSS variables
 */
export const PLATFORM_COLORS: Record<PlatformSlug, string> = {
  hub: 'var(--hub-primary)',
  immortals: 'var(--immortals-primary)',
  ascenders: 'var(--ascenders-primary)',
  neothinkers: 'var(--neothinkers-primary)'
};

/**
 * Platform colors - Raw RGB values for manipulations
 */
export const PLATFORM_COLORS_RGB: Record<PlatformSlug, [number, number, number]> = {
  hub: [106, 36, 254],
  immortals: [36, 160, 254],
  ascenders: [254, 126, 36],
  neothinkers: [36, 254, 154]
};

/**
 * Local storage keys for caching
 */
export const STORAGE_KEYS = {
  PREFERENCES: 'neothink_preferences_',
  STATE: 'neothink_state_',
  LAST_LOCATIONS: 'neothink_last_locations'
};

/**
 * Database table names
 */
export const DB_TABLES = {
  PREFERENCES: 'user_platform_preferences',
  STATE: 'user_platform_state',
  NOTIFICATIONS: 'cross_platform_notifications'
};

/**
 * Default time configs
 */
export const TIME_CONFIG = {
  PREFERENCE_CACHE_TTL: 60 * 60 * 1000, // 1 hour
  STATE_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  NOTIFICATION_CHECK_INTERVAL: 30 * 1000 // 30 seconds
}; 