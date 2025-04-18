import { NextRequest, NextResponse } from 'next/server';
/**
 * Rate limit middleware
 */
export declare function rateLimit(req: NextRequest, maxRequests?: number, windowSeconds?: number): Promise<boolean>;
/**
 * Main security middleware
 */
export declare function securityMiddleware(req: NextRequest, res: NextResponse): NextResponse<unknown>;
/**
 * Security middleware with rate limiting
 */
export declare function securityMiddlewareWithRateLimit(req: NextRequest): Promise<NextResponse<unknown>>;
//# sourceMappingURL=middlewares.d.ts.map