// src/calculatePoints.ts
var fibonacci = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return Math.min(b, 233);
};
var vortexMultipliers = {
  read: 3,
  write: 6,
  execute: 9,
  superachiever: 13,
  trial: 1,
  zoom: 1,
  // Default zoom multiplier? Instruction unclear, setting to 1
  default: 1
};
var calculatePoints = ({
  actionType,
  basePoints,
  streak,
  isTrialUser = false,
  isInactive = false
}) => {
  if (isTrialUser) {
    return { finalPoints: 1, basePoints: 1, multiplierApplied: 1, streakBonus: 0 };
  }
  let multiplier = vortexMultipliers[actionType] || vortexMultipliers.default;
  let streakBonus = 0;
  const maxStreakForFullBoost = 34;
  const goldenStreakMultiplier = isInactive ? 1 : Math.min(1 + (streak > 0 ? (streak - 1) / (maxStreakForFullBoost - 1) * 1.618 : 0), 2.618);
  if (!isInactive && streak > 0) {
    streakBonus = Math.round(fibonacci(streak) * goldenStreakMultiplier);
  }
  const pointsBeforeStreak = isInactive ? basePoints : Math.round(basePoints * multiplier);
  const multiplierApplied = isInactive ? 1 : multiplier;
  const finalPoints = pointsBeforeStreak + streakBonus;
  return {
    finalPoints: Math.max(0, finalPoints),
    // Ensure points don't go negative
    basePoints,
    multiplierApplied,
    streakBonus
  };
};

// src/teamBoost.ts
var calculateTeamBoost = ({
  activeMembers,
  teamSize,
  pointsEarnedByMember
}) => {
  if (teamSize <= 0 || activeMembers < 0 || pointsEarnedByMember <= 0) {
    return 0;
  }
  const validActiveMembers = Math.min(activeMembers, teamSize);
  const boost = 0.618 * validActiveMembers * (5 / teamSize) * pointsEarnedByMember;
  return Math.floor(boost);
};

// src/votingPower.ts
var calculateVotingPower = (stakedAmount) => {
  if (stakedAmount <= 0) {
    return 0;
  }
  const rawVotingPower = Math.sqrt(stakedAmount);
  const cappedVotingPower = Math.min(rawVotingPower, 34);
  return Math.round(cappedVotingPower);
};

// src/synergyBoost.ts
var zoomDayMultiplier = {
  sunday: 27,
  monday: 27,
  tuesday: 27,
  wednesday: 27,
  thursday: 27,
  friday: 27,
  saturday: 27
};
var calculateSynergyBoost = (dayAttended) => {
  const lowerCaseDay = dayAttended.toLowerCase();
  if (lowerCaseDay in zoomDayMultiplier) {
    return zoomDayMultiplier[lowerCaseDay];
  }
  return 1;
};
export {
  calculatePoints,
  calculateSynergyBoost,
  calculateTeamBoost,
  calculateVotingPower
};
