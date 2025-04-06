/**
 * Cross-Platform Notification Service
 * 
 * This service provides a unified way to handle notifications
 * across all Neothink platforms, including in-app notifications,
 * email notifications, and browser push notifications.
 */

import { createClient } from '../supabase/server';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationTarget = 'in_app' | 'email' | 'push' | 'all';

export type Notification = {
  id: string;
  user_id: string;
  tenant_slug: string;
  platform_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
  metadata?: Record<string, any>;
};

/**
 * Create a new notification for a user
 */
export async function createNotification({
  userId,
  tenantSlug,
  platformId,
  title,
  message,
  type = 'info',
  link,
  expiresAt,
  target = 'in_app',
  metadata = {}
}: {
  userId: string;
  tenantSlug: string;
  platformId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  expiresAt?: string;
  target?: NotificationTarget;
  metadata?: Record<string, any>;
}): Promise<string | null> {
  const supabase = createClient();
  
  try {
    // Always create in-app notification
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        tenant_slug: tenantSlug,
        platform_id: platformId,
        title,
        message,
        type,
        link,
        is_read: false,
        expires_at: expiresAt,
        metadata
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    
    // If email notifications are requested, send an email
    if (target === 'email' || target === 'all') {
      // This would integrate with an email service
      await sendEmailNotification({
        userId,
        title,
        message,
        type,
        link,
        platformId
      });
    }
    
    // If push notifications are requested, send a push notification
    if (target === 'push' || target === 'all') {
      // This would integrate with a push notification service
      await sendPushNotification({
        userId,
        title,
        message,
        type,
        link,
        platformId
      });
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications({
  userId,
  tenantSlug,
  platformId,
  limit = 20,
  includeRead = false,
  beforeDate
}: {
  userId: string;
  tenantSlug?: string;
  platformId?: string;
  limit?: number;
  includeRead?: boolean;
  beforeDate?: string;
}): Promise<Notification[]> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!includeRead) {
      query = query.eq('is_read', false);
    }
    
    if (tenantSlug) {
      query = query.eq('tenant_slug', tenantSlug);
    }
    
    if (platformId) {
      query = query.eq('platform_id', platformId);
    }
    
    if (beforeDate) {
      query = query.lt('created_at', beforeDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead({
  notificationIds,
  userId
}: {
  notificationIds: string[] | 'all';
  userId: string;
}): Promise<boolean> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    
    if (notificationIds !== 'all') {
      query = query.in('id', notificationIds);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('Error marking notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return false;
  }
}

/**
 * Delete notifications
 */
export async function deleteNotifications({
  notificationIds,
  userId
}: {
  notificationIds: string[] | 'all';
  userId: string;
}): Promise<boolean> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    
    if (notificationIds !== 'all') {
      query = query.in('id', notificationIds);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('Error deleting notifications:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return false;
  }
}

// Internal helper functions
async function sendEmailNotification({
  userId,
  title,
  message,
  type,
  link,
  platformId
}: {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  platformId: string;
}): Promise<boolean> {
  // This would be implemented using an email service like SendGrid or Amazon SES
  // For now, just log that we would send an email
  console.log(`Would send email to user ${userId}: ${title}`);
  return true;
}

async function sendPushNotification({
  userId,
  title,
  message,
  type,
  link,
  platformId
}: {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  platformId: string;
}): Promise<boolean> {
  // This would be implemented using a push notification service
  // For now, just log that we would send a push notification
  console.log(`Would send push notification to user ${userId}: ${title}`);
  return true;
} 