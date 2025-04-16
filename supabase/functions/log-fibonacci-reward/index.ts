// Supabase Edge Function: log-fibonacci-reward
// Purpose: Log Fibonacci-based token rewards (individual, team, collaboration, referral) to the fibonacci_token_rewards table.
// Usage: POST /functions/v1/log-fibonacci-reward

import { serve } from 'std/server';
import { fibonacci } from '../../../../packages/gamification-utils/index.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const { user_id, team_id, action_id, reward_type, level, metadata } = await req.json();
    if (!user_id || !reward_type || typeof level !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const tokens_awarded = fibonacci(level);

    // Insert reward event
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error, data } = await supabase.from('fibonacci_token_rewards').insert([
      {
        user_id,
        team_id,
        action_id,
        tokens_awarded,
        reward_type,
        awarded_at: new Date().toISOString(),
        metadata
      },
    ]);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    const rewardEvent = data?.[0] || null;
    return new Response(JSON.stringify({ success: true, rewardEvent, tokens_awarded }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
