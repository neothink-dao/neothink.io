// packages/utils/src/synergyBoost.ts

// Define mapping for Zoom days (adjust if needed)
const zoomDayMultiplier: { [key: string]: number } = {
  sunday: 27,
  monday: 27,
  tuesday: 27,
  wednesday: 27,
  thursday: 27,
  friday: 27,
  saturday: 27,
};

// Ensure ZoomDay type is explicitly string-based keys
type ZoomDay = Extract<keyof typeof zoomDayMultiplier, string>;

/**
 * Calculates the synergy boost multiplier for attending a specific weekly Zoom.
 * Currently a flat x27 multiplier for any listed Zoom day.
 */
export const calculateSynergyBoost = (dayAttended: string): number => {
    const lowerCaseDay = dayAttended.toLowerCase();

    // Check if the day is one of the specified Zoom days
    if (lowerCaseDay in zoomDayMultiplier) {
      return zoomDayMultiplier[lowerCaseDay]; // Return x27
    }

    // Return 1 (no boost) if not a recognized Zoom day
    return 1;
};

// Example usage:
// const boostMonday = calculateSynergyBoost('Monday');
// console.log(boostMonday); // 27
// const boostOther = calculateSynergyBoost('ConferenceCall');
// console.log(boostOther); // 1 