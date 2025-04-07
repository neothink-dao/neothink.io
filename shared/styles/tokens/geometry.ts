import { PHI } from './spacing';

/**
 * Sacred Geometry Constants
 */
export const geometry = {
  // Key ratios and constants
  ratios: {
    phi: PHI,                    // Golden Ratio (φ)
    inversePhi: 0.618033988749895, // 1/φ
    sqrt5: 2.236067977499, // √5
    sqrt2: 1.414213562373, // √2
    sqrt3: 1.732050807569, // √3
    pi: Math.PI,           // π
  },

  // Shapes and proportions based on sacred geometry
  shapes: {
    // Border radii based on sacred geometry
    borderRadius: {
      circle: '50%', 
      spherical: '100%',
      golden: '61.8%',   // Based on golden ratio
      phi3: '38.2%',     // φ-3 proportion
      phi6: '16.18%',    // Approximation of φ-6
      phi9: '6.18%',     // Approximation of φ-9
    },
    
    // Aspect ratios based on sacred geometry
    aspectRatio: {
      golden: `${PHI}`,  // 1:1.618 (golden ratio)
      silverRatio: '1.414',  // 1:√2
      square: '1',
      // Fibonacci sequence derived ratios
      fibonacci: {
        '1_1': '1', // 1/1 = 1
        '2_1': '2', // 2/1 = 2
        '3_2': '1.5', // 3/2 = 1.5
        '5_3': '1.667', // 5/3 ≈ 1.667
        '8_5': '1.6', // 8/5 = 1.6
        '13_8': '1.625', // 13/8 = 1.625
        '21_13': '1.615', // 21/13 ≈ 1.615
      },
    }
  },
  
  // UI patterns following sacred geometry principles
  patterns: {
    grid3: {
      columns: 3,
      rows: 3,
    },
    grid6: {
      columns: 6,
      rows: 6,
    },
    grid9: {
      columns: 9,
      rows: 9,
    },
    goldenSpiral: {
      ratio: PHI,
      direction: 'clockwise',
    },
    vesicaPisces: {
      overlap: '33%', // One-third overlap creating vesica pisces
    },
    triquetra: {
      circles: 3,
      overlap: '50%',
    }
  },
  
  // Golden angle and circular divisions
  angles: {
    golden: 137.5, // Golden angle in degrees (360° × (1 - 1/φ))
    // Divisions of a circle (in degrees)
    divisions: {
      '3': 120,   // 360° ÷ 3 (triangle)
      '6': 60,    // 360° ÷ 6 (hexagon)
      '9': 40,    // 360° ÷ 9
      '12': 30,   // 360° ÷ 12 (dodecagon)
    }
  },

  // Size scale transformations based on powers of phi
  scale: {
    'phi': PHI,                  // φ¹
    'phi2': PHI * PHI,           // φ²
    'phi3': PHI * PHI * PHI,     // φ³
    'phi-1': 1 / PHI,            // φ⁻¹
    'phi-2': 1 / (PHI * PHI),    // φ⁻²
    'phi-3': 1 / (PHI * PHI * PHI), // φ⁻³
  },
  
  // Fractal patterns with self-similarity
  fractals: {
    recursionLevels: {
      minimum: 3,
      standard: 6,
      detailed: 9,
    },
    scaleFactor: {
      golden: 1 / PHI, // Scale by inverse phi for harmonious reduction
      thirds: 1 / 3,   // Scale by one third (pattern of 3)
      sixths: 1 / 6,   // Scale by one sixth (pattern of 6)
      ninths: 1 / 9,   // Scale by one ninth (pattern of 9)
    }
  }
} as const;

// Type definitions
export type GeometryRatio = keyof typeof geometry.ratios;
export type BorderRadius = keyof typeof geometry.shapes.borderRadius;
export type AspectRatio = keyof typeof geometry.shapes.aspectRatio;
export type FibonacciRatio = keyof typeof geometry.shapes.aspectRatio.fibonacci;
export type AngleDivision = keyof typeof geometry.angles.divisions;
export type PhiScale = keyof typeof geometry.scale;
export type FractalLevel = keyof typeof geometry.fractals.recursionLevels; 