import { PHI } from './spacing';

/**
 * Animation timing system based on sacred geometry principles
 * Using Fibonacci sequence and Golden Ratio (φ)
 */
export const animation = {
  // Duration values based on Fibonacci sequence (ms)
  duration: {
    // Standard pattern multiples of 3
    instant: '0ms',
    '3xs': '3ms',
    '2xs': '6ms',
    'xs': '9ms',
    // Based on Fibonacci sequence
    'sm': '144ms',    // Fibonacci (12th number ÷ 10)
    'md': '233ms',    // Fibonacci (13th number ÷ 10)
    'lg': '377ms',    // Fibonacci (14th number ÷ 10)
    'xl': '610ms',    // Fibonacci (15th number ÷ 10)
    '2xl': '987ms',   // Fibonacci (16th number ÷ 10)
    '3xl': '1597ms',  // Fibonacci (17th number ÷ 10)
    // Specific multiples of 3, 6, and 9
    '3': '3ms',
    '6': '6ms',
    '9': '9ms',
    '18': '18ms',
    '27': '27ms',
    '36': '36ms',
    '45': '45ms',
    '54': '54ms',
    '63': '63ms',
    '72': '72ms',
    '81': '81ms',
    '90': '90ms',
    '99': '99ms',
    '144': '144ms',
    '233': '233ms',
    '377': '377ms',
    '610': '610ms',
    '987': '987ms',
  },

  // Easing functions based on sacred geometry and natural movement
  easing: {
    // Standard
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Golden ratio based cubic-bezier curves 
    // φ and its derivatives are used as control points
    goldenEaseIn: `cubic-bezier(0, ${1/PHI}, ${1-1/PHI}, 1)`,
    goldenEaseOut: `cubic-bezier(${1/PHI}, 0, 1, ${1-1/PHI})`,
    goldenEaseInOut: `cubic-bezier(${1/PHI}, 0, ${1-1/PHI}, 1)`,
    
    // Patterns of 3, 6, and 9 in control points
    pattern3: 'cubic-bezier(0.3, 0.3, 0.3, 0.3)',
    pattern6: 'cubic-bezier(0.6, 0.6, 0.6, 0.6)',
    pattern9: 'cubic-bezier(0.9, 0.9, 0.9, 0.9)',
    
    // Natural movement based on golden ratio
    natural: `cubic-bezier(${1/PHI}, 0, 0, 1)`,
    bounce: `cubic-bezier(0.${1/PHI*100}, ${1.5-(1/PHI)}, 0.${PHI*100}, 1)`,
    elastic: `cubic-bezier(${0.7-(1/PHI)}, 0, ${0.1+(1/PHI)}, 1.5)`,
  },

  // Delay values based on Fibonacci sequence (ms)
  delay: {
    none: '0ms',
    '3': '3ms',
    '6': '6ms',
    '9': '9ms',
    '21': '21ms',     // Fibonacci
    '34': '34ms',     // Fibonacci
    '55': '55ms',     // Fibonacci
    '89': '89ms',     // Fibonacci
    '144': '144ms',   // Fibonacci
    '233': '233ms',   // Fibonacci
    '377': '377ms',   // Fibonacci
  },

  // Transition presets combining duration, easing, and properties
  transition: {
    default: 'all 233ms cubic-bezier(0.618, 0, 0.382, 1)',
    fast: 'all 144ms cubic-bezier(0.618, 0, 0.382, 1)',
    slow: 'all 377ms cubic-bezier(0.618, 0, 0.382, 1)',
    
    // Property-specific transitions
    color: 'color 233ms cubic-bezier(0.618, 0, 0.382, 1)',
    transform: 'transform 233ms cubic-bezier(0.618, 0, 0.382, 1)',
    opacity: 'opacity 233ms cubic-bezier(0.618, 0, 0.382, 1)',
    shadow: 'box-shadow 233ms cubic-bezier(0.618, 0, 0.382, 1)',
    
    // Compound transitions
    fastHeight: 'height 144ms cubic-bezier(0.618, 0, 0.382, 1)',
    fastColorOpacity: 'color 144ms cubic-bezier(0.618, 0, 0.382, 1), opacity 144ms cubic-bezier(0.618, 0, 0.382, 1)',
  },

  // Keyframes configurations
  keyframes: {
    // Rotation at the golden angle (137.5°)
    goldenRotate: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(137.5deg)' },
    },
    
    // Pulse based on the golden ratio
    goldenPulse: {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: `scale(${1/PHI})` },
      '100%': { transform: 'scale(1)' },
    },
    
    // Fibonacci-based 3-step scale
    fibonacciScale: {
      '0%': { transform: 'scale(1)' },
      '33.33%': { transform: 'scale(1.618)' },
      '66.66%': { transform: 'scale(2.618)' }, // φ² + 1
      '100%': { transform: 'scale(1)' },
    },
    
    // 3-6-9 pattern for opacity
    pattern369Fade: {
      '0%': { opacity: '0' },
      '33.33%': { opacity: '0.3' }, // 3/9
      '66.66%': { opacity: '0.6' }, // 6/9
      '100%': { opacity: '0.9' },   // 9/9
    },
  },

  // Animation presets combining keyframes, duration, and easing
  preset: {
    golden: {
      animation: 'goldenRotate 610ms cubic-bezier(0.618, 0, 0.382, 1) infinite',
    },
    pulse: {
      animation: 'goldenPulse 987ms cubic-bezier(0.618, 0, 0.382, 1) infinite',
    },
    fibonacci: {
      animation: 'fibonacciScale 1597ms cubic-bezier(0.618, 0, 0.382, 1) infinite',
    },
    pattern369: {
      animation: 'pattern369Fade 999ms cubic-bezier(0.3, 0.6, 0.9, 1) infinite',
    },
  },
} as const;

// Type definitions 
export type AnimationDuration = keyof typeof animation.duration;
export type AnimationEasing = keyof typeof animation.easing;
export type AnimationDelay = keyof typeof animation.delay;
export type TransitionPreset = keyof typeof animation.transition;
export type KeyframeAnimation = keyof typeof animation.keyframes;
export type AnimationPreset = keyof typeof animation.preset; 