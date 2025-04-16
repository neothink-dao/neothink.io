/**
 * XP thresholds for each level (example: exponential curve)
 */
export declare const XP_THRESHOLDS: number[];
/**
 * Returns the user level for a given XP value.
 * @param xp number
 * @returns level number
 */
export declare function getLevelFromXP(xp: number): number;
/**
 * Returns the XP multiplier based on event metadata (group, referral, etc)
 */
export declare function getXPMultiplier(metadata: Record<string, any>): number;
/**
 * Returns the nth Fibonacci number (for fractal rewards, etc)
 */
export declare function fibonacci(n: number): number;
/**
 * Determines badge eligibility based on action/event and criteria
 * Supports multi-criteria, streaks, and group achievements.
 * Extend this as needed for advanced badge logic.
 */
export declare function isBadgeEligible(actionType: string, criteria: Record<string, any>, userMeta?: Record<string, any>): boolean;
/**
 * Validates census snapshot input for required fields and basic constraints.
 * Extend for more advanced validation as needed (e.g., min/max, anomaly detection).
 */
export declare function validateCensusSnapshot(snapshot: {
    scope: string;
    scope_id?: string;
    population: number;
    assets?: number;
    activity_count: number;
    metadata?: Record<string, any>;
}): boolean;
/**
 * Validates onboarding event for required fields and milestone constraints.
 * Extend for more advanced logic (e.g., milestone whitelist, duplicate checks).
 */
export declare function validateOnboardingEvent(event: {
    user_id: string;
    milestone: string;
    metadata?: Record<string, any>;
}): boolean;
export { default as useRealtimeEvents } from './useRealtimeEvents';
//# sourceMappingURL=index.d.ts.map