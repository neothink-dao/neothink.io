// Supabase Edge Function: log-badge-event
// Purpose: Log badge events to the badge_events table and broadcast via Realtime.
// Usage: POST /functions/v1/log-badge-event

import { serve } from 'std/server';
import { isBadgeEligible } from '../../../../packages/gamification-utils/index.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const { user_id, badge_id, event_type, metadata } = await req.json();
    if (!user_id || !badge_id || !event_type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Eligibility check (enforced)
    // If isBadgeEligible is implemented, use it to validate badge awarding
    const badgeCriteria = metadata?.criteria || {};
    const userMeta = metadata?.user_meta || {};
    if (!isBadgeEligible(metadata?.action_type, badgeCriteria, userMeta)) {
      return new Response(JSON.stringify({ error: 'Badge not eligible' }), { status: 403 });
    }

    // Insert badge event
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error, data } = await supabase.from('badge_events').insert([
      {
        user_id,
        badge_id,
        event_type,
        metadata,
        created_at: new Date().toISOString()
      },
    ]);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    const badgeEvent = data?.[0] || null;

    // Return badge event info
    return new Response(JSON.stringify({ success: true, badgeEvent }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
