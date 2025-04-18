import React from 'react';

/**
 * Platform identifiers for the Neothink ecosystem
 */
type PlatformSlug = 'hub' | 'immortals' | 'ascenders' | 'neothinkers';
/**
 * Platform URLs
 */
declare const PLATFORM_URLS: Record<PlatformSlug, string>;
/**
 * Platform icons
 */
declare const PLATFORM_ICONS: Record<PlatformSlug, string>;
/**
 * Platform names
 */
declare const PLATFORM_NAMES: Record<PlatformSlug, string>;
/**
 * Platform colors
 */
declare const PLATFORM_COLORS: Record<PlatformSlug, string>;
/**
 * Cross-platform notification priority levels
 */
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
/**
 * Theme mode options
 */
type ThemeMode = 'light' | 'dark' | 'system';
/**
 * Email digest frequency options
 */
type EmailDigestFrequency = 'none' | 'daily' | 'weekly';
/**
 * Cross-platform notification type
 */
interface CrossPlatformNotification {
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
interface AccessibilityPreferences {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
}
/**
 * User platform preferences
 */
interface PlatformPreferences {
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
type LastVisitedInfo = Record<PlatformSlug, string | null>;
/**
 * Recent items for a platform
 */
type RecentItems = Record<PlatformSlug, string[]>;
/**
 * User profile info for each platform
 */
type PlatformProfiles = Record<PlatformSlug, Record<string, unknown>>;
/**
 * Platform preferences for all platforms
 */
type AllPlatformPreferences = Record<PlatformSlug, PlatformPreferences>;
/**
 * Platform-specific state - can be indexed with platform slug
 */
interface PlatformState extends Record<PlatformSlug, Record<string, unknown>> {
    currentPlatform: PlatformSlug;
    lastVisited: LastVisitedInfo;
    preferences: AllPlatformPreferences;
    recentItems: RecentItems;
    userProfile: PlatformProfiles;
}
/**
 * Platform navigation item
 */
interface PlatformNavigationItem {
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
interface NavigationContext {
    sourcePlatform?: PlatformSlug;
    preserveState?: boolean;
    referrer?: string;
    [key: string]: unknown;
}
/**
 * Platform database entity types - matching database schema
 */
interface PlatformPreferencesEntity {
    id: string;
    user_id: string;
    platform_slug: PlatformSlug;
    preferences: PlatformPreferences;
    last_accessed: string | null;
    created_at: string;
    updated_at: string;
}
interface PlatformStateEntity {
    id: string;
    user_id: string;
    state: PlatformState;
    created_at: string;
    updated_at: string;
}
interface NotificationEntity {
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

/**
 * Navigation service for cross-platform navigation
 */
declare class NavigationService {
    /**
     * Navigate to another platform with context
     * @param platform Target platform
     * @param path Optional path within the platform
     * @param context Optional context to pass to the target platform
     */
    static navigateToPlatform(platform: PlatformSlug, path?: string, context?: NavigationContext): string;
    /**
     * Generate common navigation items for all platforms
     * @param currentPlatform Current platform
     * @returns Array of navigation items
     */
    static getCommonNavigation(currentPlatform: PlatformSlug): PlatformNavigationItem[];
    /**
     * Store the last visited location before leaving the platform
     * @param platform Current platform
     * @param path Current path
     */
    static storeLastLocation(platform: PlatformSlug, path: string): void;
    /**
     * Get the last visited location for a platform
     * @param platform Target platform
     * @returns Last visited path or null
     */
    static getLastLocation(platform: PlatformSlug): string | null;
    /**
     * Detect the current platform based on the hostname
     * @returns Current platform slug
     */
    static detectCurrentPlatform(): PlatformSlug;
    /**
     * Navigate to another platform and preserve the current user state
     * @param platform Target platform
     * @param path Optional path within the platform
     * @param preserveState Whether to preserve the current state
     */
    static navigateWithStatePreservation(platform: PlatformSlug, path?: string, preserveState?: boolean): string;
}

/**
 * Service for managing user preferences across platforms
 */
declare class PreferencesService {
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

/**
 * Service for managing cross-platform notifications
 */
declare class NotificationService {
    private static supabase;
    private static subscriptions;
    /**
     * Send a notification to one or more platforms
     * @param userId User ID
     * @param sourcePlatform Source platform
     * @param targetPlatforms Target platforms
     * @param title Notification title
     * @param content Notification content
     * @param priority Notification priority
     * @param actionUrl Optional action URL
     * @returns Success status
     */
    static sendNotification(userId: string, sourcePlatform: PlatformSlug, targetPlatforms: PlatformSlug[], title: string, content: string, priority?: NotificationPriority, actionUrl?: string): Promise<boolean>;
    /**
     * Get notifications for a user on specific platforms
     * @param userId User ID
     * @param platforms Platforms to get notifications for
     * @param limit Maximum number of notifications to get
     * @param offset Offset for pagination
     * @returns Array of notifications
     */
    static getNotifications(userId: string, platforms: PlatformSlug[], limit?: number, offset?: number): Promise<CrossPlatformNotification[]>;
    /**
     * Map database entity to our type
     * @param entity Database entity
     * @returns CrossPlatformNotification
     */
    private static mapNotificationFromEntity;
    /**
     * Mark notifications as read
     * @param userId User ID
     * @param notificationIds Notification IDs to mark as read
     * @returns Success status
     */
    static markAsRead(userId: string, notificationIds: string[]): Promise<boolean>;
    /**
     * Subscribe to real-time notifications
     * @param userId User ID
     * @param platforms Platforms to subscribe to
     * @param callback Callback function for new notifications
     * @returns Subscription ID
     */
    static subscribeToNotifications(userId: string, platforms: PlatformSlug[], callback: (notification: CrossPlatformNotification) => void): string;
    /**
     * Unsubscribe from real-time notifications
     * @param subscriptionId Subscription ID
     */
    static unsubscribeFromNotifications(subscriptionId: string): void;
    /**
     * Get unread notification count
     * @param userId User ID
     * @param platforms Platforms to count notifications for
     * @returns Number of unread notifications
     */
    static getUnreadCount(userId: string, platforms: PlatformSlug[]): Promise<number>;
    /**
     * Get notifications with auto-refresh
     * @param userId User ID
     * @param platforms Platforms to get notifications for
     * @param limit Maximum number of notifications to get
     * @param callback Callback function for notifications
     * @returns Cleanup function
     */
    static subscribeToNotificationsWithPolling(userId: string, platforms: PlatformSlug[], limit: number | undefined, callback: (notifications: CrossPlatformNotification[]) => void): () => void;
}

/**
 * Service for managing cross-platform state synchronization
 */
declare class StateSyncService {
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

interface PlatformBridgeContextType {
    currentPlatform: PlatformSlug;
    navigateToPlatform: (platform: PlatformSlug, path?: string) => void;
    preferences: Record<string, any>;
    savePreferences: (preferences: Record<string, any>) => Promise<boolean>;
    unreadNotificationCount: number;
    state: Record<string, any>;
    saveState: (state: Record<string, any>) => Promise<boolean>;
    transferStateToOtherPlatform: (targetPlatform: PlatformSlug) => Promise<boolean>;
}
interface PlatformBridgeProviderProps {
    children: React.ReactNode;
    userId?: string;
    initialPlatform?: PlatformSlug;
}
declare const PlatformBridgeProvider: React.FC<PlatformBridgeProviderProps>;
declare const usePlatformBridge: () => PlatformBridgeContextType;
declare const PlatformSwitcher: React.FC;

export { type AccessibilityPreferences, type AllPlatformPreferences, type CrossPlatformNotification, type EmailDigestFrequency, type LastVisitedInfo, type NavigationContext, NavigationService, type NotificationEntity, type NotificationPriority, NotificationService, PLATFORM_COLORS, PLATFORM_ICONS, PLATFORM_NAMES, PLATFORM_URLS, PlatformBridgeProvider, type PlatformNavigationItem, type PlatformPreferences, type PlatformPreferencesEntity, type PlatformProfiles, type PlatformSlug, type PlatformState, type PlatformStateEntity, PlatformSwitcher, PreferencesService, type RecentItems, StateSyncService, type ThemeMode, usePlatformBridge };
