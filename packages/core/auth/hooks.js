import { useEffect, useState } from 'react';
import { supabase } from '../database/client';
export function useAuth() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            var _a;
            setSession(session);
            setUser((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            setLoading(false);
        });
        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            var _a;
            setSession(session);
            setUser((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    return { user, session, loading };
}
export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            setProfile(null);
            setLoading(false);
            return;
        }
        async function loadProfile() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (error)
                    throw error;
                setProfile(data);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load profile'));
            }
            finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    return { profile, loading, error };
}
//# sourceMappingURL=hooks.js.map