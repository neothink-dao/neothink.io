// RLS Policies
export const RLS_POLICIES = {
    USERS: {
        SELECT: 'authenticated users can select their own data',
        INSERT: 'authenticated users can insert their own data',
        UPDATE: 'authenticated users can update their own data',
        DELETE: 'authenticated users can delete their own data',
    },
    PROFILES: {
        SELECT: 'profiles are viewable by authenticated users',
        INSERT: 'users can insert their own profile',
        UPDATE: 'users can update their own profile',
    },
    CONTENT: {
        SELECT: 'content is viewable by authenticated users with platform access',
    },
    PROGRESS: {
        SELECT: 'users can view their own progress',
        INSERT: 'users can update their own progress',
        UPDATE: 'users can update their own progress',
    },
    ACHIEVEMENTS: {
        SELECT: 'achievements are viewable by authenticated users',
    },
    USER_ACHIEVEMENTS: {
        SELECT: 'users can view their own achievements',
        INSERT: 'system can insert user achievements',
    },
    ANALYTICS: {
        INSERT: 'events are insertable by authenticated users',
        SELECT: 'events are viewable by admins',
    },
};
//# sourceMappingURL=types.js.map