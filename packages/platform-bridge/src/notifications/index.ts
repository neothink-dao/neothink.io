import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { CrossPlatformNotification, NotificationPriority, PlatformSlug } from '../types';

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
        .from('cross_platform_notifications')
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
        .from('cross_platform_notifications')
        .select('*')
        .eq('user_id', userId)
        .contains('target_platforms', platforms)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // Map the database response to our type
      return (data || []).map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        sourcePlatform: notification.source_platform,
        targetPlatforms: notification.target_platforms,
        title: notification.title,
        content: notification.content,
        actionUrl: notification.action_url,
        priority: notification.priority,
        read: notification.read,
        createdAt: notification.created_at
      }));
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
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
        .from('cross_platform_notifications')
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
          table: 'cross_platform_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          const notification = payload.new;
          
          // Check if notification is for one of the user's platforms
          if (
            notification.target_platforms &&
            notification.target_platforms.some((p: PlatformSlug) => platforms.includes(p))
          ) {
            // Convert to our notification type
            const typedNotification: CrossPlatformNotification = {
              id: notification.id,
              userId: notification.user_id,
              sourcePlatform: notification.source_platform,
              targetPlatforms: notification.target_platforms,
              title: notification.title,
              content: notification.content,
              actionUrl: notification.action_url,
              priority: notification.priority,
              read: notification.read,
              createdAt: notification.created_at
            };
            
            // Call the callback
            callback(typedNotification);
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
        .from('cross_platform_notifications')
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
}

export default NotificationService; 