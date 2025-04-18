import { NextRequest } from 'next/server';
// @ts-expect-error: monorepo import may be valid in deployment context
import { getUser } from '@neothink/hooks';
import { getSupabaseServerClient } from '@neothink/database';
import { getLevelFromXP, getXPMultiplier } from '@neothink/gamification-utils';

export async function POST(req: NextRequest) {
  try {
    const { action_type, role, metadata } = await req.json();
    if (!action_type || !role) {
      return new Response(JSON.stringify({ error: 'Missing action_type or role' }), { status: 400 });
    }
    const { user, error: userError } = await getUser(req);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Use shared utility for XP multiplier
    const xpMultiplier = getXPMultiplier(metadata);
    const baseXP = metadata?.xp_earned || 10;
    const totalXP = Math.round(baseXP * xpMultiplier);

    // Call Edge Function to log XP event
    const xpRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/log-xp-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify({
        user_id: user.id,
        team_id: metadata?.team_id,
        event_type: action_type,
        base_xp: baseXP,
        multiplier: xpMultiplier,
        xp_earned: totalXP,
        metadata,
      }),
    });
    const xpPayload = await xpRes.json();
    if (!xpRes.ok) {
      return new Response(JSON.stringify({ error: xpPayload.error || 'XP event failed' }), { status: 500 });
    }
    // Calculate new XP/level locally for immediate feedback
    const oldXP = user[`${role}_xp`] || 0;
    const newXP = oldXP + totalXP;
    const newLevel = getLevelFromXP(newXP);
    let levelUp = false;
    if (newLevel > (user[`${role}_level`] || 1)) {
      levelUp = true;
    }

    // Check for badges (simplified: badge for first action of type)
    const supabase = await getSupabaseServerClient();
    const { data: badges, error: badgeError } = await supabase
      .from('badges')
      .select('*')
      .eq('role', role)
      .contains('criteria', { action_type });
    if (badgeError) throw badgeError;
    let badgesAwarded: string[] = [];
    for (const badge of badges || []) {
      // Check if already awarded
      const { count, error: userBadgeError } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('badge_id', badge.id);
      if (userBadgeError) throw userBadgeError;
      if ((count || 0) === 0) {
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/log-badge-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
          body: JSON.stringify({
            user_id: user.id,
            badge_id: badge.id,
            event_type: 'earned',
            metadata: { action_type, ...metadata },
          }),
        });
        await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: badge.id }]);
        badgesAwarded.push(badge.name);
      }
    }
    return new Response(
      JSON.stringify({
        success: true,
        xp: newXP,
        level: newLevel,
        levelUp,
        badgesAwarded,
        multiplier: xpMultiplier,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
