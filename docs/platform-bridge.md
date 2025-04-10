# Platform Bridge Documentation

![Platform Bridge](https://via.placeholder.com/800x400?text=Platform+Bridge+Diagram)

## Overview

The Platform Bridge is a foundational component of the Neothink ecosystem that enables seamless interaction between the different Neothink platforms (Hub, Ascenders, Immortals, and Neothinkers). It provides a unified approach to:

- Cross-platform state management
- Synchronized user preferences
- Seamless navigation between platforms
- Real-time notifications across platforms
- User activity tracking and synchronization

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    PLATFORM BRIDGE                          │
├────────────┬────────────┬─────────────────┬───────────────┤
│    State   │  Prefs &   │   Navigation    │ Notifications │
│    Sync    │  Settings  │    Service      │    System     │
├────────────┴────────────┴─────────────────┴───────────────┤
│                    DATABASE INTEGRATION                     │
└────────────────────────────────────────────────────────────┘
```

## Core Features

### 1. Cross-Platform Navigation

Enables users to move between platforms while maintaining context and state.

```tsx
import { usePlatformBridge, PlatformSwitcher } from '@neothink/platform-bridge';

// Using the hook to navigate programmatically
function MyComponent() {
  const { navigateToPlatform } = usePlatformBridge();
  
  const handleClick = () => {
    // Navigate to Immortals platform, preserving state
    navigateToPlatform('immortals', '/dashboard');
  };
  
  return (
    <button onClick={handleClick}>
      Switch to Immortals
    </button>
  );
}

// Using the pre-built platform switcher component
function Navigation() {
  return (
    <nav>
      <PlatformSwitcher /> {/* Renders platform dropdown */}
      {/* Other navigation items */}
    </nav>
  );
}
```

### 2. State Synchronization

Preserves user state across different platforms to create a continuous experience.

```tsx
import { usePlatformBridge } from '@neothink/platform-bridge';

function StateExample() {
  const { state, saveState, transferStateToOtherPlatform } = usePlatformBridge();
  
  // Read platform-specific state
  const currentProgress = state.courseProgress || 0;
  
  // Save state to current platform
  const updateProgress = async (newProgress) => {
    await saveState({
      courseProgress: newProgress,
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Transfer current state to another platform
  const moveToAscenders = async () => {
    await transferStateToOtherPlatform('ascenders');
    // Now navigate to Ascenders platform
  };
  
  return (
    <div>
      <p>Current progress: {currentProgress}%</p>
      <button onClick={() => updateProgress(currentProgress + 10)}>
        Update Progress
      </button>
      <button onClick={moveToAscenders}>
        Continue in Ascenders
      </button>
    </div>
  );
}
```

### 3. Preference Management

Manages user preferences across all platforms with automatic synchronization.

```tsx
import { usePlatformBridge } from '@neothink/platform-bridge';

function PreferencesManager() {
  const { preferences, savePreferences } = usePlatformBridge();
  
  // Read current preferences
  const darkMode = preferences.darkMode || false;
  const fontSize = preferences.fontSize || 'medium';
  
  // Update preferences
  const toggleDarkMode = async () => {
    await savePreferences({
      darkMode: !darkMode
    });
  };
  
  const updateFontSize = async (size) => {
    await savePreferences({
      fontSize: size
    });
  };
  
  return (
    <div className="preferences-panel">
      <div className="preference-item">
        <label>Dark Mode</label>
        <input 
          type="checkbox" 
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </div>
      
      <div className="preference-item">
        <label>Font Size</label>
        <select 
          value={fontSize}
          onChange={(e) => updateFontSize(e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
}
```

### 4. Notification System

Delivers real-time notifications to users across all platforms.

```tsx
import { usePlatformBridge } from '@neothink/platform-bridge';
import { NotificationService } from '@neothink/platform-bridge';

// Component to display notifications
function NotificationsPanel() {
  const { unreadNotificationCount } = usePlatformBridge();
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Fetch notifications on mount
    const fetchNotifications = async () => {
      const userNotifications = await NotificationService.getUserNotifications(
        userId, 
        ['hub', 'immortals'] // Platforms to include
      );
      setNotifications(userNotifications);
    };
    
    fetchNotifications();
  }, [userId, unreadNotificationCount]);
  
  return (
    <div className="notifications-panel">
      <h3>Notifications ({unreadNotificationCount})</h3>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <span className="platform-badge">{notification.platform}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Sending a notification from server code
async function sendUserNotification(userId, message) {
  await NotificationService.createNotification({
    userId,
    platform: 'hub',
    title: 'New Content Available',
    message: 'Check out the latest Neothink article on integrated thinking',
    type: 'content',
    data: { contentId: '12345' }
  });
}
```

## Implementation Details

### Database Schema

The Platform Bridge relies on these core tables:

#### Platform Preferences

```sql
CREATE TABLE platform_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Platform State

```sql
CREATE TABLE platform_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Platform Notifications

```sql
CREATE TABLE platform_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Platform Detection

The system automatically detects the current platform based on the domain:

```typescript
// From platform-bridge/src/index.tsx
const detectCurrentPlatform = (): PlatformSlug => {
  if (typeof window === 'undefined') return 'hub';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('immortals')) return 'immortals';
  if (hostname.includes('ascenders')) return 'ascenders';
  if (hostname.includes('neothinkers')) return 'neothinkers';
  return 'hub';
};
```

### React Context Provider

The Platform Bridge is implemented as a React context provider:

```tsx
// Simplified example
import { PlatformBridgeProvider, usePlatformBridge } from '@neothink/platform-bridge';

function App({ user }) {
  return (
    <PlatformBridgeProvider 
      userId={user?.id}
      initialPlatform="hub"
    >
      <AppContent />
    </PlatformBridgeProvider>
  );
}

function AppContent() {
  const {
    currentPlatform,
    navigateToPlatform,
    preferences,
    savePreferences,
    unreadNotificationCount,
    state,
    saveState
  } = usePlatformBridge();
  
  // Use platform bridge functionality
}
```

## Advanced Usage

### 1. Platform-Specific Navigation Items

Generate platform-specific navigation items:

```tsx
import { NavigationService, PlatformSlug } from '@neothink/platform-bridge';

function SideNavigation() {
  const { currentPlatform } = usePlatformBridge();
  const [navigationItems, setNavigationItems] = useState([]);
  
  useEffect(() => {
    // Get common navigation items (shared across platforms)
    const commonItems = NavigationService.getCommonNavigation(currentPlatform);
    
    // Add platform-specific items
    let platformItems = [];
    
    switch(currentPlatform) {
      case 'hub':
        platformItems = [
          { id: 'dashboard', title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
          { id: 'content', title: 'Content Library', url: '/content', icon: 'library' }
        ];
        break;
      case 'immortals':
        platformItems = [
          { id: 'protocols', title: 'Health Protocols', url: '/protocols', icon: 'health' },
          { id: 'tracking', title: 'Health Tracking', url: '/tracking', icon: 'chart' }
        ];
        break;
      // Other platforms...
    }
    
    setNavigationItems([...commonItems, ...platformItems]);
  }, [currentPlatform]);
  
  return (
    <nav className="side-navigation">
      {navigationItems.map(item => (
        <a key={item.id} href={item.url} className="nav-item">
          <span className={`icon icon-${item.icon}`}></span>
          <span className="title">{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
```

### 2. State Transfer Patterns

Transfer specific state elements when switching platforms:

```typescript
import { StateSyncService } from '@neothink/platform-bridge';

// Transfer only specific state keys
async function transferUserProgress(userId) {
  await StateSyncService.transferState(
    userId,
    'hub',           // Source platform
    'ascenders',     // Target platform
    ['courseProgress', 'lastActivity'] // Only transfer these keys
  );
}

// Reset state of a branch
async function resetPlatformState(userId, platform) {
  await StateSyncService.clearState(userId);
  
  // Initialize with default state
  await StateSyncService.savePlatformState(
    userId,
    platform,
    {
      onboarded: false,
      lastVisit: new Date().toISOString(),
      preferences: { darkMode: false, fontSize: 'medium' }
    }
  );
}
```

### 3. Recent Items Tracking

Track recently accessed items across platforms:

```typescript
import { StateSyncService } from '@neothink/platform-bridge';

// Add item to recent items list
async function trackRecentItem(userId, platform, itemId) {
  await StateSyncService.addRecentItem(
    userId,
    platform,
    itemId,
    10 // Maximum number of recent items to keep
  );
}

// Display recent items from current platform
function RecentItemsList() {
  const { state, currentPlatform } = usePlatformBridge();
  const recentItems = state.recentItems || [];
  
  // Fetch full item details based on IDs
  useEffect(() => {
    if (recentItems.length > 0) {
      fetchItemDetails(recentItems);
    }
  }, [recentItems]);
  
  return (
    <div className="recent-items">
      <h3>Recently Viewed</h3>
      <ul>
        {itemDetails.map(item => (
          <li key={item.id}>
            <a href={`/${item.type}/${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Best Practices

### Performance Considerations

1. **Optimize State Size**: Keep state objects small and only store necessary data
2. **Batch Updates**: Group multiple state changes into a single update
3. **Use Local Storage Caching**: The platform bridge caches data in localStorage for performance
4. **Lazy Loading**: Only load data when needed, not all upfront

### Security Best Practices

1. **Data Validation**: Validate all data before storing in platform state
2. **User Authentication**: Always verify user authentication before accessing platform bridge functions
3. **Row-Level Security**: Use Supabase RLS policies to restrict data access
4. **Sensitive Data**: Never store sensitive information in preferences or state

### Debugging and Troubleshooting

#### Common Issues

1. **State Not Syncing**
   - Check that the user is authenticated
   - Verify the platform slug is correct
   - Check the browser console for errors

2. **Navigation Issues**
   - Ensure URLs are correctly configured in PLATFORM_URLS constant
   - Check that the user has access to the target platform

3. **Missing Preferences**
   - Verify that preferences were saved correctly
   - Check if the user ID matches across platforms

#### Debugging Tools

```typescript
// Enable debug mode
import { StateSyncService } from '@neothink/platform-bridge';

// Log state changes
StateSyncService.enableDebugMode(true);

// Get raw state from database
const rawState = await StateSyncService.getRawState(userId);
console.log(rawState);
```

## API Reference

### PlatformBridgeProvider

| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Child components |
| `userId` | string | Current user ID |
| `initialPlatform` | PlatformSlug | Initial platform, defaults to auto-detection |

### usePlatformBridge Hook

| Property | Type | Description |
|----------|------|-------------|
| `currentPlatform` | PlatformSlug | Currently active platform |
| `navigateToPlatform` | (platform: PlatformSlug, path?: string) => void | Navigate to another platform |
| `preferences` | Record<string, any> | User preferences |
| `savePreferences` | (prefs: Record<string, any>) => Promise<boolean> | Save preferences |
| `unreadNotificationCount` | number | Count of unread notifications |
| `state` | Record<string, any> | Platform state |
| `saveState` | (state: Record<string, any>) => Promise<boolean> | Save platform state |
| `transferStateToOtherPlatform` | (target: PlatformSlug) => Promise<boolean> | Transfer state |

### NavigationService

| Method | Description |
|--------|-------------|
| `navigateToPlatform(platform, path?, context?)` | Generate URL for platform navigation |
| `getCommonNavigation(currentPlatform)` | Get common navigation items |
| `storeLastLocation(platform, path)` | Store last visited location |
| `getLastLocation(platform)` | Get last visited location |
| `detectCurrentPlatform()` | Detect current platform from URL |
| `navigateWithStatePreservation(platform, path?, preserveState?)` | Navigate preserving state |

### StateSyncService

| Method | Description |
|--------|-------------|
| `savePlatformState(userId, platform, state)` | Save platform state |
| `getPlatformState(userId)` | Get all platform state |
| `getInitialPlatformState(userId, platform)` | Get platform-specific state |
| `transferState(userId, fromPlatform, toPlatform, stateKeys?)` | Transfer state |
| `clearState(userId)` | Clear all state |
| `addRecentItem(userId, platform, itemId, maxItems?)` | Add to recent items |

### NotificationService

| Method | Description |
|--------|-------------|
| `createNotification(notification)` | Create a new notification |
| `getUserNotifications(userId, platforms?, limit?)` | Get user notifications |
| `markAsRead(notificationId)` | Mark notification as read |
| `markAllAsRead(userId, platforms?)` | Mark all notifications as read |
| `getUnreadCount(userId, platforms?)` | Get unread notification count |
| `subscribeToNotifications(userId, platforms?, callback)` | Subscribe to real-time updates |
| `unsubscribeFromNotifications(subscriptionId)` | Unsubscribe from updates |

## Integration Examples

### Next.js App Router Integration

```tsx
// app/layout.tsx
import { PlatformBridgeProvider } from '@neothink/platform-bridge';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  return (
    <html lang="en">
      <body>
        <PlatformBridgeProvider userId={userId}>
          {children}
        </PlatformBridgeProvider>
      </body>
    </html>
  );
}
```

### User Settings Page

```tsx
// app/settings/page.tsx
'use client';

import { usePlatformBridge } from '@neothink/platform-bridge';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { preferences, savePreferences, currentPlatform } = usePlatformBridge();
  const [formValues, setFormValues] = useState(preferences);
  
  useEffect(() => {
    setFormValues(preferences);
  }, [preferences]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await savePreferences(formValues);
    showToast('Preferences saved successfully');
  };
  
  return (
    <div className="settings-page">
      <h1>User Settings - {currentPlatform.toUpperCase()}</h1>
      <p>These settings will sync across all Neothink platforms</p>
      
      <form onSubmit={handleSubmit}>
        {/* Preference fields */}
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}
```

## Roadmap

Upcoming features for the Platform Bridge:

- **Advanced Analytics**: Track user behavior across platforms
- **Platform-Specific Extensions**: Allow platforms to register custom functionality
- **Offline Support**: Better offline capabilities with sync
- **Feature Flags**: Control feature visibility across platforms
- **Enhanced Navigation**: Deeper linking between platforms

---

## Additional Resources

- [Platform Bridge API Reference](https://wiki.neothink.io/platform-bridge/api)
- [Database Schema Documentation](https://wiki.neothink.io/database/schema)
- [Cross-Platform UX Guidelines](https://wiki.neothink.io/design/cross-platform)
- [Authentication Integration](https://wiki.neothink.io/engineering/auth) 