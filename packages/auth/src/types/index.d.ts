import { NextRequest, NextResponse } from 'next/server';

export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  type: string;
  severity: SecurityEventSeverity;
  userId?: string;
  context: Record<string, any>;
  suspiciousActivity?: Record<string, any>;
}

export interface SecurityEventOptions {
  event: string;
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
  (req: NextRequest): Promise<Response>;
  setConfig?: (config: SecurityMiddlewareConfig) => void;
}

export const middleware: SecurityMiddleware;
export function getPlatformFromHost(host: string): string; 