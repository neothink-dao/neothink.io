/**
 * Calculates voting power based on staked amount.
 * Formula: w = sqrt(s)
 * Capped at 34.
 */
export const calculateVotingPower = (stakedAmount) => {
    if (stakedAmount <= 0) {
        return 0;
    }
    const rawVotingPower = Math.sqrt(stakedAmount);
    const cappedVotingPower = Math.min(rawVotingPower, 34);
    // Return integer voting power, or allow decimals? Rounding for now.
    return Math.round(cappedVotingPower);
};
// Example usage:
// const vp1 = calculateVotingPower(100); // sqrt(100) = 10
// console.log(vp1); // 10
// const vp2 = calculateVotingPower(1500); // sqrt(1500) ~= 38.7 -> capped at 34
// console.log(vp2); // 34 
//# sourceMappingURL=votingPower.js.map