import { Database } from '../types/supabase';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
export declare const getServiceRoleClient: () => import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
export declare const db: {
    users: import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, "users", unknown>;
    profiles: import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, "profiles", unknown>;
    sessions: import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, "sessions", unknown>;
};
export declare class SupabaseError extends Error {
    code: string;
    details?: any | undefined;
    constructor(message: string, code: string, details?: any | undefined);
}
export declare const withRateLimit: (key: string, limit: number, window: number) => Promise<boolean>;
//# sourceMappingURL=supabase.d.ts.map