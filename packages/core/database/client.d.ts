import type { Database } from '@neothink/types';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public" extends keyof Database ? "public" : string & keyof Database, Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any>;
/**
 * Get a server-side Supabase client with the service role key.
 * To be used only in server-side contexts like API routes or getServerSideProps.
 * WARNING: This bypasses RLS and should be used very carefully.
 */
export declare function getServerSupabase(): import("@supabase/supabase-js").SupabaseClient<Database, "public" extends keyof Database ? "public" : string & keyof Database, Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any>;
/**
 * Get an authenticated supabase client with a user's access token.
 * Useful for Server Components or API routes where the client session isn't available.
 */
export declare function getAuthenticatedSupabase(accessToken: string): import("@supabase/supabase-js").SupabaseClient<Database, "public" extends keyof Database ? "public" : string & keyof Database, Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any>;
/**
 * Rate limiting functions using PostgreSQL (requires the rate_limits table)
 *
 * This uses the server-side function we created in our migration:
 * CREATE OR REPLACE FUNCTION public.check_rate_limit(
 *   p_identifier TEXT,
 *   p_max_requests INTEGER DEFAULT 100,
 *   p_window_seconds INTEGER DEFAULT 60
 * ) RETURNS BOOLEAN
 */
/**
 * Check if a request is rate limited
 */
export declare function checkRateLimit(identifier: string, maxRequests?: number, windowSeconds?: number): Promise<boolean>;
export declare const db: {
    from: <T extends keyof Database["public"]["Tables"]>(table: T) => import("@supabase/postgrest-js").PostgrestQueryBuilder<Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any, (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]], string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"], (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]] extends infer T_1 ? T_1 extends (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]] ? T_1 extends {
        Relationships: infer R;
    } ? R : unknown : never : never>;
    rpc: <T extends keyof Database["public"]["Functions"]>(fn: T, args?: Parameters<Database["public"]["Functions"][T]>[0]) => import("@supabase/postgrest-js").PostgrestFilterBuilder<Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any, (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"]]["Returns"] extends any[] ? (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"]]["Returns"][number] extends Record<string, unknown> ? (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"]]["Returns"][number] : never : never, (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"][string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"]]["Returns"], string & keyof (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Functions"], null>;
};
//# sourceMappingURL=client.d.ts.map