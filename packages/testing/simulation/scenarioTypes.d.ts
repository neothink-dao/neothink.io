import { Persona } from './personas';
export type EngagementPhase = 'discovery' | 'onboarding' | 'progression' | 'mastery';
export interface SimUser {
    id: string;
    persona: Persona;
    phase: EngagementPhase;
    site: string;
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
    retention: number;
    engagement: number;
    avgTimeSpent: number;
    satisfaction: number;
    rewardBalance: Record<string, number>;
    repetitiveTaskScore: number;
    collaborationScore: number;
}
export interface SimContext {
    supabaseUrl: string;
    supabaseKey: string;
    dbClient: any;
    now: Date;
    rewardParams?: Record<string, any>;
    simulationRunId?: string;
}
//# sourceMappingURL=scenarioTypes.d.ts.map