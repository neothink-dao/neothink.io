// Shared gamification utility functions for all apps
// Centralizes XP, level, Fibonacci/fractal rewards, badge logic, and census utilities
/**
 * XP thresholds for each level (example: exponential curve)
 */
export const XP_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800];
/**
 * Returns the user level for a given XP value.
 * @param xp number
 * @returns level number
 */
export function getLevelFromXP(xp) {
    for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= XP_THRESHOLDS[i])
            return i + 1;
    }
    return 1;
}
/**
 * Returns the XP multiplier based on event metadata (group, referral, etc)
 */
export function getXPMultiplier(metadata) {
    if (metadata === null || metadata === void 0 ? void 0 : metadata.group_activity)
        return 2;
    if (metadata === null || metadata === void 0 ? void 0 : metadata.referral)
        return 1.5;
    return 1;
}
/**
 * Returns the nth Fibonacci number (for fractal rewards, etc)
 */
export function fibonacci(n) {
    if (n <= 1)
        return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
/**
 * Determines badge eligibility based on action/event and criteria
 * Supports multi-criteria, streaks, and group achievements.
 * Extend this as needed for advanced badge logic.
 */
export function isBadgeEligible(actionType, criteria, userMeta) {
    // Example: check if actionType matches criteria.action_type
    if ((criteria === null || criteria === void 0 ? void 0 : criteria.action_type) && actionType !== criteria.action_type)
        return false;
    // Example: streak requirement
    if ((criteria === null || criteria === void 0 ? void 0 : criteria.min_streak) && (!(userMeta === null || userMeta === void 0 ? void 0 : userMeta.streak) || userMeta.streak < criteria.min_streak))
        return false;
    // Example: group achievement
    if ((criteria === null || criteria === void 0 ? void 0 : criteria.group_required) && !(userMeta === null || userMeta === void 0 ? void 0 : userMeta.group_activity))
        return false;
    // Add more advanced logic here as needed
    return true;
}
/**
 * Validates census snapshot input for required fields and basic constraints.
 * Extend for more advanced validation as needed (e.g., min/max, anomaly detection).
 */
export function validateCensusSnapshot(snapshot) {
    if (!snapshot.scope || typeof snapshot.population !== 'number' || typeof snapshot.activity_count !== 'number')
        return false;
    if (snapshot.population < 0 || snapshot.activity_count < 0)
        return false;
    // Example: assets should not be negative if provided
    if (typeof snapshot.assets === 'number' && snapshot.assets < 0)
        return false;
    // Extend with more advanced checks as needed
    return true;
}
/**
 * Validates onboarding event for required fields and milestone constraints.
 * Extend for more advanced logic (e.g., milestone whitelist, duplicate checks).
 */
export function validateOnboardingEvent(event) {
    if (!event.user_id || !event.milestone)
        return false;
    // Example: milestone should be from an allowed set
    const allowedMilestones = [
        'signup',
        'profile_complete',
        'first_action',
        'invite_sent',
        'invite_accepted',
        'tutorial_complete',
        // Add more as needed
    ];
    if (!allowedMilestones.includes(event.milestone))
        return false;
    // Extend with more advanced checks as needed
    return true;
}
export { default as useRealtimeEvents } from './useRealtimeEvents';
// TODO: Add more advanced badge logic and other utilities as needed.
//# sourceMappingURL=index.js.map