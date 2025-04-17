declare const vortexMultipliers: {
    read: number;
    write: number;
    execute: number;
    superachiever: number;
    trial: number;
    zoom: number;
    default: number;
};
type ActionType = keyof typeof vortexMultipliers;
interface CalculatePointsArgs {
    actionType: ActionType;
    basePoints: number;
    streak: number;
    isTrialUser?: boolean;
    isInactive?: boolean;
}
interface CalculatedPointsResult {
    finalPoints: number;
    basePoints: number;
    multiplierApplied: number;
    streakBonus: number;
}
export declare const calculatePoints: ({ actionType, basePoints, streak, isTrialUser, isInactive, }: CalculatePointsArgs) => CalculatedPointsResult;
export {};
//# sourceMappingURL=calculatePoints.d.ts.map