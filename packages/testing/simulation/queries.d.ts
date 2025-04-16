import { SimUser } from './scenarioTypes';
export declare function getSupabaseClient(url: string, key: string): import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare function insertXPEvent(client: any, user: SimUser, amount: number, eventType: string, details?: any, simulationRunId?: string): Promise<any>;
export declare function insertBadgeEvent(client: any, user: SimUser, badgeId: string, earned?: boolean, details?: any, simulationRunId?: string): Promise<any>;
export declare function insertFibonacciReward(client: any, user: SimUser, level: number, tokens: number, details?: any, simulationRunId?: string): Promise<any>;
export declare function insertCensusSnapshot(client: any, user: SimUser, population: number, activity: number, assets: number, details?: any, simulationRunId?: string): Promise<any>;
export declare function fetchUserEvents(client: any, userId: string): Promise<{
    xp: any;
    badge: any;
    fib: any;
    census: any;
}>;
export declare function getSiteSettings(dbClient: any, site: string): Promise<any>;
export declare function insertGamificationEvent(dbClient: any, userId: string, persona: string, site: string, eventType: string, tokenType: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK', amount: number, metadata?: Record<string, any>, simulationRunId?: string): Promise<any>;
export declare function insertTokenSink(dbClient: any, site: string, sinkType: string, tokenType: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK', description: string, simulationRunId?: string): Promise<any>;
export declare function insertTokenConversion(dbClient: any, userId: string, fromToken: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK', toToken: 'LIVE' | 'LOVE' | 'LIFE' | 'LUCK', amount: number, rate: number, site: string, simulationRunId?: string): Promise<any>;
export declare function getSiteMetrics(dbClient: any, site: string): Promise<any>;
export declare function getAllSiteSettings(dbClient: any): Promise<any>;
//# sourceMappingURL=queries.d.ts.map