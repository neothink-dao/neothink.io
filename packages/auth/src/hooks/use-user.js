import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            var _a;
            if (error) {
                setError(error);
            }
            else {
                setUser((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            }
            setLoading(false);
        });
        // Listen for auth changes
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
            var _a;
            setUser((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            setLoading(false);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
    };
}
//# sourceMappingURL=use-user.js.map