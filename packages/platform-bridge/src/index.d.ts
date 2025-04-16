export * from './types';
export { default as NavigationService } from './navigation';
export { default as PreferencesService } from './preferences';
export { default as NotificationService } from './notifications';
export { default as StateSyncService } from './state-sync';
import React from 'react';
import { PlatformSlug } from './types';
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
interface PlatformBridgeProviderProps {
    children: React.ReactNode;
    userId?: string;
    initialPlatform?: PlatformSlug;
}
export declare const PlatformBridgeProvider: React.FC<PlatformBridgeProviderProps>;
export declare const usePlatformBridge: () => PlatformBridgeContextType;
export declare const PlatformSwitcher: React.FC;
//# sourceMappingURL=index.d.ts.map