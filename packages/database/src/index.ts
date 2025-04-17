import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin, createPlatformClient } from './client/index';

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
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Export createClient for downstream usage
export { createClient } from '@supabase/supabase-js';
export type { SupabaseClient } from '@supabase/supabase-js';

// --- Aggressive root re-exports for all consumer types and values ---
export type {
  SecurityLog,
  SecurityEvent,
  SecurityEventSeverity,
  SecurityEventType,
  PlatformSlug,
  AuthState,
} from './types/models';

export {
  SecurityEventTypes,
  PLATFORM_SLUGS_VALUES as PlatformSlugValues,
  PLATFORM_SLUGS,
  ALL_PLATFORM_SLUGS,
} from './types/models';

// Dummy value to force type emission for all exported types
export const __forceTypeExports = null as unknown as
  | import('./types/models').SecurityEvent
  | import('./types/models').SecurityEventSeverity
  | import('./types/models').SecurityEventType
  | import('./types/models').SecurityLog
  | import('./types/models').PlatformSlug
  | import('./types/models').AuthState;

export { createPlatformClient, createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin } from './client/index';
export { createPlatformClient as default } from './client/index';
