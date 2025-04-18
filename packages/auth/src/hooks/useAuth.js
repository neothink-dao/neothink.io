import { useCallback, useEffect, useState } from 'react';
import { createPlatformClient } from '@neothink/database';
/**
 * Authentication hook for managing user auth state and operations
 * @param props Configuration properties
 * @returns Authentication state and methods
 */
export const useAuth = ({ platformSlug, redirectUrl }) => {
    const initialState = {
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        loginAttempts: 0,
        lastLoginAttempt: null,
    };
    const [state, setState] = useState(initialState);
    // Initialize Supabase client with the platform slug
    const supabase = createPlatformClient(platformSlug);
    // Password validation
    const validatePassword = (password) => {
        const minLength = 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar;
    };
    // Rate limiting check
    const checkRateLimit = () => {
        const MAX_ATTEMPTS = 5;
        const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
        if (state.loginAttempts >= MAX_ATTEMPTS) {
            const timeSinceLastAttempt = state.lastLoginAttempt
                ? Date.now() - state.lastLoginAttempt
                : 0;
            if (timeSinceLastAttempt < LOCKOUT_DURATION) {
                const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
                throw new Error(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
            }
            else {
                // Reset attempts after lockout period
                setState((prev) => (Object.assign(Object.assign({}, prev), { loginAttempts: 0, lastLoginAttempt: null })));
            }
        }
        return true;
    };
    /**
     * Sign in with email and password
     */
    const signInWithPassword = useCallback(async (email, password) => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts + 1, lastLoginAttempt: Date.now() })));
        try {
            // Check rate limiting
            checkRateLimit();
            const response = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (response.error) {
                setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: response.error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
                return response;
            }
            // Reset login attempts on successful login
            setState({
                user: response.data.user,
                session: response.data.session,
                isLoading: false,
                isAuthenticated: !!response.data.session,
                error: null,
                loginAttempts: 0,
                lastLoginAttempt: null
            });
            return response;
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { data: { user: null, session: null }, error: authError };
        }
    }, [supabase.auth]);
    /**
     * Sign in with magic link
     */
    const signInWithOtp = useCallback(async (email) => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
        try {
            const response = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: redirectUrl }
            });
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: response.error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return response;
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { data: { user: null, session: null }, error: authError };
        }
    }, [supabase.auth, redirectUrl]);
    /**
     * Sign up with email and password
     */
    const signUp = useCallback(async (email, password) => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
        try {
            const response = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: redirectUrl,
                    data: { platforms: [platformSlug] }
                }
            });
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: response.error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return response;
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { data: { user: null, session: null }, error: authError };
        }
    }, [supabase.auth, redirectUrl, platformSlug]);
    /**
     * Sign out the current user
     */
    const signOut = useCallback(async () => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
                return { error };
            }
            setState({
                user: null,
                session: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
                loginAttempts: 0,
                lastLoginAttempt: null
            });
            return { error: null };
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { error: authError };
        }
    }, [supabase.auth]);
    /**
     * Reset password
     */
    const resetPassword = useCallback(async (email) => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl
            });
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { error };
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { error: authError };
        }
    }, [supabase.auth, redirectUrl]);
    /**
     * Update user password
     */
    const updatePassword = useCallback(async (password) => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
        // Validate password strength
        if (!validatePassword(password)) {
            const error = new Error('Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters.');
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { data: { user: null }, error };
        }
        try {
            const response = await supabase.auth.updateUser({
                password
            });
            if (response.error) {
                setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: response.error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
                return response;
            }
            setState((prev) => (Object.assign(Object.assign({}, prev), { user: response.data.user, isLoading: false, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return response;
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { data: { user: null }, error: authError };
        }
    }, [supabase.auth]);
    /**
     * Update user email
     */
    const updateEmail = useCallback(async (email) => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
        try {
            const response = await supabase.auth.updateUser({
                email
            }, {
                emailRedirectTo: redirectUrl
            });
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: response.error, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return response;
        }
        catch (error) {
            const authError = error;
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: false, error: authError, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            return { data: { user: null }, error: authError };
        }
    }, [supabase.auth, redirectUrl]);
    async function generateCaptchaToken() {
        return 'dummy-captcha-token';
    }
    // Initialize user session on mount
    useEffect(() => {
        const initializeAuth = async () => {
            setState((prev) => (Object.assign(Object.assign({}, prev), { isLoading: true, loginAttempts: prev.loginAttempts, lastLoginAttempt: prev.lastLoginAttempt })));
            try {
                // Check for existing session
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    setState({
                        user: null,
                        session: null,
                        isLoading: false,
                        isAuthenticated: false,
                        error,
                        loginAttempts: 0,
                        lastLoginAttempt: null
                    });
                    return;
                }
                if (data.session) {
                    const { data: userData } = await supabase.auth.getUser();
                    setState({
                        user: userData.user,
                        session: data.session,
                        isLoading: false,
                        isAuthenticated: true,
                        error: null,
                        loginAttempts: 0,
                        lastLoginAttempt: null
                    });
                }
                else {
                    setState({
                        user: null,
                        session: null,
                        isLoading: false,
                        isAuthenticated: false,
                        error: null,
                        loginAttempts: 0,
                        lastLoginAttempt: null
                    });
                }
            }
            catch (error) {
                setState({
                    user: null,
                    session: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: error,
                    loginAttempts: 0,
                    lastLoginAttempt: null
                });
            }
        };
        initializeAuth();
        // Subscribe to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                const { data: userData } = await supabase.auth.getUser();
                setState({
                    user: userData.user,
                    session,
                    isLoading: false,
                    isAuthenticated: true,
                    error: null,
                    loginAttempts: 0,
                    lastLoginAttempt: null
                });
            }
            else if (event === 'SIGNED_OUT') {
                setState({
                    user: null,
                    session: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: null,
                    loginAttempts: 0,
                    lastLoginAttempt: null
                });
            }
        });
        // Cleanup subscription
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth, platformSlug]);
    return Object.assign(Object.assign({}, state), { signInWithPassword,
        signInWithOtp,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateEmail });
};
export default useAuth;
//# sourceMappingURL=useAuth.js.map