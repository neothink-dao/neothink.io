// Export types
export * from './types';

// Export modules
export { default as NavigationService } from './navigation';
export { default as PreferencesService } from './preferences';
export { default as NotificationService } from './notifications';
export { default as StateSyncService } from './state-sync';

// React context provider for platform bridge
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlatformSlug, PlatformState } from './types';
import NavigationService from './navigation';
import PreferencesService from './preferences';
import NotificationService from './notifications';
import StateSyncService from './state-sync';

interface PlatformBridgeContextType {
  currentPlatform: PlatformSlug;
  navigateToPlatform: (platform: PlatformSlug, path?: string) => void;
  preferences: Record<string, any>;
  savePreferences: (preferences: Record<string, any>) => Promise<boolean>;
  unreadNotificationCount: number;
  state: Record<string, any>;
  saveState: (state: Record<string, any>) => Promise<boolean>;
  transferStateToOtherPlatform: (targetPlatform: PlatformSlug) => Promise<boolean>;
}

// Create context
const PlatformBridgeContext = createContext<PlatformBridgeContextType | undefined>(
  undefined
);

// Platform detection helper
const detectCurrentPlatform = (): PlatformSlug => {
  if (typeof window === 'undefined') return 'hub';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('immortals')) return 'immortals';
  if (hostname.includes('ascenders')) return 'ascenders';
  if (hostname.includes('neothinkers')) return 'neothinkers';
  return 'hub';
};

// Props for the provider
interface PlatformBridgeProviderProps {
  children: React.ReactNode;
  userId?: string;
  initialPlatform?: PlatformSlug;
}

// Provider component
export const PlatformBridgeProvider: React.FC<PlatformBridgeProviderProps> = ({
  children,
  userId,
  initialPlatform
}) => {
  // Detect platform if not provided
  const detectedPlatform = initialPlatform || detectCurrentPlatform();
  
  // State
  const [currentPlatform, setCurrentPlatform] = useState<PlatformSlug>(detectedPlatform);
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [platformState, setPlatformState] = useState<Record<string, any>>({});
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  
  // Initialize state on mount and when userId changes
  useEffect(() => {
    if (!userId) return;
    
    // Load preferences
    const loadPreferences = async () => {
      const prefs = await PreferencesService.getUserPreferences(userId, currentPlatform);
      setPreferences(prefs);
    };
    
    // Load platform state
    const loadState = async () => {
      const state = await StateSyncService.getInitialPlatformState(userId, currentPlatform);
      setPlatformState(state);
    };
    
    // Load unread notification count
    const loadNotificationCount = async () => {
      const count = await NotificationService.getUnreadCount(userId, [currentPlatform]);
      setUnreadNotificationCount(count);
    };
    
    loadPreferences();
    loadState();
    loadNotificationCount();
    
    // Subscribe to notifications if user is logged in
    let notificationSubscriptionId: string | null = null;
    
    if (userId) {
      notificationSubscriptionId = NotificationService.subscribeToNotifications(
        userId,
        [currentPlatform],
        (_notification) => {
          // Update unread count
          loadNotificationCount();
        }
      );
    }
    
    return () => {
      // Clean up notification subscription
      if (notificationSubscriptionId) {
        NotificationService.unsubscribeFromNotifications(notificationSubscriptionId);
      }
    };
  }, [userId, currentPlatform]);
  
  // Navigation handler
  const navigateToPlatform = (platform: PlatformSlug, path?: string) => {
    if (platform === currentPlatform) return;
    
    // If user is logged in, save the current state before navigating
    if (userId) {
      StateSyncService.savePlatformState(userId, currentPlatform, platformState);
    }
    
    // Navigate to the selected platform
    const url = NavigationService.navigateWithStatePreservation(platform, path);
    window.location.href = url;
  };
  
  // Save preferences
  const savePreferences = async (newPreferences: Record<string, any>): Promise<boolean> => {
    if (!userId) return false;
    
    // Merge with current preferences
    const mergedPreferences = { ...preferences, ...newPreferences };
    setPreferences(mergedPreferences);
    
    // Save to database
    return PreferencesService.saveUserPreferences(
      userId,
      currentPlatform,
      mergedPreferences
    );
  };
  
  // Save state
  const saveState = async (newState: Record<string, any>): Promise<boolean> => {
    if (!userId) return false;
    
    // Merge with current state
    const mergedState = { ...platformState, ...newState };
    setPlatformState(mergedState);
    
    // Save to database
    return StateSyncService.savePlatformState(
      userId,
      currentPlatform,
      mergedState
    );
  };
  
  // Transfer state to another platform
  const transferStateToOtherPlatform = async (targetPlatform: PlatformSlug): Promise<boolean> => {
    if (!userId) return false;
    
    // Save current state first
    await saveState(platformState);
    
    // Transfer state
    return StateSyncService.transferState(
      userId,
      currentPlatform,
      targetPlatform
    );
  };
  
  // Context value
  const value: PlatformBridgeContextType = {
    currentPlatform,
    navigateToPlatform,
    preferences,
    savePreferences,
    unreadNotificationCount,
    state: platformState,
    saveState,
    transferStateToOtherPlatform
  };
  
  return (
    <PlatformBridgeContext.Provider value={value}>
      {children}
    </PlatformBridgeContext.Provider>
  );
};

// Hook for using the platform bridge
export const usePlatformBridge = () => {
  const context = useContext(PlatformBridgeContext);
  
  if (context === undefined) {
    throw new Error('usePlatformBridge must be used within a PlatformBridgeProvider');
  }
  
  return context;
};

// Export a ready-to-use platform switcher component
export const PlatformSwitcher: React.FC = () => {
  const { currentPlatform, navigateToPlatform } = usePlatformBridge();
  
  return (
    <div className="platform-switcher">
      <select
        value={currentPlatform}
        onChange={(e) => navigateToPlatform(e.target.value as PlatformSlug)}
        className="platform-selector"
      >
        <option value="hub">Hub</option>
        <option value="immortals">Immortals</option>
        <option value="ascenders">Ascenders</option>
        <option value="neothinkers">Neothinkers</option>
      </select>
    </div>
  );
}; 