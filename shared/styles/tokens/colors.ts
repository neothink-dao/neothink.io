export const colors = {
  // Base colors
  zinc: {
    50: 'rgb(250 250 250)',
    100: 'rgb(244 244 245)',
    200: 'rgb(228 228 231)',
    300: 'rgb(212 212 216)',
    400: 'rgb(161 161 170)',
    500: 'rgb(113 113 122)',
    600: 'rgb(82 82 91)',
    700: 'rgb(63 63 70)',
    800: 'rgb(39 39 42)',
    900: 'rgb(24 24 27)',
    950: 'rgb(9 9 11)',
  },
  amber: {
    50: 'rgb(255 251 235)',
    100: 'rgb(254 243 199)',
    200: 'rgb(253 230 138)',
    300: 'rgb(252 211 77)',
    400: 'rgb(251 191 36)',
    500: 'rgb(245 158 11)',
    600: 'rgb(217 119 6)',
    700: 'rgb(180 83 9)',
    800: 'rgb(146 64 14)',
    900: 'rgb(120 53 15)',
    950: 'rgb(69 26 3)',
  },
  orange: {
    50: 'rgb(255 247 237)',
    100: 'rgb(255 237 213)',
    200: 'rgb(254 215 170)',
    300: 'rgb(253 186 116)',
    400: 'rgb(251 146 60)',
    500: 'rgb(249 115 22)',
    600: 'rgb(234 88 12)',
    700: 'rgb(194 65 12)',
    800: 'rgb(154 52 18)',
    900: 'rgb(124 45 18)',
    950: 'rgb(67 20 7)',
  },
  red: {
    50: 'rgb(254 242 242)',
    100: 'rgb(254 226 226)',
    200: 'rgb(254 202 202)',
    300: 'rgb(252 165 165)',
    400: 'rgb(248 113 113)',
    500: 'rgb(239 68 68)',
    600: 'rgb(220 38 38)',
    700: 'rgb(185 28 28)',
    800: 'rgb(153 27 27)',
    900: 'rgb(127 29 29)',
    950: 'rgb(69 10 10)',
  },
} as const;

// Platform-specific themes
export const platformThemes = {
  // Hub theme with zinc base and amber-orange-red gradient
  hub: {
    neutral: colors.zinc,
    accent: {
      gradient: {
        from: colors.amber[500],
        via: colors.orange[500],
        to: colors.red[500],
      }
    },
    // Common to all platforms - zinc-based
    background: {
      light: colors.zinc[50],
      dark: colors.zinc[950],
    },
    foreground: {
      light: colors.zinc[950],
      dark: colors.zinc[50],
    },
    muted: {
      light: colors.zinc[100],
      dark: colors.zinc[800],
    },
    mutedForeground: {
      light: colors.zinc[500],
      dark: colors.zinc[400],
    },
  },
  // Ascenders theme with zinc base and orange accent
  ascenders: {
    neutral: colors.zinc,
    accent: colors.orange,
    // Common to all platforms - zinc-based
    background: {
      light: colors.zinc[50],
      dark: colors.zinc[950],
    },
    foreground: {
      light: colors.zinc[950],
      dark: colors.zinc[50],
    },
    muted: {
      light: colors.zinc[100],
      dark: colors.zinc[800],
    },
    mutedForeground: {
      light: colors.zinc[500],
      dark: colors.zinc[400],
    },
  },
  // Neothinkers theme with zinc base and amber accent
  neothinkers: {
    neutral: colors.zinc,
    accent: colors.amber,
    // Common to all platforms - zinc-based
    background: {
      light: colors.zinc[50],
      dark: colors.zinc[950],
    },
    foreground: {
      light: colors.zinc[950],
      dark: colors.zinc[50],
    },
    muted: {
      light: colors.zinc[100],
      dark: colors.zinc[800],
    },
    mutedForeground: {
      light: colors.zinc[500],
      dark: colors.zinc[400],
    },
  },
  // Immortals theme with zinc base and red accent
  immortals: {
    neutral: colors.zinc,
    accent: colors.red,
    // Common to all platforms - zinc-based
    background: {
      light: colors.zinc[50],
      dark: colors.zinc[950],
    },
    foreground: {
      light: colors.zinc[950],
      dark: colors.zinc[50],
    },
    muted: {
      light: colors.zinc[100],
      dark: colors.zinc[800],
    },
    mutedForeground: {
      light: colors.zinc[500],
      dark: colors.zinc[400],
    },
  },
} as const;

// State and interaction colors
export const stateColors = {
  hover: {
    light: 'rgba(0, 0, 0, 0.05)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },
  focus: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(255, 255, 255, 0.2)',
  },
  active: {
    light: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

// Sacred geometry gradient functions based on golden angle (137.5°)
export const sacredGradients = {
  // Amber-orange-red gradient (for go.neothink.io)
  hubGradient: `linear-gradient(137.5deg, ${colors.amber[500]} 0%, ${colors.orange[500]} 50%, ${colors.red[500]} 100%)`,
  
  // Platform-specific gradients with accent to neutral transitions
  ascendersGradient: (opacity = 1) => 
    `linear-gradient(137.5deg, ${colors.orange[500]} 0%, rgba(${colors.zinc[700]}, ${opacity}) 100%)`,
  
  neothinkersGradient: (opacity = 1) => 
    `linear-gradient(137.5deg, ${colors.amber[500]} 0%, rgba(${colors.zinc[700]}, ${opacity}) 100%)`,
  
  immortalsGradient: (opacity = 1) => 
    `linear-gradient(137.5deg, ${colors.red[500]} 0%, rgba(${colors.zinc[700]}, ${opacity}) 100%)`,
};

export type ColorToken = keyof typeof colors;
export type ColorShade = keyof typeof colors.zinc;
export type PlatformTheme = keyof typeof platformThemes; 