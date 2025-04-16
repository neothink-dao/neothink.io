import type { SecurityEvent, SecurityEventSeverity, SecurityEventType } from '@neothink/database';
import { SecurityEventTypes } from '@neothink/database';

// All security event types should now be imported from @neothink/database

export interface SecurityEventOptions {
  event: SecurityEventType;
  severity: SecurityEventSeverity;
  context?: Record<string, any>;
  details?: Record<string, any>;
  userId?: string;
}

export interface RateLimitOptions {
  identifier: string;
  limit: number;
  windowSeconds: number;
}

export interface SecurityHeaders {
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'X-XSS-Protection': string;
  'X-Permitted-Cross-Domain-Policies': string;
  'Content-Security-Policy': string;
  'Strict-Transport-Security'?: string;
}

export interface SecurityMiddlewareConfig {
  rateLimiting?: {
    enabled: boolean;
    defaultLimit: number;
    defaultWindow: number;
    endpoints?: Record<string, RateLimitOptions>;
  };
  securityHeaders?: Partial<SecurityHeaders>;
  logging?: {
    enabled: boolean;
    excludePaths?: string[];
  };
}

export interface SecurityMiddleware {
  (req: NextRequest): Promise<NextResponse>;
  setConfig?: (config: SecurityMiddlewareConfig) => void;
}

export const middleware: SecurityMiddleware;
export function getPlatformFromHost(host: string): string;