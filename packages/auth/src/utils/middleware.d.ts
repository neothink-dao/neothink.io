import { NextRequest, NextResponse } from 'next/server';
import { PlatformSlug } from '@neothink/database';
import { CsrfOptions } from './types';
import { SupabaseClient } from '@supabase/supabase-js';
/**
 * Extracts platform slug from hostname
 */
export declare function getPlatformFromHost(host?: string | null): PlatformSlug | null;
/**
 * Sets comprehensive security headers for all responses
 */
export declare function setSecurityHeaders(req: NextRequest, res: Response): Response;
export default function middleware(req: NextRequest): Promise<Response>;
export declare function handleRateLimit(req: NextRequest, res: NextResponse, platform: PlatformSlug, supabase: SupabaseClient): Promise<Response | null>;
export declare function ensureCsrfToken(req: NextRequest, platform: PlatformSlug, csrfOptions: CsrfOptions | undefined, supabase: SupabaseClient): boolean;
//# sourceMappingURL=middleware.d.ts.map