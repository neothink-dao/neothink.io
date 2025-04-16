import { createPlatformClient } from '@neothink/database';
import crypto from 'crypto';
/**
 * Methods that require CSRF protection
 */
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const DEFAULT_CONFIG = {
    tokenTtlHours: 24,
    headerName: 'X-CSRF-Token',
    cookieName: 'csrf-token',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        domain: process.env.COOKIE_DOMAIN
    }
};
// CSRF token validity duration in seconds (1 hour)
const CSRF_TOKEN_VALIDITY = 3600;
/**
 * Generates a cryptographically secure random token using SHA-256
 */
async function generateToken() {
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
async function storeToken(supabase, token, userId, config = DEFAULT_CONFIG) {
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
function setCsrfCookie(res, token, config = DEFAULT_CONFIG) {
    const { cookieName, cookieOptions } = config;
    // Set cookie with secure options
    res.cookies.set(cookieName, token, Object.assign(Object.assign({}, cookieOptions), { expires: new Date(Date.now() + CSRF_TOKEN_VALIDITY * 1000) }));
}
/**
 * Validates a CSRF token from a request using double submit cookie pattern
 */
async function validateToken(req, supabase, config = DEFAULT_CONFIG) {
    var _a;
    const { headerName, cookieName } = config;
    const headerToken = req.headers.get(headerName);
    const cookieToken = (_a = req.cookies.get(cookieName)) === null || _a === void 0 ? void 0 : _a.value;
    // Check if both tokens exist and match (double submit cookie validation)
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        await logCsrfViolation(supabase, req, {
            event: headerToken ? 'csrf_token_mismatch' : 'csrf_token_missing',
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
            event: 'csrf_token_invalid',
            severity: 'high',
            context: {
                path: req.nextUrl.pathname,
                method: req.method,
            },
            details: {
                error: error === null || error === void 0 ? void 0 : error.message,
            },
        });
        return false;
    }
    // Check expiration
    if (new Date(data.expires_at) < new Date()) {
        await logCsrfViolation(supabase, req, {
            event: 'csrf_token_expired',
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
            event: 'csrf_token_user_agent_mismatch',
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
function requiresCsrfCheck(req) {
    return CSRF_METHODS.includes(req.method);
}
/**
 * Logs CSRF violation attempts
 */
async function logCsrfViolation(supabase, req, details) {
    const securityEvent = {
        event: details.event,
        severity: details.severity,
        context: Object.assign(Object.assign({}, details.context), { ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || 'unknown' }),
        details: details.details,
    };
    try {
        await supabase.from('security_events').insert(securityEvent);
    }
    catch (error) {
        console.error('Failed to log CSRF violation:', error);
    }
}
// Generate a CSRF token
export function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}
// Validate CSRF token
export async function validateCsrfToken(request) {
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
export async function storeCsrfToken(token) {
    const supabase = createPlatformClient('hub');
    const now = Math.floor(Date.now() / 1000);
    await supabase
        .from('csrf_tokens')
        .insert({
        token,
        expires_at: now + CSRF_TOKEN_VALIDITY
    });
}
export { generateToken, storeToken, validateToken, requiresCsrfCheck, setCsrfCookie, };
//# sourceMappingURL=csrf.js.map