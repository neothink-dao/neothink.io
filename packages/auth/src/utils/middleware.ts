import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@neothink/database';
import { PlatformSlug } from '@neothink/database/src/types/models';
import { SupabaseClient } from '@supabase/supabase-js';
import { SecurityEvent, SecurityEventTypes, SecurityEventSeverity, SecurityEventType } from './types';

// Static asset paths that should skip middleware
const staticAssetPaths = [
  '/_next/',
  '/static/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

/**
 * Gets platform slug from host
 */
export function getPlatformFromHost(host: string): PlatformSlug {
  if (host.includes('ascenders')) return 'ascenders';
  if (host.includes('immortals')) return 'immortals';
  if (host.includes('neothinkers')) return 'neothinkers';
  return 'hub';
}

/**
 * Logs a security event to the database
 */
async function logSecurityEvent(
  supabase: SupabaseClient,
  event: SecurityEvent
) {
  try {
    await supabase.from('security_events').insert({
      event_type: event.eventType,
      severity: event.severity,
      context: event.context,
      details: event.details,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * Checks if a request should be rate limited
 * 
 * @param supabase - Supabase client
 * @param identifier - Unique identifier for the rate limit (e.g. ip:endpoint)
 * @param limit - Maximum number of requests allowed in the window
 * @param windowSeconds - Time window in seconds
 * @returns true if request should be rate limited
 */
async function checkRateLimit(
  supabase: SupabaseClient,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - (windowSeconds * 1000));
    
    // Clean up old rate limit entries
    await supabase
      .from('rate_limits')
      .delete()
      .lt('window_start', windowStart.toISOString());
    
    // Get current count
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('count')
      .eq('identifier', identifier)
      .gte('window_start', windowStart.toISOString())
      .single();
    
    if (!existing) {
      // First request in window
      await supabase.from('rate_limits').insert({
        identifier,
        count: 1,
        window_start: windowStart.toISOString(),
        window_seconds: windowSeconds
      });
      return false;
    }
    
    if (existing.count >= limit) {
      return true;
    }
    
    // Increment count
    await supabase
      .from('rate_limits')
      .update({ count: existing.count + 1 })
      .eq('identifier', identifier);
    
    return false;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return false; // Fail open if rate limiting fails
  }
}

/**
 * Detects suspicious activity in requests
 */
async function detectSuspiciousActivity(
  req: NextRequest,
  supabase: SupabaseClient,
  reqContext: any
): Promise<Record<string, any> | null> {
  const path = req.nextUrl.pathname;
  const query = Object.fromEntries(req.nextUrl.searchParams);
  const method = req.method;
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const clientIpHeader = req.headers.get('x-forwarded-for');
  const clientIp = clientIpHeader ? clientIpHeader.split(',')[0].trim() : 'unknown';
  
  // Common attack patterns
  const sqlInjectionPatterns = [
    /(%27)|(')|(--)|(#)/i,
    /(%3D)|(=)[^\n]*((%27)|(')|(")|(%22)|(;))/i,
    /(%27)|(')|(%22)/i,
    /(%6F)|(o)|(%4F)|(%09)|(%0D)|(%0A)/i,
    /union[\s]*select/i,
    /exec[\s]*\(/i
  ];
  
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/i,
    /javascript:[^\s]*/i,
    /onerror=[^\s]*/i,
    /onload=[^\s]*/i,
    /eval\([^)]*\)/i,
    /expression\([^)]*\)/i
  ];
  
  const pathTraversalPatterns = [
    /\.\.[\/\\]/i,
    /\/etc\/[^\s]*/i,
    /\/var\/[^\s]*/i,
    /\/usr\/[^\s]*/i,
    /\/root\/[^\s]*/i,
    /\/proc\/[^\s]*/i
  ];
  
  // Check query parameters and path for attack patterns
  const queryString = JSON.stringify(query).toLowerCase();
  const pathString = path.toLowerCase();
  
  // Check for SQL injection
  const sqlInjection = sqlInjectionPatterns.some(pattern => 
    pattern.test(queryString) || pattern.test(pathString)
  );
  
  // Check for XSS
  const xss = xssPatterns.some(pattern => 
    pattern.test(queryString) || pattern.test(pathString)
  );
  
  // Check for path traversal
  const pathTraversal = pathTraversalPatterns.some(pattern => 
    pattern.test(pathString)
  );
  
  // Check for suspicious user agent
  const suspiciousUserAgent = !userAgent || userAgent === 'unknown' || 
    /^(curl|wget|postman|insomnia)/i.test(userAgent);
  
  // Check request rate from IP
  const ipRequestCount = await supabase
    .from('security_events')
    .select('count', { count: 'exact' })
    .eq('request_ip', clientIp)
    .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
    .single();
  
  const highRequestRate = (ipRequestCount?.count || 0) > 100; // More than 100 requests per minute
  
  // Return null if no suspicious activity detected
  if (!sqlInjection && !xss && !pathTraversal && !suspiciousUserAgent && !highRequestRate) {
    return null;
  }
  
  // Return details about suspicious activity
  return {
    sqlInjection,
    xss,
    pathTraversal,
    suspiciousUserAgent,
    highRequestRate,
    userAgent,
    clientIp,
    requestPath: path,
    requestMethod: method,
    queryParams: query
  };
}

interface SecurityEventOptions {
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  details?: Record<string, any>;
  userId?: string;
}

/**
 * Validates a CSP nonce to ensure it meets security requirements
 */
function validateNonce(nonce: string): boolean {
  // Nonce should be base64 encoded and at least 16 bytes
  const base64Regex = /^[A-Za-z0-9+/=]{24,}$/;
  return base64Regex.test(nonce);
}

/**
 * Sets comprehensive security headers for all responses
 */
function setSecurityHeaders(response: NextResponse): void {
  // Generate a random nonce for CSP
  const nonceBuffer = new Uint8Array(16);
  crypto.getRandomValues(nonceBuffer);
  const nonceBase64 = Buffer.from(nonceBuffer).toString('base64');
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Strict CSP with nonce
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonceBase64 + "' 'strict-dynamic'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "block-all-mixed-content",
    "upgrade-insecure-requests"
  ];
  
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Store nonce in response object for use in templates
  (response as any).__cspNonce = nonceBase64;
}

export async function middleware(req: NextRequest) {
  // Skip middleware for static assets
  const path = req.nextUrl.pathname;
  if (staticAssetPaths.some(prefix => path.startsWith(prefix))) {
    return new Response(null);
  }
  
  // Initialize response that we may modify
  const response = new Response(null);
  
  try {
    // Get platform from request
    const platformSlug = getPlatformFromHost(req.headers.get('host') || '');
    
    // Request context for logging
    const reqContext = {
      platformSlug,
      userId: undefined,
      isAuthenticated: false,
      requestPath: path,
    };
    
    // Initialize Supabase client
    const supabase = createClient(platformSlug);
    
    // Check for suspicious activity
    const isSuspicious = await detectSuspiciousActivity(req, supabase, reqContext);
    if (isSuspicious) {
      await logSecurityEvent(supabase, {
        eventType: SecurityEventTypes.SUSPICIOUS_ACTIVITY,
        severity: 'high',
        context: reqContext,
        details: { patterns: isSuspicious }
      });
      return new Response('Forbidden', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    // Apply rate limiting for sensitive endpoints
    if (path.startsWith('/api/auth') || path.startsWith('/api/admin')) {
      const identifier = `${platformSlug}:${req.ip}:${path}`;
      const isRateLimited = await checkRateLimit(supabase, identifier, 100, 3600); // 100 requests per hour
      
      if (isRateLimited) {
        await logSecurityEvent(supabase, {
          eventType: SecurityEventTypes.RATE_LIMIT_EXCEEDED,
          severity: 'medium',
          context: reqContext,
          details: { ip: req.ip }
        });
        return new Response('Too Many Requests', { 
          status: 429,
          headers: {
            'Content-Type': 'text/plain',
            'Retry-After': '3600'
          }
        });
      }
    }
    
    // Set security headers
    setSecurityHeaders(response);
    
    // Log successful request
    await logSecurityEvent(supabase, {
      eventType: SecurityEventTypes.INVALID_REQUEST,
      severity: 'low',
      context: reqContext,
      details: { path: req.nextUrl.pathname }
    });
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}