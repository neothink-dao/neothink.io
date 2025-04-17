import { Database } from './types/index';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
export declare const getUser: () => Promise<import("@supabase/supabase-js").AuthUser | null>;
export declare const getUserRole: (userId: string) => Promise<any>;
export type { Database };
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];
