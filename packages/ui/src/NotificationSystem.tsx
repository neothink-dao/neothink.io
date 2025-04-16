import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Database } from '@neothink/database-types';

interface Notification {
  id: string;
  user_id: string;
  app_name: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  metadata: any;
  created_at: string;
}

interface NotificationSystemProps {
  userId: string;
  appName?: string;
  maxNotifications?: number;
  autoHideDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  userId,
  appName,
  maxNotifications = 5,
  autoHideDuration = 5000,
  position = 'top-right',
  className = '',
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const supabase = useSupabaseClient<Database>();

  // Position styles
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  // Fetch recent unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(maxNotifications);
      
      if (appName) {
        query = query.eq('app_name', appName);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      setNotifications(data || []);
    };
    
    // Initial fetch
    fetchNotifications();
    
    // Set up real-time listener
    const subscription = supabase
      .channel('notifications_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}${appName ? ` AND app_name=eq.${appName}` : ''}`
      }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev].slice(0, maxNotifications));
        
        // Add to visible notifications
        setVisibleNotifications(prev => [newNotification, ...prev].slice(0, maxNotifications));
        
        // Set timer to auto-mark as read
        setTimeout(() => {
          markAsRead(newNotification.id);
        }, autoHideDuration);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, userId, appName, maxNotifications, autoHideDuration]);

  // Show notifications when they first load
  useEffect(() => {
    setVisibleNotifications(notifications);
    
    // Set timers to mark notifications as read
    notifications.forEach(notification => {
      setTimeout(() => {
        markAsRead(notification.id);
      }, autoHideDuration);
    });
  }, [notifications, autoHideDuration]);

  // Function to mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Update in Supabase
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      // Remove from visible notifications
      setVisibleNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle click on notification
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate to link if provided
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'feedback_response':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'suggestion':
        return (
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col ${positionStyles[position]} space-y-2 ${className}`}>
      <AnimatePresence>
        {visibleNotifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full"
            onClick={() => handleNotificationClick(notification)}
          >
            <div className={`p-4 flex items-start ${notification.link ? 'cursor-pointer' : ''}`}>
              <div className="flex-shrink-0 mr-3">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(notification.created_at).toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(notification.id);
                }}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook to mark a notification as read
export function useMarkNotificationRead() {
  const supabase = useSupabaseClient<Database>();
  
  return async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };
}

// Hook to fetch all notifications (useful for notification center)
export function useNotifications(userId: string, appName?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient<Database>();
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (appName) {
          query = query.eq('app_name', appName);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setNotifications(data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time listener
    const subscription = supabase
      .channel(`user_notifications_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}${appName ? ` AND app_name=eq.${appName}` : ''}`
      }, () => {
        fetchNotifications();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, userId, appName]);
  
  return { notifications, loading, error };
} 