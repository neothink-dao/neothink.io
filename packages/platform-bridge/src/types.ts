/**
 * Platform identifiers for the Neothink ecosystem
 */
export type PlatformSlug = 'hub' | 'immortals' | 'ascenders' | 'neothinkers';

/**
 * Platform URLs
 */
export const PLATFORM_URLS: Record<PlatformSlug, string> = {
  hub: 'https://go.neothink.io',
  immortals: 'https://joinimmortals.com',
  ascenders: 'https://joinascenders.com',
  neothinkers: 'https://joinneothinkers.com'
};

/**
 * Platform icons
 */
export const PLATFORM_ICONS: Record<PlatformSlug, string> = {
  hub: 'hub',
  immortals: 'immortals',
  ascenders: 'ascenders',
  neothinkers: 'neothinkers'
};

/**
 * Platform names
 */
export const PLATFORM_NAMES: Record<PlatformSlug, string> = {
  hub: 'Hub',
  immortals: 'Immortals',
  ascenders: 'Ascenders',
  neothinkers: 'Neothinkers'
};

/**
 * Platform colors
 */
export const PLATFORM_COLORS: Record<PlatformSlug, string> = {
  hub: 'var(--hub-primary)',
  immortals: 'var(--immortals-primary)',
  ascenders: 'var(--ascenders-primary)',
  neothinkers: 'var(--neothinkers-primary)'
};

/**
 * Cross-platform notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Cross-platform notification type
 */
export interface CrossPlatformNotification {
  id: string;
  userId: string;
  sourcePlatform: PlatformSlug;
  targetPlatforms: PlatformSlug[];
  title: string;
  content: string;
  actionUrl?: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
}

/**
 * User platform preferences
 */
export interface PlatformPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
  language: string;
  timezone: string;
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
  dashboardLayout?: Record<string, any>;
  featureFlags?: Record<string, boolean>;
}

/**
 * User platform state
 */
export interface PlatformState {
  currentPlatform: PlatformSlug;
  lastVisited: Record<PlatformSlug, string | null>;
  preferences: Record<PlatformSlug, PlatformPreferences>;
  recentItems: Record<PlatformSlug, string[]>;
  userProfile: Record<PlatformSlug, any>;
}

/**
 * Platform navigation item
 */
export interface PlatformNavigationItem {
  id: string;
  title: string;
  url: string;
  platform: PlatformSlug;
  icon?: string;
  children?: PlatformNavigationItem[];
  isExternal?: boolean;
  requiredPermission?: string;
} 