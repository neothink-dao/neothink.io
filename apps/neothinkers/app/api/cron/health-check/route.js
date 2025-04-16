import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(request) {
    try {
        // Get current timestamp
        const timestamp = new Date().toISOString();
        // Create Supabase admin client using service role key for health checks
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
        // Test database connection
        const { data: testData, error: dbError } = await supabase
            .from('feedback')
            .select('count(*)', { count: 'exact' })
            .limit(1);
        if (dbError) {
            throw new Error(`Database connection error: ${dbError.message}`);
        }
        // Return health status
        return NextResponse.json({
            status: 'healthy',
            timestamp,
            app: 'neothinkers',
            environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
            dbConnected: true,
            version: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
        });
    }
    catch (error) {
        console.error('Health check failed:', error);
        // Return error status
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            app: 'neothinkers',
            error: error instanceof Error ? error.message : 'Unknown error',
            environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map