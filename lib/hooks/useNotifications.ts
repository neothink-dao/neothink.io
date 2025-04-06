import { useCallback, useEffect, useState } from 'react';
import { usePlatform } from './usePlatform';
import { useSupabaseAuth } from './useSupabaseAuth';
import { NotificationService, Notification } from '../api/notification-service';

/**
 * Hook for working with the notification system
 * Provides access to user notifications and notification settings
 */
export function useNotifications() {
  const { platformSlug } = usePlatform();
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Map the database response to our interfaces
  const mapNotifications = (data: any[]): Notification[] => {
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      message: item.message,
      type: item.type,
      link: item.link,
      isRead: item.is_read,
      createdAt: item.created_at,
      expiresAt: item.expires_at,
      metadata: item.metadata
    }));
  };

  // Load notifications for the current user
  const loadNotifications = useCallback(async (options = {}) => {
    if (!user?.id || !platformSlug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await NotificationService.getUserNotifications(
        user.id,
        platformSlug,
        options
      );
      
      if (error) throw error;
      
      if (data) {
        const mappedData = mapNotifications(data);
        setNotifications(mappedData);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  }, [user, platformSlug]);

  // Load unread notification count
  const loadUnreadCount = useCallback(async () => {
    if (!user?.id || !platformSlug) return;
    
    try {
      const { data, error } = await NotificationService.getUserNotifications(
        user.id,
        platformSlug,
        { limit: 1000, includeRead: false }
      );
      
      if (error) throw error;
      
      setUnreadCount(data?.length || 0);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  }, [user, platformSlug]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!platformSlug) return;
    
    try {
      const { error } = await NotificationService.markAsRead(notificationId, platformSlug);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [platformSlug]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id || !platformSlug) return;
    
    try {
      const { error } = await NotificationService.markAllAsRead(user.id, platformSlug);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [user, platformSlug]);

  // Load notifications when the user changes
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, loadNotifications, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
}

export default useNotifications; 