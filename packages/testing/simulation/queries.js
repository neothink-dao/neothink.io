// Supabase query utilities for simulation
import { createClient } from '@supabase/supabase-js';
export function getSupabaseClient(url, key) {
    return createClient(url, key);
}
export async function insertXPEvent(client, user, amount, eventType, details, simulationRunId) {
    return client.from('xp_events').insert([
        {
            user_id: user.id,
            event_type: eventType,
            xp_amount: amount,
            metadata: details || {},
            created_at: new Date().toISOString(),
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
export async function insertBadgeEvent(client, user, badgeId, earned = true, details, simulationRunId) {
    return client.from('badge_events').insert([
        {
            user_id: user.id,
            badge_id: badgeId,
            earned,
            metadata: details || {},
            created_at: new Date().toISOString(),
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
export async function insertFibonacciReward(client, user, level, tokens, details, simulationRunId) {
    return client.from('fibonacci_token_rewards').insert([
        {
            user_id: user.id,
            level,
            tokens,
            metadata: details || {},
            created_at: new Date().toISOString(),
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
export async function insertCensusSnapshot(client, user, population, activity, assets, details, simulationRunId) {
    return client.from('census_snapshots').insert([
        {
            user_id: user.id,
            scope: user.persona,
            population,
            activity_count: activity,
            assets,
            metadata: details || {},
            created_at: new Date().toISOString(),
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
export async function fetchUserEvents(client, userId) {
    // Returns events from all tables for a user
    const [xp, badge, fib, census] = await Promise.all([
        client.from('xp_events').select('*').eq('user_id', userId),
        client.from('badge_events').select('*').eq('user_id', userId),
        client.from('fibonacci_token_rewards').select('*').eq('user_id', userId),
        client.from('census_snapshots').select('*').eq('user_id', userId),
    ]);
    return { xp: xp.data, badge: badge.data, fib: fib.data, census: census.data };
}
// Fetch site/app gamification settings
export async function getSiteSettings(dbClient, site) {
    return dbClient
        .from('site_settings')
        .select('*')
        .eq('site', site)
        .single();
}
// Insert a gamification event (earn, spend, collaboration, convert, etc.)
export async function insertGamificationEvent(dbClient, userId, persona, site, eventType, tokenType, amount, metadata = {}, simulationRunId) {
    return dbClient
        .from('gamification_events')
        .insert([
        {
            user_id: userId,
            persona,
            site,
            event_type: eventType,
            token_type: tokenType,
            amount,
            metadata,
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
// Insert a token sink event (spend tokens)
export async function insertTokenSink(dbClient, site, sinkType, tokenType, description, simulationRunId) {
    return dbClient
        .from('token_sinks')
        .insert([
        {
            site,
            sink_type: sinkType,
            token_type: tokenType,
            description,
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
// Insert a token conversion event
export async function insertTokenConversion(dbClient, userId, fromToken, toToken, amount, rate, site, simulationRunId) {
    return dbClient
        .from('token_conversions')
        .insert([
        {
            user_id: userId,
            from_token: fromToken,
            to_token: toToken,
            amount,
            rate,
            site,
            simulation_run_id: simulationRunId || null,
        },
    ]);
}
// Fetch per-site/app metrics from gamification_events
export async function getSiteMetrics(dbClient, site) {
    return dbClient
        .from('gamification_events')
        .select('event_type, token_type, amount')
        .eq('site', site);
}
// Fetch all site settings (for batch simulation)
export async function getAllSiteSettings(dbClient) {
    return dbClient.from('site_settings').select('*');
}
//# sourceMappingURL=queries.js.map