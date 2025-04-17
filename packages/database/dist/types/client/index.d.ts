import { PlatformSlug } from '../types/models';
import { Database } from '../types/index';
/**
 * Gets a cached Supabase client or creates a new one
 * @returns A Supabase client instance
 */
export declare function getSupabaseClient(): import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
/**
 * Creates a Supabase client with service role key for admin operations
 * @param serviceRoleKey Optional service role key (uses env var if not provided)
 * @returns A Supabase client with admin privileges
 */
export declare function getServiceClient(serviceRoleKey?: string): import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
/**
 * Creates a Supabase client with platform-specific settings
 * @param platformSlug The platform identifier (hub, ascenders, neothinkers, immortals)
 * @param customOptions Additional options to merge with platform-specific settings
 * @returns A configured Supabase client
 */
export declare function createPlatformClient(platformSlug?: PlatformSlug, customOptions?: {}): import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
/**
 * Creates an admin client for server-side operations
 * @returns A Supabase client with admin privileges
 */
export declare function createAdminClient(): import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<Database, "public", any> | undefined;
