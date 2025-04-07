// Golden Ratio constant (φ or phi)
export const PHI = 1.618033988749895;

/**
 * Spacing system based on sacred geometry principles:
 * - Golden Ratio (φ or phi) is used as the scaling factor
 * - Base unit is 3px (pattern of 3)
 * - Values follow patterns of 3, 6, and 9
 * - Each step is approximately PHI times the previous value
 * - Rounded to nearest integer for pixel-perfect implementation
 */
export const spacing = {
  // Base unit - pattern of 3
  base: '3px',
  
  // Harmonious spacing scale following golden ratio progression
  '3xs': '3px',     // 3 (base unit)
  '2xs': '6px',     // 6 (2 × base unit, pattern of 6)
  'xs': '9px',      // 9 (3 × base unit, pattern of 9)
  'sm': '15px',     // ~9 × φ
  'md': '24px',     // ~15 × φ
  'lg': '39px',     // ~24 × φ
  'xl': '63px',     // ~39 × φ
  '2xl': '102px',   // ~63 × φ
  '3xl': '165px',   // ~102 × φ
  
  // Special values for patterns of 3, 6, and 9
  '3': '3px',
  '6': '6px',
  '9': '9px',
  '18': '18px',     // 2 × 9
  '27': '27px',     // 3 × 9
  '36': '36px',     // 4 × 9 (6 × 6)
  '45': '45px',     // 5 × 9
  '54': '54px',     // 6 × 9
  '63': '63px',     // 7 × 9
  '72': '72px',     // 8 × 9
  '81': '81px',     // 9 × 9
  '90': '90px',     // 10 × 9
  '99': '99px',     // 11 × 9
} as const;

/**
 * Sacred geometry grid system
 * Based on divisions of 3, 6, and 9
 */
export const grid = {
  // Grid columns based on 3, 6, and 9
  columns: {
    '3': 'repeat(3, minmax(0, 1fr))',
    '6': 'repeat(6, minmax(0, 1fr))',
    '9': 'repeat(9, minmax(0, 1fr))',
    '12': 'repeat(12, minmax(0, 1fr))', // 4 × 3
  },
  
  // Grid rows based on 3, 6, and 9
  rows: {
    '3': 'repeat(3, minmax(0, 1fr))',
    '6': 'repeat(6, minmax(0, 1fr))',
    '9': 'repeat(9, minmax(0, 1fr))',
  },
  
  // Golden ratio grid templates
  templates: {
    goldenSection: '1fr 1.618fr', // Section divided by golden ratio
    goldenThirds: '1fr 0.618fr 1fr', // Rule of thirds with golden ratio influence
    phi3Grid: '1fr 0.618fr 0.382fr', // 3-column grid based on φ, φ², and φ³
  }
} as const;

/**
 * Fibonacci-based scale
 * Using Fibonacci sequence which closely approximates golden ratio
 */
export const fibonacci = {
  scale: {
    '1': '1px',
    '2': '2px',
    '3': '3px',
    '5': '5px',
    '8': '8px',
    '13': '13px',
    '21': '21px',
    '34': '34px',
    '55': '55px',
    '89': '89px',
    '144': '144px',
    '233': '233px',
    '377': '377px',
    '610': '610px',
    '987': '987px',
  }
} as const;

// Type definitions
export type SpacingToken = keyof typeof spacing
export type GridTemplate = keyof typeof grid.templates
export type FibonacciScale = keyof typeof fibonacci.scale 