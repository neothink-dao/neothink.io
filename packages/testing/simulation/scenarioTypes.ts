// Types for simulation scenarios and metrics
import { Persona } from './personas';

export type EngagementPhase = 'discovery' | 'onboarding' | 'progression' | 'mastery';

// Extend SimUser to support site/app and tokenBalance for improved gamification
export interface SimUser {
  id: string;
  persona: Persona;
  phase: EngagementPhase;
  site: string; // New: which app/site the user is acting in
  tokenBalance?: {
    LUCK: number;
    [key: string]: number;
  };
}

export interface Scenario {
  name: string;
  description: string;
  personas: Persona[];
  phases: EngagementPhase[];
  run: (users: SimUser[], context: SimContext) => Promise<ScenarioResult>;
}

export interface ScenarioResult {
  events: SimEvent[];
  metrics: ScenarioMetrics;
}

export interface SimEvent {
  userId: string;
  persona: Persona;
  phase: EngagementPhase;
  eventType: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface ScenarioMetrics {
  retention: number; // % retained after X days
  engagement: number; // avg sessions/user
  avgTimeSpent: number; // minutes
  satisfaction: number; // 1-10
  rewardBalance: Record<string, number>; // token: amount
  repetitiveTaskScore: number; // 0 (none) - 1 (high)
  collaborationScore: number; // 0-1
}

// Extend SimContext to support rewardParams for per-site/app tuning
export interface SimContext {
  supabaseUrl: string;
  supabaseKey: string;
  dbClient: any;
  now: Date;
  rewardParams?: Record<string, any>; // New: for per-site/app reward tuning
  simulationRunId?: string;
}
