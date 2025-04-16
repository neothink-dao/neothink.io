// Supabase Edge Function: onboarding-event
// Purpose: Log onboarding milestones/events for user journeys and viral/retention analytics.
// Usage: POST /functions/v1/onboarding-event
import { serve } from 'std/server';
import { validateOnboardingEvent } from '../../../../packages/gamification-utils/index.ts';
serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    try {
        const { user_id, milestone, metadata } = await req.json();
        if (!user_id || !milestone) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        // Optional: Validate onboarding event using shared utility
        if (typeof validateOnboardingEvent === 'function') {
            const valid = validateOnboardingEvent({ user_id, milestone, metadata });
            if (!valid) {
                return new Response(JSON.stringify({ error: 'Invalid onboarding event' }), { status: 400 });
            }
        }
        // Insert onboarding event (to a dedicated table or xp_events with a special type)
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error, data } = await supabase.from('xp_events').insert([
            {
                user_id,
                event_type: `onboarding:${milestone}`,
                xp_amount: 0,
                metadata,
                created_at: new Date().toISOString()
            },
        ]);
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        const onboardingEvent = (data === null || data === void 0 ? void 0 : data[0]) || null;
        return new Response(JSON.stringify({ success: true, onboardingEvent }), { status: 200 });
    }
    catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
});
//# sourceMappingURL=index.js.map