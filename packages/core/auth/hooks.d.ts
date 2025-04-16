import { User, Session } from '@supabase/supabase-js';
export declare function useAuth(): {
    user: User | null;
    session: Session | null;
    loading: boolean;
};
export declare function useProfile(): {
    profile: any;
    loading: boolean;
    error: Error | null;
};
//# sourceMappingURL=hooks.d.ts.map