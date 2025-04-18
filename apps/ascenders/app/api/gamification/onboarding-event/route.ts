import { NextRequest } from 'next/server';
// @ts-expect-error: monorepo import may be valid in deployment context
import { getUser } from '@neothink/hooks';

export async function POST(req: NextRequest) {
  try {
    const { milestone, metadata } = await req.json();
    if (!milestone) {
      return new Response(JSON.stringify({ error: 'Missing milestone' }), { status: 400 });
    }
    const { user, error: userError } = await getUser(req);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Call Edge Function to log onboarding event
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/onboarding-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify({
        user_id: user.id,
        milestone,
        metadata,
      }),
    });
    const payload = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: payload.error || 'Onboarding event failed' }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, onboardingEvent: payload.onboardingEvent }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}
