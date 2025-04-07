import { PHI } from './tokens/spacing';
import { spacing, grid, fibonacci } from './tokens/spacing';
import { geometry } from './tokens/geometry';
import { animation } from './tokens/animation';
import { colors, platformThemes } from './tokens/colors';
import { typography } from './tokens/typography';

/**
 * Sacred Geometry Design System
 * 
 * A comprehensive design system based on sacred geometry principles:
 * - Golden Ratio (1.618...)
 * - Fibonacci Sequence
 * - Patterns of 3, 6, and 9
 * - Fractal self-similarity
 * - Harmonic proportions
 */

// Export all design tokens
export { 
  PHI,
  spacing, 
  grid, 
  fibonacci,
  geometry,
  animation,
  colors,
  platformThemes,
  typography
};

/**
 * Golden Ratio Calculator
 * Utility functions for calculating golden ratio proportions
 */
export const goldenRatio = {
  /**
   * Calculate golden section of a value
   * @param value - The base value
   * @param scale - Scale factor (default: 1)
   * @returns The golden ratio proportion of the value
   */
  of: (value: number, scale = 1): number => {
    return value * PHI * scale;
  },

  /**
   * Calculate the inverse golden section of a value
   * @param value - The base value
   * @param scale - Scale factor (default: 1)
   * @returns The inverse golden ratio proportion of the value
   */
  inverse: (value: number, scale = 1): number => {
    return value * (1 / PHI) * scale;
  },

  /**
   * Divide a value into golden ratio sections
   * @param value - The total value to divide
   * @returns An object with the larger and smaller sections
   */
  divide: (value: number): { larger: number; smaller: number } => {
    const larger = value * (1 / PHI);
    const smaller = value - larger;
    return { larger, smaller };
  },

  /**
   * Generate a golden ratio sequence
   * @param start - Starting value
   * @param steps - Number of steps in the sequence
   * @param direction - Direction of scaling ('up' or 'down')
   * @returns Array of values in the golden ratio sequence
   */
  sequence: (start: number, steps: number, direction: 'up' | 'down' = 'up'): number[] => {
    const sequence: number[] = [start];
    const multiplier = direction === 'up' ? PHI : 1 / PHI;
    
    for (let i = 1; i < steps; i++) {
      sequence.push(sequence[i - 1] * multiplier);
    }
    
    return sequence;
  }
};

/**
 * Pattern 3-6-9 Utilities
 * Functions for working with 3-6-9 patterns in design
 */
export const pattern369 = {
  /**
   * Get the nearest multiple of 3
   * @param value - Input value
   * @returns The nearest multiple of 3
   */
  nearestMultipleOf3: (value: number): number => {
    return Math.round(value / 3) * 3;
  },
  
  /**
   * Get the nearest multiple of 6
   * @param value - Input value
   * @returns The nearest multiple of 6
   */
  nearestMultipleOf6: (value: number): number => {
    return Math.round(value / 6) * 6;
  },
  
  /**
   * Get the nearest multiple of 9
   * @param value - Input value
   * @returns The nearest multiple of 9
   */
  nearestMultipleOf9: (value: number): number => {
    return Math.round(value / 9) * 9;
  },
  
  /**
   * Generate a sequence based on multiples of 3, 6, or 9
   * @param base - Base multiple (3, 6, or 9)
   * @param count - Number of items in the sequence
   * @returns Array of multiples
   */
  sequence: (base: 3 | 6 | 9, count: number): number[] => {
    return Array.from({ length: count }, (_, i) => base * (i + 1));
  },
  
  /**
   * Divide a space into a 3×3 grid
   * @param totalWidth - Total width of the space
   * @param totalHeight - Total height of the space
   * @returns Grid cell dimensions and positions
   */
  grid3x3: (totalWidth: number, totalHeight: number) => {
    const cellWidth = totalWidth / 3;
    const cellHeight = totalHeight / 3;
    
    return {
      cellWidth,
      cellHeight,
      positions: [
        { x: 0, y: 0 }, { x: cellWidth, y: 0 }, { x: cellWidth * 2, y: 0 },
        { x: 0, y: cellHeight }, { x: cellWidth, y: cellHeight }, { x: cellWidth * 2, y: cellHeight },
        { x: 0, y: cellHeight * 2 }, { x: cellWidth, y: cellHeight * 2 }, { x: cellWidth * 2, y: cellHeight * 2 }
      ]
    };
  }
};

