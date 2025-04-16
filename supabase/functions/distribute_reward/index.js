// Supabase Edge Function: distribute_reward
// Deno 2.1+ / TypeScript
// Purpose: Securely distribute rewards to users and log to gamification_events table
// Follows Supabase best practices: https://supabase.com/blog/supabase-edge-functions-deploy-dashboard-deno-2-1
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// Validate input types and use environment variables for secrets
serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Only POST allowed' }), { status: 405 });
    }
    const { user_id, site, persona, event_type, token_type, amount, metadata } = await req.json();
    // Basic type validation
    if (!user_id || !site || !persona || !event_type || !token_type || typeof amount !== 'number') {
        return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), { status: 400 });
    }
    // Only allow known token types
    const allowedTokens = ['LIVE', 'LOVE', 'LIFE', 'LUCK'];
    if (!allowedTokens.includes(token_type)) {
        return new Response(JSON.stringify({ error: 'Invalid token_type' }), { status: 400 });
    }
    // Insert into gamification_events via Supabase Data API
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), { status: 500 });
    }
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/gamification_events`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        },
        body: JSON.stringify([
            { user_id, site, persona, event_type, token_type, amount, metadata: metadata || null }
        ])
    });
    if (!insertRes.ok) {
        const err = await insertRes.text();
        return new Response(JSON.stringify({ error: 'Failed to insert event', details: err }), { status: 500 });
    }
    const data = await insertRes.json();
    return new Response(JSON.stringify({ success: true, event: data[0] }), { status: 200 });
});
//# sourceMappingURL=index.js.map