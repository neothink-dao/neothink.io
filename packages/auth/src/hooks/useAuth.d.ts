import { User, UserResponse as SupabaseUserResponse, AuthError, AuthResponse } from '@supabase/supabase-js';
import type { PlatformSlug } from '@neothink/database';

/**
 * Auth hook properties
 */
export interface UseAuthProps {
    /**
     * Platform identifier
     */
    platformSlug: PlatformSlug;
    /**
     * Optional redirect URL after auth actions
     */
    redirectUrl?: string;
}

// --- BEGIN: UserResponse Type Modernization ---
// Ensure UserResponse matches Supabase SDK and best practice
// Use: { data: { user: User | null }, error: AuthError | null }

export type UserResponse = {
  data: { user: User | null };
  error: AuthError | null;
};

// --- END: UserResponse Type Modernization ---

/**
 * Authentication hook for managing user auth state and operations
 * @param props Configuration properties
 * @returns Authentication state and methods
 */
export declare const useAuth: ({ platformSlug, redirectUrl }: UseAuthProps) => {
    signInWithPassword: (email: string, password: string) => Promise<AuthResponse>;
    signInWithOtp: (email: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<{
        error: AuthError | null;
    }>;
    resetPassword: (email: string) => Promise<{
        error: AuthError | null;
    }>;
    updatePassword: (password: string) => Promise<UserResponse>;
    updateEmail: (email: string) => Promise<UserResponse>;
    user: any;
    session: any;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: any;
    loginAttempts: number;
    lastLoginAttempt: any;
};
export default useAuth;
//# sourceMappingURL=useAuth.d.ts.map