export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export { createClient } from '@supabase/supabase-js';
export type { SupabaseClient } from '@supabase/supabase-js';
export type { SecurityLog, SecurityEvent, SecurityEventSeverity, SecurityEventType, PlatformSlug, AuthState } from './types/models';
export { SecurityEventTypes, PLATFORM_SLUGS_VALUES as PlatformSlugValues, PLATFORM_SLUGS, ALL_PLATFORM_SLUGS } from './types/models';
export declare const __forceTypeExports2: import("./types/models").SecurityEvent | import("./types/models").SecurityEventSeverity | import("./types/models").SecurityEventType | import("./types/models").SecurityLog | import("./types/models").PlatformSlug | import("./types/models").AuthState;
export { createPlatformClient, createAdminClient, getSupabaseClient, getServiceClient, supabaseAdmin } from './client/index';
export { createPlatformClient as default } from './client/index';
//# sourceMappingURL=index.d.ts.map