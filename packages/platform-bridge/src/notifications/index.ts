import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { 
  CrossPlatformNotification, 
  NotificationPriority, 
  PlatformSlug,
  NotificationEntity
} from '../types';
import { DB_TABLES, TIME_CONFIG } from '../constants';

/**
 * Service for managing cross-platform notifications
 */
export class NotificationService {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  private static subscriptions: Map<string, RealtimeChannel> = new Map();
  
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
  static async sendNotification(
    userId: string,
    sourcePlatform: PlatformSlug,
    targetPlatforms: PlatformSlug[],
    title: string,
    content: string,
    priority: NotificationPriority = 'medium',
    actionUrl?: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(DB_TABLES.NOTIFICATIONS)
        .insert({
          user_id: userId,
          source_platform: sourcePlatform,
          target_platforms: targetPlatforms,
          title,
          content,
          priority,
          action_url: actionUrl,
          read: false,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }
  
  /**
   * Get notifications for a user on specific platforms
   * @param userId User ID
   * @param platforms Platforms to get notifications for
   * @param limit Maximum number of notifications to get
   * @param offset Offset for pagination
   * @returns Array of notifications
   */
  static async getNotifications(
    userId: string,
    platforms: PlatformSlug[],
    limit: number = 20,
    offset: number = 0
  ): Promise<CrossPlatformNotification[]> {
    try {
      const { data, error } = await this.supabase
        .from(DB_TABLES.NOTIFICATIONS)
        .select('*')
        .eq('user_id', userId)
        .contains('target_platforms', platforms)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // Map the database response to our type
      return (data || []).map(this.mapNotificationFromEntity);
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }
  
  /**
   * Map database entity to our type
   * @param entity Database entity
   * @returns CrossPlatformNotification
   */
  private static mapNotificationFromEntity(entity: any): CrossPlatformNotification {
    return {
      id: entity.id,
      userId: entity.user_id,
      sourcePlatform: entity.source_platform,
      targetPlatforms: entity.target_platforms,
      title: entity.title,
      content: entity.content,
      actionUrl: entity.action_url,
      priority: entity.priority,
      read: entity.read,
      createdAt: entity.created_at
    };
  }
  
  /**
   * Mark notifications as read
   * @param userId User ID
   * @param notificationIds Notification IDs to mark as read
   * @returns Success status
   */
  static async markAsRead(
    userId: string,
    notificationIds: string[]
  ): Promise<boolean> {
    try {
      if (notificationIds.length === 0) return true;
      
      const { error } = await this.supabase
        .from(DB_TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('user_id', userId)
        .in('id', notificationIds);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      return false;
    }
  }
  
  /**
   * Subscribe to real-time notifications
   * @param userId User ID
   * @param platforms Platforms to subscribe to
   * @param callback Callback function for new notifications
   * @returns Subscription ID
   */
  static subscribeToNotifications(
    userId: string,
    platforms: PlatformSlug[],
    callback: (notification: CrossPlatformNotification) => void
  ): string {
    // Create a unique subscription ID
    const subscriptionId = `${userId}-${Date.now()}`;
    
    // Create a channel and subscribe to notifications
    const channel = this.supabase
      .channel(`notifications-${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: DB_TABLES.NOTIFICATIONS,
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          const notification = payload.new;
          
          // Check if notification is for one of the user's platforms
          if (
            notification.target_platforms &&
            notification.target_platforms.some((p: PlatformSlug) => platforms.includes(p))
          ) {
            // Call the callback with the mapped notification
            callback(this.mapNotificationFromEntity(notification));
          }
        }
      )
      .subscribe();
    
    // Store the subscription
    this.subscriptions.set(subscriptionId, channel);
    
    return subscriptionId;
  }
  
  /**
   * Unsubscribe from real-time notifications
   * @param subscriptionId Subscription ID
   */
  static unsubscribeFromNotifications(subscriptionId: string): void {
    const channel = this.subscriptions.get(subscriptionId);
    
    if (channel) {
      this.supabase.removeChannel(channel);
      this.subscriptions.delete(subscriptionId);
    }
  }
  
  /**
   * Get unread notification count
   * @param userId User ID
   * @param platforms Platforms to count notifications for
   * @returns Number of unread notifications
   */
  static async getUnreadCount(
    userId: string,
    platforms: PlatformSlug[]
  ): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from(DB_TABLES.NOTIFICATIONS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)
        .contains('target_platforms', platforms);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Failed to get unread notification count:', error);
      return 0;
    }
  }
  
  /**
   * Get notifications with auto-refresh
   * @param userId User ID
   * @param platforms Platforms to get notifications for
   * @param limit Maximum number of notifications to get
   * @param callback Callback function for notifications
   * @returns Cleanup function
   */
  static subscribeToNotificationsWithPolling(
    userId: string,
    platforms: PlatformSlug[],
    limit: number = 20,
    callback: (notifications: CrossPlatformNotification[]) => void
  ): () => void {
    // Initial fetch
    this.getNotifications(userId, platforms, limit).then(callback);
    
    // Set up real-time updates
    const subscriptionId = this.subscribeToNotifications(
      userId,
      platforms,
      () => {
        // Refetch notifications when a new one comes in
        this.getNotifications(userId, platforms, limit).then(callback);
      }
    );
    
    // Set up polling for backup (in case real-time fails)
    const interval = setInterval(() => {
      this.getNotifications(userId, platforms, limit).then(callback);
    }, TIME_CONFIG.NOTIFICATION_CHECK_INTERVAL);
    
    // Return cleanup function
    return () => {
      this.unsubscribeFromNotifications(subscriptionId);
      clearInterval(interval);
    };
  }
}

export default NotificationService; 