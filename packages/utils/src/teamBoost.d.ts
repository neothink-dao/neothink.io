interface CalculateTeamBoostArgs {
    activeMembers: number;
    teamSize: number;
    pointsEarnedByMember: number;
}
/**
 * Calculates the additional points awarded to the team based on a member's earnings.
 * Formula: 0.618 * Active Members * (5 / Team Size) * pointsEarnedByMember
 */
export declare const calculateTeamBoost: ({ activeMembers, teamSize, pointsEarnedByMember, }: CalculateTeamBoostArgs) => number;
export {};
//# sourceMappingURL=teamBoost.d.ts.map