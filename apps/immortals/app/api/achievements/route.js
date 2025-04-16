// @ts-expect-error: monorepo import may be valid in deployment context
import { analytics } from '@neothink/analytics';
// @ts-expect-error: monorepo import may be valid in deployment context
import { getUser } from '@neothink/hooks/api';
import { getSupabaseServerClient } from '@neothink/database/src/serverClient';
// GET /api/achievements
export async function GET(req) {
    try {
        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);
        const sort = searchParams.get('sort') || 'created_at';
        const order = searchParams.get('order') || 'desc';
        // Get authenticated user from request (adapt getUser to work with NextRequest if needed)
        const { user, error: userError } = await getUser(req);
        if (userError) {
            console.error('Error getting user:', userError);
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        // Initialize Supabase client using the new helper
        const supabase = await getSupabaseServerClient();
        // Query achievements
        const query = supabase
            .from('achievements')
            .select('*')
            .eq('platform', 'immortals')
            .order(sort, { ascending: order === 'asc' })
            .range(offset, offset + limit - 1);
        const { data, error, count } = await query;
        if (error)
            throw error;
        // Track analytics event
        if (user) {
            analytics.track('api_achievements_fetched', {
                platform: 'immortals',
                user_id: user.id,
                limit,
                offset,
                count: (data === null || data === void 0 ? void 0 : data.length) || 0,
            }).catch((e) => console.warn('Failed to track analytics event:', e));
        }
        // Return data with pagination info
        return new Response(JSON.stringify({
            data,
            pagination: { limit, offset, total: count },
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error('Error fetching achievements:', error);
        // Track error
        analytics.track('api_error', {
            platform: 'immortals',
            endpoint: '/api/achievements',
            error: error instanceof Error ? error.message : 'Unknown error',
        }).catch((e) => console.warn('Failed to track error event:', e));
        return new Response(JSON.stringify({
            error: 'Failed to fetch achievements',
            message: error instanceof Error ? error.message : 'Internal server error',
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
//# sourceMappingURL=route.js.map