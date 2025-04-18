import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
// DEPRECATED: Use PlatformSlug from @neothink/database instead
// export type PlatformSlug = 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
// Create a Supabase client (will be initialized lazily)
const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }
    return createClient(supabaseUrl, supabaseKey);
};
/**
 * Custom hook for Supabase authentication
 * @param platformSlug The platform to authenticate against (for metadata)
 * @returns Authentication utilities and state
 */
export function useSupabaseAuth(platformSlug = 'hub') {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [supabase] = useState(() => getSupabaseClient());
    // Initialize auth state
    useEffect(() => {
        setLoading(true);
        // Get the current session and user
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);
                setUser((currentSession === null || currentSession === void 0 ? void 0 : currentSession.user) || null);
                // Set up auth state change listener
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
                    setSession(newSession);
                    setUser((newSession === null || newSession === void 0 ? void 0 : newSession.user) || null);
                    setError(null);
                });
                return () => {
                    subscription.unsubscribe();
                };
            }
            catch (e) {
                console.error('Error initializing auth:', e);
                setError(e);
            }
            finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, [supabase.auth]);
    // Sign in with email and password
    const signInWithPassword = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (response.error) {
                setError(response.error);
            }
            return response;
        }
        catch (e) {
            setError(e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [supabase.auth]);
    // Sign in with magic link (passwordless)
    const signInWithOtp = useCallback(async (email) => {
        setLoading(true);
        try {
            const response = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (response.error) {
                setError(response.error);
            }
            return response;
        }
        catch (e) {
            setError(e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [supabase.auth]);
    // Sign up with email and password
    const signUp = useCallback(async (email, password, metadata = {}) => {
        setLoading(true);
        try {
            const response = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: Object.assign({ platform_slug: platformSlug }, metadata),
                },
            });
            if (response.error) {
                setError(response.error);
            }
            return response;
        }
        catch (e) {
            setError(e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [supabase.auth, platformSlug]);
    // Sign out
    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                setError(error);
                throw error;
            }
        }
        catch (e) {
            setError(e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [supabase.auth]);
    // Reset password
    const resetPassword = useCallback(async (email) => {
        setLoading(true);
        try {
            const response = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (response.error) {
                setError(response.error);
            }
            return response;
        }
        catch (e) {
            setError(e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [supabase.auth]);
    // Update password
    const updatePassword = useCallback(async (newPassword) => {
        setLoading(true);
        try {
            const response = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (response.error) {
                setError(response.error);
            }
            return response;
        }
        catch (e) {
            setError(e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [supabase.auth]);
    return {
        user,
        session,
        loading,
        error,
        signInWithPassword,
        signInWithOtp,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        supabase,
    };
}
/**
 * Hook to check if user has access to a specific platform based on their subscriptions
 * @param platformSlug The platform to check access for
 * @returns Object containing access status and loading state
 */
export function usePlatformAccess(platformSlug = 'hub') {
    const { user, loading: authLoading } = useSupabaseAuth(platformSlug);
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (authLoading)
            return;
        const checkAccess = async () => {
            setLoading(true);
            // If no user, definitely no access
            if (!user) {
                setHasAccess(false);
                setLoading(false);
                return;
            }
            try {
                // Check app_subscriptions in user metadata
                const appMetadata = user.app_metadata || {};
                const userMetadata = user.user_metadata || {};
                const subscriptions = appMetadata.app_subscriptions ||
                    userMetadata.app_subscriptions ||
                    [];
                const hasSubscription = Array.isArray(subscriptions) &&
                    subscriptions.includes(platformSlug);
                setHasAccess(hasSubscription);
            }
            catch (error) {
                console.error('Error checking platform access:', error);
                setHasAccess(false);
            }
            finally {
                setLoading(false);
            }
        };
        checkAccess();
    }, [user, authLoading, platformSlug]);
    return { hasAccess, loading: loading || authLoading };
}
export default {
    useSupabaseAuth,
    usePlatformAccess,
};
//# sourceMappingURL=index.js.map