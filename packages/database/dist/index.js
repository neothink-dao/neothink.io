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
export { PLATFORM_SLUGS_VALUES as PlatformSlugValues } from './types/models';
export { PLATFORM_SLUGS } from './types/models';
export { createPlatformClient, createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin } from './client/index';
export { ALL_PLATFORM_SLUGS } from './types/models';
export { createPlatformClient as default } from './client/index';
// Explicitly re-export types for downstream consumers
export * from './types';
export { SecurityEventTypes } from './types';
