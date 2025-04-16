import { CrossPlatformNotification, NotificationPriority, PlatformSlug } from '../types';
/**
 * Service for managing cross-platform notifications
 */
export declare class NotificationService {
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
export default NotificationService;
//# sourceMappingURL=index.d.ts.map