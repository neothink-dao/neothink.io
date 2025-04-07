export const typography = {
  fontFamily: {
    sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    mono: ['var(--font-inter)', 'system-ui', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
    '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
    '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  // Text styles
  textStyles: {
    hero: {
      fontSize: '7xl',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: '1.1',
    },
    h1: {
      fontSize: '5xl',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
    },
    h2: {
      fontSize: '4xl',
      fontWeight: 'semibold',
      letterSpacing: '-0.02em',
      lineHeight: '1.3',
    },
    h3: {
      fontSize: '3xl',
      fontWeight: 'semibold',
      letterSpacing: '-0.02em',
      lineHeight: '1.4',
    },
    h4: {
      fontSize: '2xl',
      fontWeight: 'semibold',
      letterSpacing: '-0.01em',
      lineHeight: '1.5',
    },
    h5: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      letterSpacing: '0',
      lineHeight: '1.5',
    },
    h6: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      letterSpacing: '0',
      lineHeight: '1.5',
    },
    body: {
      fontSize: 'base',
      fontWeight: 'normal',
      letterSpacing: '0',
      lineHeight: '1.6',
    },
    small: {
      fontSize: 'sm',
      fontWeight: 'normal',
      letterSpacing: '0',
      lineHeight: '1.5',
    },
    tiny: {
      fontSize: 'xs',
      fontWeight: 'normal',
      letterSpacing: '0',
      lineHeight: '1.5',
    },
    display: {
      fontSize: '8xl',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: '1',
    },
    code: {
      fontFamily: 'mono',
      fontSize: 'sm',
      fontWeight: 'normal',
      letterSpacing: '0',
      lineHeight: '1.6',
    },
  },
  // Responsive typography presets
  responsive: {
    fluid: {
      minFontSize: '1rem',
      maxFontSize: '1.25rem',
      minWidth: '320px',
      maxWidth: '1920px',
    },
    adaptive: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
} as const

// Type definitions
export type FontFamily = keyof typeof typography.fontFamily
export type FontSize = keyof typeof typography.fontSize
export type FontWeight = keyof typeof typography.fontWeight
export type LetterSpacing = keyof typeof typography.letterSpacing
export type TextStyle = keyof typeof typography.textStyles 