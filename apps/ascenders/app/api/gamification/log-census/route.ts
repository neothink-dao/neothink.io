import { NextRequest } from 'next/server';
// @ts-expect-error: monorepo import may be valid in deployment context
import { getUser } from '@neothink/hooks';

export async function POST(req: NextRequest) {
  try {
    const { scope, scope_id, population, assets, activity_count, metadata } = await req.json();
    if (!scope || typeof population !== 'number' || typeof activity_count !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const { user, error: userError } = await getUser(req);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Call Edge Function to log census snapshot
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/log-census-snapshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify({
        scope,
        scope_id,
        population,
        assets,
        activity_count,
        metadata: { ...metadata, user_id: user.id },
      }),
    });
    const payload = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: payload.error || 'Census event failed' }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, censusSnapshot: payload.censusSnapshot }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}
