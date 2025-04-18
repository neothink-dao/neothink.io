import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
// Environment variable schema
const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});
// Validate environment variables
const env = envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
// Create Supabase client
export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// Export createClient for downstream usage
export { createClient } from '@supabase/supabase-js';
export { __SecurityEventType, __SecurityEventSeverity, __PlatformSlug, __SecurityLog, __SecurityEvent } from './types/models';
// Value exports
export { SecurityEventTypes, PLATFORM_SLUGS_VALUES as PlatformSlugValues, PLATFORM_SLUGS, ALL_PLATFORM_SLUGS } from './types/models';
// Dummy value to force type emission for all exported types
export const __forceTypeExports = null;
export { createPlatformClient, createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin } from './client/index';
export { createPlatformClient as default } from './client/index';
// Force TypeScript to emit all exported types in the declaration file
export const __forceTypeExports2 = null;
export * from './types/index';
export * from './types/models';
export * from './serverClient';
// Dummy value export to force TypeScript to emit all exported types
export const __forceExport = null;
