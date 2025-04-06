import { supabaseAdmin } from '../supabase/admin-client';
import { createClient, PlatformSlug } from '../supabase/client-factory';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead?: boolean;
  createdAt?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  typesDisabled: NotificationType[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

/**
 * Cross-platform notification service
 * Provides functionality to send and manage notifications across all platforms
 */
export class NotificationService {
  /**
   * Create a new notification for a user
   * @param platformSlug The platform sending the notification
   * @param notification The notification details
   * @returns The created notification or error
   */
  static async createNotification(
    platformSlug: PlatformSlug,
    notification: Notification
  ) {
    try {
      // Transform the notification object to match the database schema
      const notificationData = {
        user_id: notification.userId,
        tenant_slug: this.getPlatformTenant(platformSlug),
        platform_id: platformSlug,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
        is_read: notification.isRead || false,
        expires_at: notification.expiresAt,
        metadata: notification.metadata || {}
      };

      // Use the admin client to create notifications
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all notifications for a user
   * @param userId The user ID
   * @param platformSlug The platform to get notifications for
   * @param options Query options (limit, offset, includeRead)
   */
  static async getUserNotifications(
    userId: string,
    platformSlug: PlatformSlug,
    options: { limit?: number; offset?: number; includeRead?: boolean } = {}
  ) {
    const { limit = 20, offset = 0, includeRead = false } = options;
    const client = createClient(platformSlug);

    try {
      let query = client
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Filter out read notifications if not explicitly included
      if (!includeRead) {
        query = query.eq('is_read', false);
      }

      // Apply pagination after all filters
      const { data, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }
  }

  /**
   * Mark notification as read
   * @param notificationId The notification ID to mark as read
   * @param platformSlug The platform slug
   */
  static async markAsRead(notificationId: string, platformSlug: PlatformSlug) {
    const client = createClient(platformSlug);

    try {
      const { data, error } = await client
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { data: null, error };
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param userId The user ID
   * @param platformSlug The platform slug
   */
  static async markAllAsRead(userId: string, platformSlug: PlatformSlug) {
    const client = createClient(platformSlug);

    try {
      const { data, error } = await client
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { data: null, error };
    }
  }

  /**
   * Get notification settings for a user
   * @param userId The user ID
   * @param platformSlug The platform slug
   */
  static async getNotificationSettings(userId: string, platformSlug: PlatformSlug) {
    const client = createClient(platformSlug);
    const tenantSlug = this.getPlatformTenant(platformSlug);

    try {
      const { data, error } = await client
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_slug', tenantSlug)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the "no rows returned" error, which is expected if no settings exist
        throw error;
      }

      // If no settings exist, create default settings
      if (!data) {
        return this.createDefaultSettings(userId, platformSlug);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return { data: null, error };
    }
  }

  /**
   * Update notification settings for a user
   * @param userId The user ID
   * @param platformSlug The platform slug
   * @param settings The updated settings
   */
  static async updateNotificationSettings(
    userId: string,
    platformSlug: PlatformSlug,
    settings: Partial<NotificationSettings>
  ) {
    const client = createClient(platformSlug);
    const tenantSlug = this.getPlatformTenant(platformSlug);

    try {
      // Transform the settings to match the database schema
      const settingsData = {
        email_enabled: settings.emailEnabled,
        push_enabled: settings.pushEnabled,
        in_app_enabled: settings.inAppEnabled,
        types_disabled: settings.typesDisabled,
        quiet_hours_start: settings.quietHoursStart,
        quiet_hours_end: settings.quietHoursEnd,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(settingsData).forEach(key => 
        settingsData[key] === undefined && delete settingsData[key]
      );

      const { data, error } = await client
        .from('notification_settings')
        .update(settingsData)
        .eq('user_id', userId)
        .eq('tenant_slug', tenantSlug)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return { data: null, error };
    }
  }

  /**
   * Helper to create default notification settings for a user
   * @param userId The user ID
   * @param platformSlug The platform slug
   */
  private static async createDefaultSettings(userId: string, platformSlug: PlatformSlug) {
    const client = createClient(platformSlug);
    const tenantSlug = this.getPlatformTenant(platformSlug);

    try {
      const defaultSettings = {
        user_id: userId,
        tenant_slug: tenantSlug,
        email_enabled: true,
        push_enabled: true,
        in_app_enabled: true,
        types_disabled: [],
      };

      const { data, error } = await client
        .from('notification_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating default notification settings:', error);
      return { data: null, error };
    }
  }

  /**
   * Helper to get the tenant slug from the platform slug
   * @param platformSlug The platform slug
   */
  private static getPlatformTenant(platformSlug: PlatformSlug): string {
    // Map platform slugs to tenant slugs
    const tenantMap: Record<PlatformSlug, string> = {
      hub: 'neothink',
      ascenders: 'ascenders',
      neothinkers: 'neothinkers',
      immortals: 'immortals'
    };

    return tenantMap[platformSlug] || platformSlug;
  }
} 