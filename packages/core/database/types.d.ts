import { Database } from '@neothink/types';
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];
export type Users = Tables['users']['Row'];
export type Profiles = Tables['profiles']['Row'];
export type Content = Tables['content']['Row'];
export type Progress = Tables['progress']['Row'];
export type Achievements = Tables['achievements']['Row'];
export type AnalyticsEvents = Tables['analytics_events']['Row'];
export type UserAchievements = Tables['user_achievements']['Row'];
export type Platform = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
export declare const RLS_POLICIES: {
    USERS: {
        SELECT: string;
        INSERT: string;
        UPDATE: string;
        DELETE: string;
    };
    PROFILES: {
        SELECT: string;
        INSERT: string;
        UPDATE: string;
    };
    CONTENT: {
        SELECT: string;
    };
    PROGRESS: {
        SELECT: string;
        INSERT: string;
        UPDATE: string;
    };
    ACHIEVEMENTS: {
        SELECT: string;
    };
    USER_ACHIEVEMENTS: {
        SELECT: string;
        INSERT: string;
    };
    ANALYTICS: {
        INSERT: string;
        SELECT: string;
    };
};
//# sourceMappingURL=types.d.ts.map