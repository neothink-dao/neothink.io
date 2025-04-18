import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { SecurityEventTypes, SecurityEventType, logSecurityEvent } from './securityLogging';
import { createPlatformClient } from '@neothink/database';
import crypto from 'crypto';

/**
 * Methods that require CSRF protection
 */
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Configuration for CSRF protection
 */
interface CsrfConfig {
  tokenTtlHours: number;
  headerName: string;
  cookieName: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    domain?: string;
  };
}

const DEFAULT_CONFIG: Required<CsrfConfig> = {
  tokenTtlHours: 24,
  headerName: 'X-CSRF-Token',
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    domain: process.env.COOKIE_DOMAIN
  }
};

// CSRF token validity duration in seconds (1 hour)
const CSRF_TOKEN_VALIDITY = 3600;

/**
 * Generates a cryptographically secure random token using SHA-256
 */
async function generateToken(): Promise<string> {
  const buffer = crypto.randomBytes(32);
  const timestamp = Date.now().toString();
  const hash = crypto.createHash('sha256');
  
  // Combine random bytes with timestamp for uniqueness
  hash.update(buffer);
  hash.update(timestamp);
  
  return hash.digest('base64');
}

/**
 * Stores a CSRF token in the database with additional metadata
 */
async function storeToken(
  supabase: SupabaseClient,
  token: string,
  userId: string | undefined,
  config: CsrfConfig = DEFAULT_CONFIG
): Promise<void> {
  const { tokenTtlHours = DEFAULT_CONFIG.tokenTtlHours } = config;
  
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + tokenTtlHours);
  
  const tokenHash = crypto.createHash('sha256').update(token).digest('base64');
  
  const { error } = await supabase
    .from('csrf_tokens')
    .insert({
      token_hash: tokenHash,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      created_at: new Date().toISOString()
    });
    
  if (error) {
    console.error('Failed to store CSRF token:', error);
    throw new Error('Failed to store CSRF token');
  }
}

/**
 * Sets CSRF token cookie with secure options
 */
function setCsrfCookie(
  res: NextResponse,
  token: string,
  config: CsrfConfig = DEFAULT_CONFIG
): void {
  const { cookieName, cookieOptions } = config;
  
  // Set cookie with secure options
  res.cookies.set(cookieName, token, {
    ...cookieOptions,
    expires: new Date(Date.now() + CSRF_TOKEN_VALIDITY * 1000)
  });
}

/**
 * Validates a CSRF token from a request using double submit cookie pattern
 */
async function validateToken(
  req: NextRequest,
  supabase: SupabaseClient,
  config: CsrfConfig = DEFAULT_CONFIG
): Promise<boolean> {
  const { headerName, cookieName } = config;
  
  const headerToken = req.headers.get(headerName);
  const cookieToken = req.cookies.get(cookieName)?.value;
  
  // Check if both tokens exist and match (double submit cookie validation)
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    await logCsrfViolation(supabase, req, {
      type: SecurityEventTypes.CSRF_TOKEN_MISMATCH as SecurityEventType,
      severity: 'high',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        hasHeaderToken: !!headerToken,
        hasCookieToken: !!cookieToken,
        tokensMatch: headerToken === cookieToken
      },
    });
    return false;
  }
  
  // Validate token in database
  const tokenHash = crypto.createHash('sha256').update(headerToken).digest('base64');
  
  const { data, error } = await supabase
    .from('csrf_tokens')
    .select('expires_at, user_agent')
    .eq('token_hash', tokenHash)
    .single();
    
  if (error || !data) {
    await logCsrfViolation(supabase, req, {
      type: SecurityEventTypes.CSRF_TOKEN_INVALID as SecurityEventType,
      severity: 'high',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        error: error?.message,
      },
    });
    return false;
  }
  
  // Check expiration
  if (new Date(data.expires_at) < new Date()) {
    await logCsrfViolation(supabase, req, {
      type: SecurityEventTypes.CSRF_TOKEN_EXPIRED as SecurityEventType,
      severity: 'medium',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        expires_at: data.expires_at,
      },
    });
    return false;
  }
  
  // Validate user agent hasn't changed (additional security check)
  const currentUserAgent = req.headers.get('user-agent');
  if (data.user_agent && currentUserAgent !== data.user_agent) {
    await logCsrfViolation(supabase, req, {
      type: SecurityEventTypes.CSRF_TOKEN_USER_AGENT_MISMATCH as SecurityEventType,
      severity: 'high',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        storedUserAgent: data.user_agent,
        currentUserAgent,
      },
    });
    return false;
  }
  
  // Clean up used token
  await supabase
    .from('csrf_tokens')
    .delete()
    .eq('token_hash', tokenHash);
    
  return true;
}

/**
 * Checks if a request requires CSRF validation
 */
function requiresCsrfCheck(req: NextRequest): boolean {
  return CSRF_METHODS.includes(req.method);
}

/**
 * Logs CSRF violation attempts
 */
type LogCsrfViolationDetails = {
  type: SecurityEventType;
  severity: string;
  context: Record<string, any>;
  details?: Record<string, any>;
};

async function logCsrfViolation(
  supabase: any,
  req: any,
  details: LogCsrfViolationDetails
): Promise<void> {
  // Only pass required properties to logSecurityEvent, let it handle timestamps and IDs internally
  await logSecurityEvent(supabase, {
    type: details.type,
    severity: details.severity,
    context: details.context,
  } as any);
}

// Generate a CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Validate CSRF token
export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  // Only validate POST/PUT/DELETE/PATCH requests
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    return true;
  }

  const token = request.headers.get('x-csrf-token');
  if (!token) {
    return false;
  }

  const supabase = createPlatformClient('hub');
  const now = Math.floor(Date.now() / 1000);

  // Clean up expired tokens
  await supabase
    .from('csrf_tokens')
    .delete()
    .lt('expires_at', now);

  // Check if token exists and is valid
  const { data: tokenData } = await supabase
    .from('csrf_tokens')
    .select('token')
    .eq('token', token)
    .gte('expires_at', now)
    .single();

  return !!tokenData;
}

// Store a new CSRF token
export async function storeCsrfToken(token: string): Promise<void> {
  const supabase = createPlatformClient('hub');
  const now = Math.floor(Date.now() / 1000);
  
  await supabase
    .from('csrf_tokens')
    .insert({
      token,
      expires_at: now + CSRF_TOKEN_VALIDITY
    });
}

export {
  generateToken,
  storeToken,
  validateToken,
  requiresCsrfCheck,
  setCsrfCookie,
  type CsrfConfig,
};