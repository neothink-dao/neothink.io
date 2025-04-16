// packages/utils/src/calculatePoints.ts
// Helper function for Fibonacci (can be shared or kept local)
const fibonacci = (n) => {
    if (n <= 0)
        return 0;
    if (n === 1)
        return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    // Cap Fibonacci sequence at F(13) for points, as per instructions
    // F(1) = 1, F(2) = 1, F(3) = 2, ..., F(13) = 233
    return Math.min(b, 233); // Adjust cap if needed
};
// Define Vortex multipliers
const vortexMultipliers = {
    read: 3,
    write: 6,
    execute: 9,
    superachiever: 13,
    trial: 1,
    zoom: 1, // Default zoom multiplier? Instruction unclear, setting to 1
    default: 1,
};
export const calculatePoints = ({ actionType, basePoints, streak, isTrialUser = false, isInactive = false, }) => {
    if (isTrialUser) {
        // Trial users get 1 point, no multipliers or streak
        return { finalPoints: 1, basePoints: 1, multiplierApplied: 1, streakBonus: 0 };
    }
    let multiplier = vortexMultipliers[actionType] || vortexMultipliers.default;
    let streakBonus = 0;
    // Apply Golden Streak bonus (+161.8% max) - Interpreting this as *scaling* the streak bonus itself
    // Max streak for full bonus (example, similar to vortex component)
    const maxStreakForFullBoost = 34;
    const goldenStreakMultiplier = isInactive ? 1.0 : Math.min(1 + (streak > 0 ? ((streak - 1) / (maxStreakForFullBoost - 1)) * 1.618 : 0), 2.618); // Scales from 1x to 2.618x
    if (!isInactive && streak > 0) {
        streakBonus = Math.round(fibonacci(streak) * goldenStreakMultiplier);
    }
    // Apply vortex multiplier (only if not inactive)
    const pointsBeforeStreak = isInactive ? basePoints : Math.round(basePoints * multiplier);
    const multiplierApplied = isInactive ? 1 : multiplier;
    // Final points calculation
    const finalPoints = pointsBeforeStreak + streakBonus;
    // TODO: Integrate capRewards logic here or call an external check?
    // Example: finalPoints = Math.min(finalPoints, dailyCapCheck(userId, category));
    return {
        finalPoints: Math.max(0, finalPoints), // Ensure points don't go negative
        basePoints: basePoints,
        multiplierApplied: multiplierApplied,
        streakBonus: streakBonus,
    };
};
// Example usage:
// const result = calculatePoints({ actionType: 'write', basePoints: 5, streak: 10 });
// console.log(result); // { finalPoints: ?, basePoints: 5, multiplierApplied: 6, streakBonus: ? } 
//# sourceMappingURL=calculatePoints.js.map