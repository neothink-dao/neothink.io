// Supabase Edge Function: log-census-snapshot
// Purpose: Log census snapshots (population, assets, activity) to the census_snapshots table.
// Usage: POST /functions/v1/log-census-snapshot
import { serve } from 'std/server';
import { validateCensusSnapshot } from '../../../../packages/gamification-utils/index.ts';
serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    try {
        const { scope, scope_id, population, assets, activity_count, metadata } = await req.json();
        if (!scope || typeof population !== 'number' || typeof activity_count !== 'number') {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        // Optional: Validate census snapshot using shared utility
        if (typeof validateCensusSnapshot === 'function') {
            const valid = validateCensusSnapshot({ scope, scope_id, population, assets, activity_count, metadata });
            if (!valid) {
                return new Response(JSON.stringify({ error: 'Invalid census snapshot' }), { status: 400 });
            }
        }
        // Insert census snapshot
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error, data } = await supabase.from('census_snapshots').insert([
            {
                scope,
                scope_id,
                population,
                assets,
                activity_count,
                snapshot_at: new Date().toISOString(),
                metadata
            },
        ]);
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        const censusSnapshot = (data === null || data === void 0 ? void 0 : data[0]) || null;
        return new Response(JSON.stringify({ success: true, censusSnapshot }), { status: 200 });
    }
    catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
});
//# sourceMappingURL=index.js.map