import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import { NotificationType } from '../../api/notification-service';
import { formatDistanceToNow } from 'date-fns';

/**
 * Notification icon based on the notification type
 */
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-amber-500" />;
    case 'error':
      return <X className="w-5 h-5 text-red-500" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

export interface NotificationCenterProps {
  maxHeight?: string;
  className?: string;
}

/**
 * Notification Center component
 * Displays a dropdown with user notifications
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  maxHeight = '400px',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } = useNotifications();
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      refresh();
    }
  };
  
  // Handle clicking a notification
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };
  
  // Format notification date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification bell */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-700 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 bg-white rounded-md shadow-lg w-80 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all as read
              </button>
            )}
          </div>
          
          {/* Notification list */}
          <div className={`overflow-y-auto`} style={{ maxHeight }}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`border-b last:border-b-0 p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id!)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <NotificationIcon type={notification.type as NotificationType} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt || '')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full self-start mt-2"></div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 