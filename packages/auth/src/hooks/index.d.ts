import { User, Session, AuthError, AuthResponse, UserResponse } from '@supabase/supabase-js';
import type { PlatformSlug } from '@neothink/database';
// DEPRECATED: Use PlatformSlug from @neothink/database instead
// export type PlatformSlug = 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
/**
 * Custom hook for Supabase authentication
 * @param platformSlug The platform to authenticate against (for metadata)
 * @returns Authentication utilities and state
 */
export declare function useSupabaseAuth(platformSlug?: PlatformSlug): {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: AuthError | null;
    signInWithPassword: (email: string, password: string) => Promise<AuthResponse>;
    signInWithOtp: (email: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string, metadata?: {}) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{
        data: {};
        error: null;
    } | {
        data: null;
        error: AuthError;
    }>;
    updatePassword: (newPassword: string) => Promise<UserResponse>;
    supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
};
/**
 * Hook to check if user has access to a specific platform based on their subscriptions
 * @param platformSlug The platform to check access for
 * @returns Object containing access status and loading state
 */
export declare function usePlatformAccess(platformSlug?: PlatformSlug): {
    hasAccess: boolean;
    loading: boolean;
};
declare const _default: {
    useSupabaseAuth: typeof useSupabaseAuth;
    usePlatformAccess: typeof usePlatformAccess;
};
export default _default;
//# sourceMappingURL=index.d.ts.map