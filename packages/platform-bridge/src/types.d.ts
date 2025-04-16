/**
 * Platform identifiers for the Neothink ecosystem
 */
export type PlatformSlug = 'hub' | 'immortals' | 'ascenders' | 'neothinkers';
/**
 * Platform URLs
 */
export declare const PLATFORM_URLS: Record<PlatformSlug, string>;
/**
 * Platform icons
 */
export declare const PLATFORM_ICONS: Record<PlatformSlug, string>;
/**
 * Platform names
 */
export declare const PLATFORM_NAMES: Record<PlatformSlug, string>;
/**
 * Platform colors
 */
export declare const PLATFORM_COLORS: Record<PlatformSlug, string>;
/**
 * Cross-platform notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';
/**
 * Email digest frequency options
 */
export type EmailDigestFrequency = 'none' | 'daily' | 'weekly';
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
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
}
/**
 * User platform preferences
 */
export interface PlatformPreferences {
    theme: ThemeMode;
    notifications: boolean;
    emailDigest: EmailDigestFrequency;
    language: string;
    timezone: string;
    accessibility: AccessibilityPreferences;
    dashboardLayout?: Record<string, unknown>;
    featureFlags?: Record<string, boolean>;
}
/**
 * Last visited information for platforms
 */
export type LastVisitedInfo = Record<PlatformSlug, string | null>;
/**
 * Recent items for a platform
 */
export type RecentItems = Record<PlatformSlug, string[]>;
/**
 * User profile info for each platform
 */
export type PlatformProfiles = Record<PlatformSlug, Record<string, unknown>>;
/**
 * Platform preferences for all platforms
 */
export type AllPlatformPreferences = Record<PlatformSlug, PlatformPreferences>;
/**
 * Platform-specific state - can be indexed with platform slug
 */
export interface PlatformState extends Record<PlatformSlug, Record<string, unknown>> {
    currentPlatform: PlatformSlug;
    lastVisited: LastVisitedInfo;
    preferences: AllPlatformPreferences;
    recentItems: RecentItems;
    userProfile: PlatformProfiles;
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
/**
 * Navigation context
 */
export interface NavigationContext {
    sourcePlatform?: PlatformSlug;
    preserveState?: boolean;
    referrer?: string;
    [key: string]: unknown;
}
/**
 * Platform database entity types - matching database schema
 */
export interface PlatformPreferencesEntity {
    id: string;
    user_id: string;
    platform_slug: PlatformSlug;
    preferences: PlatformPreferences;
    last_accessed: string | null;
    created_at: string;
    updated_at: string;
}
export interface PlatformStateEntity {
    id: string;
    user_id: string;
    state: PlatformState;
    created_at: string;
    updated_at: string;
}
export interface NotificationEntity {
    id: string;
    user_id: string;
    source_platform: PlatformSlug;
    target_platforms: PlatformSlug[];
    title: string;
    content: string;
    action_url: string | null;
    priority: NotificationPriority;
    read: boolean;
    created_at: string;
}
//# sourceMappingURL=types.d.ts.map