# Cross-Platform Notification System

The Neothink platforms include a unified notification system that enables seamless communication with users across all platforms. This document outlines how to use and extend the notification system.

## Key Features

- **Platform-Specific Notifications**: Each notification is associated with a specific platform.
- **Cross-Platform Visibility**: Users can see notifications from all platforms they have access to.
- **Customizable Notification Types**: Support for info, success, warning, and error notifications.
- **User Preferences**: Users can control notification settings per platform.
- **Expiring Notifications**: Set expiration date for temporary notifications.

## Database Schema

The notification system uses two main tables:

1. **notifications**: Stores all user notifications
2. **notification_settings**: Stores user preferences for notifications

## Using the Notification Service

### Server-Side API

The `NotificationService` class provides methods for working with notifications:

```typescript
import { NotificationService } from 'lib/api/notification-service';

// Create a notification
await NotificationService.createNotification('hub', {
  userId: 'user-uuid',
  title: 'Welcome!',
  message: 'Welcome to the Neothink Hub',
  type: 'success',
  link: '/dashboard'
});

// Other available methods
// NotificationService.getUserNotifications(userId, platformSlug, options)
// NotificationService.markAsRead(notificationId, platformSlug)
// NotificationService.markAllAsRead(userId, platformSlug)
// NotificationService.getNotificationSettings(userId, platformSlug)
// NotificationService.updateNotificationSettings(userId, platformSlug, settings)
```

### Client-Side React Hook

Use the `useNotifications` hook in React components:

```tsx
import { useNotifications } from 'lib/hooks/useNotifications';

function MyComponent() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  } = useNotifications();

  // Use the notifications in your component
}
```

### Notification Component

Include the notification center in your layout:

```tsx
import { NotificationCenter } from 'lib/components/ui/notification-center';

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <NotificationCenter />
      </nav>
    </header>
  );
}
```

## Platform Detection

The notification system automatically detects the current platform using:

1. Domain-based detection (primary)
2. Path-based detection (fallback for local development)

## Best Practices

1. **Keep messages concise**: Notification messages should be clear and to the point.
2. **Use appropriate types**: Info for general updates, success for confirmations, warning for important notices, error for critical issues.
3. **Add links when helpful**: Include a link to direct users to relevant pages.
4. **Set expiration dates**: For time-sensitive notifications, add an expiration date.

## Extending the System

To extend the notification system:

1. Add new notification types to the `NotificationType` type
2. Update database schema if needed with migrations
3. Add delivery channels (email, SMS, etc.) by extending the service

## Future Enhancements

- Push notifications via web push API
- Mobile app notifications
- Email integration
- Scheduled notifications
- Rich content in notifications 