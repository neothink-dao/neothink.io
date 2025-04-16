import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
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
        sameSite: 'Strict' | 'Lax' | 'None';
        path: string;
        domain?: string;
    };
}
/**
 * Generates a cryptographically secure random token using SHA-256
 */
declare function generateToken(): Promise<string>;
/**
 * Stores a CSRF token in the database with additional metadata
 */
declare function storeToken(supabase: SupabaseClient, token: string, userId: string | undefined, config?: CsrfConfig): Promise<void>;
/**
 * Sets CSRF token cookie with secure options
 */
declare function setCsrfCookie(res: NextResponse, token: string, config?: CsrfConfig): void;
/**
 * Validates a CSRF token from a request using double submit cookie pattern
 */
declare function validateToken(req: NextRequest, supabase: SupabaseClient, config?: CsrfConfig): Promise<boolean>;
/**
 * Checks if a request requires CSRF validation
 */
declare function requiresCsrfCheck(req: NextRequest): boolean;
export declare function generateCsrfToken(): string;
export declare function validateCsrfToken(request: NextRequest): Promise<boolean>;
export declare function storeCsrfToken(token: string): Promise<void>;
export { generateToken, storeToken, validateToken, requiresCsrfCheck, setCsrfCookie, type CsrfConfig, };
//# sourceMappingURL=csrf.d.ts.map