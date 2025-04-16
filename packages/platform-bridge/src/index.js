// Export types
export * from './types';
// Export modules
export { default as NavigationService } from './navigation';
export { default as PreferencesService } from './preferences';
export { default as NotificationService } from './notifications';
export { default as StateSyncService } from './state-sync';
// React context provider for platform bridge
import React, { createContext, useContext, useEffect, useState } from 'react';
import NavigationService from './navigation';
import PreferencesService from './preferences';
import NotificationService from './notifications';
import StateSyncService from './state-sync';
// Create context
const PlatformBridgeContext = createContext(undefined);
// Platform detection helper
const detectCurrentPlatform = () => {
    if (typeof window === 'undefined')
        return 'hub';
    const hostname = window.location.hostname;
    if (hostname.includes('immortals'))
        return 'immortals';
    if (hostname.includes('ascenders'))
        return 'ascenders';
    if (hostname.includes('neothinkers'))
        return 'neothinkers';
    return 'hub';
};
// Provider component
export const PlatformBridgeProvider = ({ children, userId, initialPlatform }) => {
    // Detect platform if not provided
    const detectedPlatform = initialPlatform || detectCurrentPlatform();
    // State
    const [currentPlatform, setCurrentPlatform] = useState(detectedPlatform);
    const [preferences, setPreferences] = useState({});
    const [platformState, setPlatformState] = useState({});
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    // Initialize state on mount and when userId changes
    useEffect(() => {
        if (!userId)
            return;
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
        let notificationSubscriptionId = null;
        if (userId) {
            notificationSubscriptionId = NotificationService.subscribeToNotifications(userId, [currentPlatform], (_notification) => {
                // Update unread count
                loadNotificationCount();
            });
        }
        return () => {
            // Clean up notification subscription
            if (notificationSubscriptionId) {
                NotificationService.unsubscribeFromNotifications(notificationSubscriptionId);
            }
        };
    }, [userId, currentPlatform]);
    // Navigation handler
    const navigateToPlatform = (platform, path) => {
        if (platform === currentPlatform)
            return;
        // If user is logged in, save the current state before navigating
        if (userId) {
            StateSyncService.savePlatformState(userId, currentPlatform, platformState);
        }
        // Navigate to the selected platform
        const url = NavigationService.navigateWithStatePreservation(platform, path);
        window.location.href = url;
    };
    // Save preferences
    const savePreferences = async (newPreferences) => {
        if (!userId)
            return false;
        // Merge with current preferences
        const mergedPreferences = Object.assign(Object.assign({}, preferences), newPreferences);
        setPreferences(mergedPreferences);
        // Save to database
        return PreferencesService.saveUserPreferences(userId, currentPlatform, mergedPreferences);
    };
    // Save state
    const saveState = async (newState) => {
        if (!userId)
            return false;
        // Merge with current state
        const mergedState = Object.assign(Object.assign({}, platformState), newState);
        setPlatformState(mergedState);
        // Save to database
        return StateSyncService.savePlatformState(userId, currentPlatform, mergedState);
    };
    // Transfer state to another platform
    const transferStateToOtherPlatform = async (targetPlatform) => {
        if (!userId)
            return false;
        // Save current state first
        await saveState(platformState);
        // Transfer state
        return StateSyncService.transferState(userId, currentPlatform, targetPlatform);
    };
    // Context value
    const value = {
        currentPlatform,
        navigateToPlatform,
        preferences,
        savePreferences,
        unreadNotificationCount,
        state: platformState,
        saveState,
        transferStateToOtherPlatform
    };
    return (<PlatformBridgeContext.Provider value={value}>
      {children}
    </PlatformBridgeContext.Provider>);
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
export const PlatformSwitcher = () => {
    const { currentPlatform, navigateToPlatform } = usePlatformBridge();
    return (<div className="platform-switcher">
      <select value={currentPlatform} onChange={(e) => navigateToPlatform(e.target.value)} className="platform-selector">
        <option value="hub">Hub</option>
        <option value="immortals">Immortals</option>
        <option value="ascenders">Ascenders</option>
        <option value="neothinkers">Neothinkers</option>
      </select>
    </div>);
};
//# sourceMappingURL=index.js.map