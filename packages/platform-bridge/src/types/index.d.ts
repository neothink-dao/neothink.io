export type PlatformSlug = 'hub' | 'neothinkers' | 'ascenders' | 'immortals';
export interface PlatformState {
    currentPlatform: PlatformSlug;
    lastVisited: string;
    preferences: {
        theme: string;
        notifications: boolean;
        language: string;
    };
    recentItems: Array<any>;
    navigation: {
        lastPath: string;
        scrollPosition: number;
        breadcrumbs: Array<string>;
    };
    progress: {
        level: number;
        achievements: Array<any>;
        completedModules: Array<string>;
    };
    lastPath?: string;
    scrollPosition?: number;
    timestamp: string;
    platformData: Record<string, any>;
}
export interface SwitchError {
    code: 'ACCESS_DENIED' | 'SWITCH_FAILED';
    message: string;
    details: string;
}
export interface PlatformAccess {
    userId: string;
    platformSlug: PlatformSlug;
    accessLevel: 'member' | 'admin' | 'visitor';
    grantedAt: string;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
}
export interface PlatformConfig {
    slug: PlatformSlug;
    name: string;
    description: string;
    color: string;
    url: string;
    features: string[];
    requirements?: {
        minLevel?: number;
        invitation?: boolean;
    };
}
export interface UserProgress {
    userId: string;
    platform: PlatformSlug;
    weekNumber: number;
    lastSync?: string;
    sourceProgress?: string;
    sharedAchievements: string[];
    globalLevel: number;
    completedFeatures: string[];
    syncMetadata?: {
        lastSyncFrom?: PlatformSlug;
        syncTimestamp?: string;
        syncStatus?: 'success' | 'failed';
    };
}
//# sourceMappingURL=index.d.ts.map