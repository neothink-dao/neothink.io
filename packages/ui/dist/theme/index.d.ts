/**
 * Theme exports for the UI package
 */
export { default as tokens } from './tokens';
export * from './tokens';
import { Platform } from '@neothink/types';
/**
 * Get colors for a specific platform
 * @param platform Platform identifier
 * @returns Color theme object for the platform
 */
export declare function getPlatformColors(platform: Platform): {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
} | {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
} | {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
} | {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
};
/**
 * Get a complete theme configuration for a platform
 * @param platform Platform identifier
 * @returns Complete theme object for the platform
 */
export declare function getPlatformTheme(platform: Platform): {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
    } | {
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
    } | {
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
    } | {
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
    };
    spacing: {
        px: string;
        0: string;
        0.5: string;
        1: string;
        1.5: string;
        2: string;
        2.5: string;
        3: string;
        3.5: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
        10: string;
        11: string;
        12: string;
        14: string;
        16: string;
        20: string;
        24: string;
        28: string;
        32: string;
        36: string;
        40: string;
        44: string;
        48: string;
        52: string;
        56: string;
        60: string;
        64: string;
        72: string;
        80: string;
        96: string;
    };
    typography: {
        fontSizes: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
            '5xl': string;
            '6xl': string;
            '7xl': string;
            '8xl': string;
            '9xl': string;
        };
        fontWeights: {
            thin: string;
            extralight: string;
            light: string;
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
            extrabold: string;
            black: string;
        };
        lineHeights: {
            none: string;
            tight: string;
            snug: string;
            normal: string;
            relaxed: string;
            loose: string;
        };
        letterSpacing: {
            tighter: string;
            tight: string;
            normal: string;
            wide: string;
            wider: string;
            widest: string;
        };
    };
    borderRadius: {
        none: string;
        sm: string;
        DEFAULT: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        full: string;
    };
    shadows: {
        sm: string;
        DEFAULT: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        inner: string;
        none: string;
    };
    animation: {
        durations: {
            fast: string;
            normal: string;
            slow: string;
            slower: string;
        };
        easings: {
            ease: string;
            easeIn: string;
            easeOut: string;
            easeInOut: string;
        };
    };
    zIndex: {
        0: string;
        10: string;
        20: string;
        30: string;
        40: string;
        50: string;
        auto: string;
    };
};
//# sourceMappingURL=index.d.ts.map