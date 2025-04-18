import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const revalidate = 0;
export declare function GET(request: NextRequest): Promise<NextResponse<{
    status: string;
    timestamp: string;
    environment: string;
    dbConnected: boolean;
    version: string;
}> | NextResponse<{
    status: string;
    timestamp: string;
    error: string;
    environment: string;
}>>;
//# sourceMappingURL=route.d.ts.map