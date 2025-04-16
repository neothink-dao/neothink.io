interface CalculateTeamBoostArgs {
  activeMembers: number;
  teamSize: number;
  pointsEarnedByMember: number; // The points the member earned *before* any team boost
}

/**
 * Calculates the additional points awarded to the team based on a member's earnings.
 * Formula: 0.618 * Active Members * (5 / Team Size) * pointsEarnedByMember
 */
export const calculateTeamBoost = ({
  activeMembers,
  teamSize,
  pointsEarnedByMember,
}: CalculateTeamBoostArgs): number => {
  if (teamSize <= 0 || activeMembers < 0 || pointsEarnedByMember <= 0) {
    return 0;
  }

  // Ensure activeMembers doesn't exceed teamSize
  const validActiveMembers = Math.min(activeMembers, teamSize);

  const boost = 0.618 * validActiveMembers * (5 / teamSize) * pointsEarnedByMember;

  return Math.floor(boost); // Return whole points
};

// Example usage:
// const boost = calculateTeamBoost({ activeMembers: 8, teamSize: 10, pointsEarnedByMember: 100 });
// console.log(boost); // ~ 24 points 