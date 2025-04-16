"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  calculatePoints: () => calculatePoints,
  calculateSynergyBoost: () => calculateSynergyBoost,
  calculateTeamBoost: () => calculateTeamBoost,
  calculateVotingPower: () => calculateVotingPower
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  calculatePoints,
  calculateSynergyBoost,
  calculateTeamBoost,
  calculateVotingPower
});
