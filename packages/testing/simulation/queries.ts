// Supabase query utilities for simulation
import { createClient } from '@supabase/supabase-js';
import { SimUser, SimEvent } from './scenarioTypes';

export function getSupabaseClient(url: string, key: string) {
  return createClient(url, key);
}

export async function insertXPEvent(client: any, user: SimUser, amount: number, eventType: string, details?: any, simulationRunId?: string) {
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

export async function insertBadgeEvent(client: any, user: SimUser, badgeId: string, earned = true, details?: any, simulationRunId?: string) {
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

export async function insertFibonacciReward(client: any, user: SimUser, level: number, tokens: number, details?: any, simulationRunId?: string) {
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

export async function insertCensusSnapshot(client: any, user: SimUser, population: number, activity: number, assets: number, details?: any, simulationRunId?: string) {
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

export async function fetchUserEvents(client: any, userId: string) {
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
export async function getSiteSettings(dbClient: any, site: string) {
  return dbClient
    .from('site_settings')
    .select('*')
    .eq('site', site)
    .single();
}

// Insert a gamification event (earn, spend, collaboration, convert, etc.)
export async function insertGamificationEvent(
  dbClient: any,
  userId: string,
  persona: string,
  site: string,
  eventType: string,
  tokenType: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK',
  amount: number,
  metadata: Record<string, any> = {},
  simulationRunId?: string
) {
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
export async function insertTokenSink(
  dbClient: any,
  site: string,
  sinkType: string,
  tokenType: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK',
  description: string,
  simulationRunId?: string
) {
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
export async function insertTokenConversion(
  dbClient: any,
  userId: string,
  fromToken: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK',
  toToken: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK',
  amount: number,
  rate: number,
  site: string,
  simulationRunId?: string
) {
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
export async function getSiteMetrics(dbClient: any, site: string) {
  return dbClient
    .from('gamification_events')
    .select('event_type, token_type, amount')
    .eq('site', site);
}

// Fetch all site settings (for batch simulation)
export async function getAllSiteSettings(dbClient: any) {
  return dbClient.from('site_settings').select('*');
}
