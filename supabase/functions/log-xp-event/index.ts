// Supabase Edge Function: log-xp-event
// Purpose: Log XP events to the xp_events table with multipliers, Fibonacci logic, and Realtime broadcast.
// Best practices: Deno 2.1+, declarative schema, RLS, Realtime, MCP Server compatible
// Usage: POST /functions/v1/log-xp-event

import { serve } from 'std/server';
import { getLevelFromXP, getXPMultiplier } from '../../../../packages/gamification-utils/index.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const { user_id, team_id, event_type, base_xp, multiplier, xp_earned, metadata } = await req.json();
    if (!user_id || !event_type) {
      return new Response(JSON.stringify({ error: 'Missing user_id or event_type' }), { status: 400 });
    }

    // Use shared utility for XP multiplier and level
    const computedMultiplier = multiplier ?? getXPMultiplier(metadata);
    const computedBaseXP = base_xp ?? 10;
    const computedTotalXP = xp_earned ?? Math.round(computedBaseXP * computedMultiplier);
    const newLevel = getLevelFromXP(computedTotalXP); // This is just for demo; real logic would sum user's XP

    // Log event to xp_events table
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('xp_events').insert([
      {
        user_id,
        team_id,
        event_type,
        base_xp: computedBaseXP,
        multiplier: computedMultiplier,
        xp_amount: computedTotalXP,
        metadata,
      },
    ]);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Optionally broadcast via Realtime (future step)
    return new Response(
      JSON.stringify({ success: true, xpEvent: { user_id, event_type, xp_amount: computedTotalXP }, multiplier: computedMultiplier, newLevel }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Internal error' }), { status: 500 });
  }
});
