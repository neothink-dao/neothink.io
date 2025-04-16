import { SupabaseClient } from '@supabase/supabase-js';
import type { SecurityEvent, SecurityEventTypes, SecurityEventType } from '@neothink/database';

/**
 * Log a security event to the Supabase database
 *
 * @param supabase Supabase client instance
 * @param event Security event to log
 * @returns Success status
 */
export declare function logSecurityEvent(supabase: SupabaseClient, event: SecurityEvent): Promise<boolean>;

// DEPRECATED: All security event types must be imported from @neothink/database
// Remove any local definitions below.

//# sourceMappingURL=securityLogging.d.ts.map