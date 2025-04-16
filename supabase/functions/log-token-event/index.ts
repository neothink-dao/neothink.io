// Supabase Edge Function: log-token-event
// Purpose: Log token events to the token_events table with multipliers, Fibonacci logic, and Realtime broadcast.
// Usage: POST /functions/v1/log-token-event

import { serve } from 'std/server';

const FIB = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

function getFibonacciReward(level: number): number {
  return FIB[Math.min(level, FIB.length - 1)];
}

function getTokenMultiplier(metadata: any): number {
  if (metadata?.collaboration) return 2;
  if (metadata?.referral) return 1.5;
  return 1;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const { user_id, team_id, event_type, base_tokens, metadata } = await req.json();
    if (!user_id || !event_type || typeof base_tokens !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Calculate token amount with multipliers
    const multiplier = getTokenMultiplier(metadata);
    const token_amount = Math.round(base_tokens * multiplier);

    // Insert token event
    const insertRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/token_events`, {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id,
        team_id,
        event_type,
        token_amount,
        metadata,
        created_at: new Date().toISOString()
      })
    });
    if (!insertRes.ok) {
      const err = await insertRes.text();
      return new Response(JSON.stringify({ error: 'DB insert failed', details: err }), { status: 500 });
    }
    const [tokenEvent] = await insertRes.json();

    // Return token event and multiplier info
    return new Response(JSON.stringify({ success: true, tokenEvent, multiplier }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
