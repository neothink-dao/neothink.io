import { NextRequest } from 'next/server';
export declare const rateLimitConfig: {
    auth: {
        limit: number;
        window: number;
    };
    admin: {
        limit: number;
        window: number;
    };
    api: {
        limit: number;
        window: number;
    };
    default: {
        limit: number;
        window: number;
    };
};
export declare function checkRateLimit(request: NextRequest): Promise<boolean>;
//# sourceMappingURL=rate-limit.d.ts.map