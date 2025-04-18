import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin, createPlatformClient } from './client/index';
import type {
  SecurityLog as _SecurityLog,
  SecurityEvent as _SecurityEvent,
  SecurityEventSeverity as _SecurityEventSeverity,
  SecurityEventType as _SecurityEventType,
  PlatformSlug as _PlatformSlug,
  AuthState as _AuthState
} from './types/models';

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

// Explicitly re-export types for TS barrel compatibility
export type SecurityLog = _SecurityLog;
export type SecurityEvent = _SecurityEvent;
export type SecurityEventSeverity = _SecurityEventSeverity;
export type SecurityEventType = _SecurityEventType;
export type PlatformSlug = _PlatformSlug;
export type AuthState = _AuthState;

export { __SecurityEventType, __SecurityEventSeverity, __PlatformSlug, __SecurityLog, __SecurityEvent } from './types/models';

// Value exports
export { SecurityEventTypes, PLATFORM_SLUGS_VALUES as PlatformSlugValues, PLATFORM_SLUGS, ALL_PLATFORM_SLUGS } from './types/models';

// Dummy value to force type emission for all exported types
export const __forceTypeExports: SecurityEvent | SecurityEventSeverity | SecurityEventType | SecurityLog | PlatformSlug | AuthState = null as any;

export { createPlatformClient, createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin } from './client/index';
export { createPlatformClient as default } from './client/index';

// Force TypeScript to emit all exported types in the declaration file
export const __forceTypeExports2: SecurityEvent | SecurityEventSeverity | SecurityEventType | SecurityLog | PlatformSlug | AuthState = null as any;

export * from './types/index';
export * from './types/models';
export type { Database } from './types/index';

export * from './serverClient';

// Dummy value export to force TypeScript to emit all exported types
export const __forceExport = null;
