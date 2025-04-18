// All security event types must be imported from @neothink/database
// Deprecated type definitions and re-exports have been removed.

// Only keep interfaces/types unique to this package, if any.

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