/**
 * Fibonacci Utilities
 * Functions for working with Fibonacci sequence in design
 */
export const fibonacciUtils = {
  /**
   * Get the nth Fibonacci number
   * @param n - Position in the Fibonacci sequence (0-based)
   * @returns The nth Fibonacci number
   */
  get: (n: number): number => {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  },
  
  /**
   * Generate a Fibonacci sequence
   * @param count - Number of elements in the sequence
   * @returns Array of Fibonacci numbers
   */
  sequence: (count: number): number[] => {
    return Array.from({ length: count }, (_, i) => fibonacciUtils.get(i));
  },
  
  /**
   * Find the nearest Fibonacci number to a given value
   * @param value - Input value
   * @returns The nearest Fibonacci number
   */
  nearest: (value: number): number => {
    if (value <= 0) return 0;
    
    let a = 0, b = 1;
    while (b < value) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    
    // Return the closest of the two adjacent Fibonacci numbers
    return (b - value) < (value - a) ? b : a;
  }
};

/**
 * Sacred Geometry CSS Utilities
 * Helper functions for generating CSS values based on sacred geometry
 */
export const sacredCSS = {
  /**
   * Generate a golden gradient
   * @param primaryColor - Primary color 
   * @param secondaryColor - Secondary color
   * @returns CSS gradient string
   */
  goldenGradient: (primaryColor: string, secondaryColor: string): string => {
    return `linear-gradient(137.5deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  },
  
  /**
   * Generate a golden spiral gradient
   * @param primaryColor - Primary color
   * @param secondaryColor - Secondary color
   * @returns CSS conic gradient string
   */
  goldenSpiralGradient: (primaryColor: string, secondaryColor: string): string => {
    return `conic-gradient(from 0deg at 50% 50%, ${primaryColor} 0deg, ${secondaryColor} 137.5deg, ${primaryColor} 360deg)`;
  },
  
  /**
   * Generate a box shadow based on Fibonacci sequence
   * @param color - Shadow color
   * @param intensity - Shadow intensity (0-1)
   * @returns CSS box-shadow value
   */
  fibonacciShadow: (color: string, intensity: number = 0.5): string => {
    const alpha = Math.max(0, Math.min(1, intensity));
    return `
      0 1px 2px ${color}${Math.round(alpha * 0.05 * 100)}),
      0 2px 3px ${color}${Math.round(alpha * 0.10 * 100)}),
      0 3px 5px ${color}${Math.round(alpha * 0.15 * 100)}),
      0 5px 8px ${color}${Math.round(alpha * 0.20 * 100)}),
      0 8px 13px ${color}${Math.round(alpha * 0.25 * 100)})
    `;
  },
  
  /**
   * Generate a pattern of 3-6-9 based box shadow
   * @param color - Shadow color
   * @returns CSS box-shadow value
   */
  shadow369: (color: string): string => {
    return `
      0 3px 3px ${color}0.03),
      0 6px 6px ${color}0.06),
      0 9px 9px ${color}0.09)
    `;
  },
  
  /**
   * Generate a CSS grid based on sacred geometry
   * @param pattern - Grid pattern ('3x3', '6x6', '9x9', or 'golden')
   * @returns CSS grid template value
   */
  grid: (pattern: '3x3' | '6x6' | '9x9' | 'golden'): string => {
    switch (pattern) {
      case '3x3': return 'grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);';
      case '6x6': return 'grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(6, 1fr);';
      case '9x9': return 'grid-template-columns: repeat(9, 1fr); grid-template-rows: repeat(9, 1fr);';
      case 'golden': return `grid-template-columns: 1fr ${PHI}fr; grid-template-rows: 1fr ${PHI}fr;`;
      default: return 'grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);';
    }
  }
};

// Export utility types
export type SacredSpacing = keyof typeof spacing;
export type SacredGrid = keyof typeof grid.columns;
export type SacredAspectRatio = keyof typeof geometry.shapes.aspectRatio; 