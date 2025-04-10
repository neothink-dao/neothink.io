import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { SecurityEvent, SecurityEventSeverity } from '../index';
import { createClient } from '@neothink/database';
import crypto from 'crypto';

/**
 * Methods that require CSRF protection
 */
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Configuration for CSRF protection
 */
interface CsrfConfig {
  // How long tokens are valid for (default: 24 hours)
  tokenTtlHours?: number;
  // Header to look for the token in
  headerName?: string;
  // Cookie name for the token
  cookieName?: string;
}

const DEFAULT_CONFIG: Required<CsrfConfig> = {
  tokenTtlHours: 24,
  headerName: 'X-CSRF-Token',
  cookieName: 'csrf-token',
};

// CSRF token validity duration in seconds (1 hour)
const CSRF_TOKEN_VALIDITY = 3600;

/**
 * Generates a cryptographically secure random token
 */
async function generateToken(): Promise<string> {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Buffer.from(buffer).toString('base64');
}

/**
 * Stores a CSRF token in the database
 */
async function storeToken(
  supabase: SupabaseClient,
  token: string,
  userId: string | undefined,
  config: CsrfConfig = {}
): Promise<void> {
  const { tokenTtlHours = DEFAULT_CONFIG.tokenTtlHours } = config;
  
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + tokenTtlHours);
  
  const { error } = await supabase
    .from('csrf_tokens')
    .insert({
      token,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
    });
    
  if (error) {
    console.error('Failed to store CSRF token:', error);
    throw new Error('Failed to store CSRF token');
  }
}

/**
 * Validates a CSRF token from a request
 */
async function validateToken(
  req: NextRequest,
  supabase: SupabaseClient,
  config: CsrfConfig = {}
): Promise<boolean> {
  const { headerName = DEFAULT_CONFIG.headerName } = config;
  
  const token = req.headers.get(headerName);
  if (!token) {
    await logCsrfViolation(supabase, req, {
      event: 'csrf_token_missing',
      severity: 'high',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        headers: Object.fromEntries(req.headers),
      },
    });
    return false;
  }
  
  const { data, error } = await supabase
    .from('csrf_tokens')
    .select()
    .eq('token', token)
    .single();
    
  if (error || !data) {
    await logCsrfViolation(supabase, req, {
      event: 'csrf_token_invalid',
      severity: 'high',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        token,
        error: error?.message,
      },
    });
    return false;
  }
  
  if (new Date(data.expires_at) < new Date()) {
    await logCsrfViolation(supabase, req, {
      event: 'csrf_token_expired',
      severity: 'medium',
      context: {
        path: req.nextUrl.pathname,
        method: req.method,
      },
      details: {
        token,
        expires_at: data.expires_at,
      },
    });
    return false;
  }
  
  // Clean up used token
  await supabase
    .from('csrf_tokens')
    .delete()
    .eq('token', token);
    
  return true;
}

/**
 * Checks if a request requires CSRF validation
 */
function requiresCsrfCheck(req: NextRequest): boolean {
  return CSRF_METHODS.includes(req.method);
}

/**
 * Logs a security event to the database
 */
async function logSecurityEvent(
  supabase: SupabaseClient,
  event: SecurityEvent
): Promise<void> {
  try {
    await supabase
      .from('security_events')
      .insert(event);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

async function logCsrfViolation(
  supabase: SupabaseClient,
  req: NextRequest,
  details: Record<string, any>
): Promise<void> {
  const securityEvent: SecurityEvent = {
    event: 'csrf_violation',
    severity: 'high',
    context: {
      path: req.nextUrl.pathname,
      method: req.method,
      headers: Object.fromEntries(req.headers),
    },
    details,
  };

  await supabase.from('security_events').insert(securityEvent);
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

  const supabase = createClient('hub');
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
  const supabase = createClient('hub');
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
  type CsrfConfig,
}; 