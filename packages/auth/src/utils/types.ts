import type { 
  PlatformSlug, 
  SecurityEvent, 
  SecurityEventSeverity, 
  SecurityEventType, 
  SecurityEventTypes 
} from '@neothink/database';

// All security event types should now be imported from @neothink/database
// Deprecated type definitions have been removed.

/**
 * CSRF protection options
 */
export interface CsrfOptions {
  headerName?: string;
  cookieName?: string;
  tokenTtlHours?: number;
}