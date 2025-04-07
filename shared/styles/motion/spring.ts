import { cubicBezier } from '@/lib/utils'

export const springs = {
  // Subtle, elegant motion for small UI elements
  subtle: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  
  // Responsive, snappy motion for interactive elements
  responsive: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  
  // Smooth, natural motion for larger UI transitions
  natural: {
    type: 'spring',
    stiffness: 250,
    damping: 35,
    mass: 1,
  },
  
  // Playful, bouncy motion for celebratory moments
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
} as const

export const easings = {
  // Ultra-smooth easing for elegant transitions
  elegant: cubicBezier(0.6, 0.01, 0.05, 0.95),
  
  // Energetic easing for engaging interactions
  energetic: cubicBezier(0.85, 0, 0.15, 1),
  
  // Gentle easing for subtle UI changes
  gentle: cubicBezier(0.4, 0.0, 0.2, 1),
  
  // Dramatic easing for emphasis
  dramatic: cubicBezier(0.85, 0, 0.15, 1),
} as const

export const transitions = {
  // Base transition settings
  base: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
  
  // Micro-interaction transitions
  micro: {
    duration: 0.15,
    ease: easings.energetic,
  },
  
  // Feature transitions
  feature: {
    duration: 0.3,
    ease: easings.elegant,
  },
  
  // Page transitions
  page: {
    duration: 0.4,
    ease: easings.dramatic,
  },
  
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  
  slow: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
} as const

// Gesture recognition thresholds
export const gestureThresholds = {
  tap: {
    timeThreshold: 200,
    distanceThreshold: 3,
  },
  swipe: {
    velocityThreshold: 0.3,
    distanceThreshold: 50,
  },
  press: {
    timeThreshold: 500,
    distanceThreshold: 5,
  },
} as const

// Haptic feedback patterns
export const haptics = {
  light: {
    duration: 10,
    strength: 'light',
  },
  medium: {
    duration: 15,
    strength: 'medium',
  },
  heavy: {
    duration: 20,
    strength: 'heavy',
  },
  success: [
    { duration: 10, strength: 'light' },
    { duration: 20, strength: 'medium' },
  ],
  error: [
    { duration: 30, strength: 'heavy' },
    { duration: 10, strength: 'light' },
  ],
} as const 