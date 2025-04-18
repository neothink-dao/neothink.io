import middleware from '@neothink/auth/src/utils/middleware';
export default middleware;
import { NextResponse, type NextRequest } from 'next/server';
export declare function middleware(request: NextRequest): Promise<NextResponse<unknown>>;
export declare const config: {
    matcher: string[];
};
//# sourceMappingURL=middleware.d.ts.map