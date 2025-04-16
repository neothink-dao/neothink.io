import middleware from '@neothink/auth/src/utils/middleware';
export default middleware;
import { type NextRequest } from 'next/server';
export declare function middleware(request: NextRequest): Promise<any>;
export declare const config: {
    matcher: string[];
};
//# sourceMappingURL=middleware.d.ts.map