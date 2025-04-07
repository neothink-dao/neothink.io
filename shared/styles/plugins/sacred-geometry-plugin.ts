import plugin from 'tailwindcss/plugin';
import { PHI } from '../tokens/spacing';
import { spacing, grid, fibonacci } from '../tokens/spacing';
import { geometry } from '../tokens/geometry';
import { animation } from '../tokens/animation';

/**
 * Sacred Geometry Tailwind Plugin
 * 
 * Extends Tailwind CSS with utility classes based on sacred geometry principles:
 * - Golden Ratio (φ) based spacing and sizing
 * - Fibonacci sequence scales
 * - Patterns of 3, 6, and 9
 * - Sacred geometry shapes and proportions
 */
export const sacredGeometryPlugin = plugin(
  ({ addUtilities, matchUtilities, theme }) => {
    // Add spacing utilities based on sacred geometry
    addUtilities({
      // Golden ratio container
      '.golden-container': {
        maxWidth: '1618px',  // 1000 × φ (rounded)
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: spacing.md,
      },

      // 3-6-9 pattern container breakpoints
      '.container-3': {
        maxWidth: '333px',
      },
      '.container-6': {
        maxWidth: '666px',
      },
      '.container-9': {
        maxWidth: '999px',
      },

      // Aspect ratios based on sacred geometry
      '.aspect-golden': {
        aspectRatio: String(PHI),
      },
      '.aspect-golden-inverse': {
        aspectRatio: String(1 / PHI),
      },
      '.aspect-phi3': {
        aspectRatio: String(PHI * PHI * PHI),
      },
      '.aspect-fibonacci-5-3': {
        aspectRatio: '5/3',
      },
      '.aspect-fibonacci-8-5': {
        aspectRatio: '8/5',
      },
      '.aspect-fibonacci-13-8': {
        aspectRatio: '13/8',
      },

      // Grid templates based on sacred geometry
      '.grid-cols-3': {
        gridTemplateColumns: grid.columns['3'],
      },
      '.grid-cols-6': {
        gridTemplateColumns: grid.columns['6'],
      },
      '.grid-cols-9': {
        gridTemplateColumns: grid.columns['9'],
      },
      '.grid-cols-phi': {
        gridTemplateColumns: geometry.shapes.aspectRatio.golden,
      },
      '.grid-golden-section': {
        gridTemplateColumns: grid.templates.goldenSection,
      },
      '.grid-golden-thirds': {
        gridTemplateColumns: grid.templates.goldenThirds,
      },
      '.grid-phi3': {
        gridTemplateColumns: grid.templates.phi3Grid,
      },

      // Border radii based on sacred geometry
      '.rounded-golden': {
        borderRadius: geometry.shapes.borderRadius.golden,
      },
      '.rounded-phi3': {
        borderRadius: geometry.shapes.borderRadius.phi3,
      },
      '.rounded-phi6': {
        borderRadius: geometry.shapes.borderRadius.phi6,
      },
      '.rounded-phi9': {
        borderRadius: geometry.shapes.borderRadius.phi9,
      },

      // Box shadows based on sacred geometry
      '.shadow-fibonacci': {
        boxShadow: `
          0 1px 2px rgba(0, 0, 0, 0.05),
          0 2px 3px rgba(0, 0, 0, 0.1),
          0 3px 5px rgba(0, 0, 0, 0.15),
          0 5px 8px rgba(0, 0, 0, 0.2),
          0 8px 13px rgba(0, 0, 0, 0.25)
        `,
      },
      '.shadow-369': {
        boxShadow: `
          0 3px 3px rgba(0, 0, 0, 0.03),
          0 6px 6px rgba(0, 0, 0, 0.06),
          0 9px 9px rgba(0, 0, 0, 0.09)
        `,
      },

      // Golden ratio transitions
      '.transition-golden': {
        transition: animation.transition.default,
      },
      '.transition-golden-fast': {
        transition: animation.transition.fast,
      },
      '.transition-golden-slow': {
        transition: animation.transition.slow,
      },

      // Golden ratio transforms
      '.scale-phi': {
        transform: `scale(${PHI})`,
      },
      '.scale-phi-inverse': {
        transform: `scale(${1 / PHI})`,
      },

      // Golden ratio animations
      '.animate-golden-pulse': {
        animation: animation.preset.pulse.animation,
      },
      '.animate-fibonacci': {
        animation: animation.preset.fibonacci.animation,
      },
      '.animate-369': {
        animation: animation.preset.pattern369.animation,
      },
    });

    // Create dynamic spacing utilities using sacred geometry values
    matchUtilities(
      {
        // Golden ratio margins
        'golden-m': (value) => ({
          margin: value,
        }),
        'golden-mx': (value) => ({
          marginLeft: value,
          marginRight: value,
        }),
        'golden-my': (value) => ({
          marginTop: value,
          marginBottom: value,
        }),
        'golden-mt': (value) => ({
          marginTop: value,
        }),
        'golden-mr': (value) => ({
          marginRight: value,
        }),
        'golden-mb': (value) => ({
          marginBottom: value,
        }),
        'golden-ml': (value) => ({
          marginLeft: value,
        }),

        // Golden ratio paddings
        'golden-p': (value) => ({
          padding: value,
        }),
        'golden-px': (value) => ({
          paddingLeft: value,
          paddingRight: value,
        }),
        'golden-py': (value) => ({
          paddingTop: value,
          paddingBottom: value,
        }),
        'golden-pt': (value) => ({
          paddingTop: value,
        }),
        'golden-pr': (value) => ({
          paddingRight: value,
        }),
        'golden-pb': (value) => ({
          paddingBottom: value,
        }),
        'golden-pl': (value) => ({
          paddingLeft: value,
        }),

        // Golden ratio gaps
        'golden-gap': (value) => ({
          gap: value,
        }),
        'golden-gap-x': (value) => ({
          columnGap: value,
        }),
        'golden-gap-y': (value) => ({
          rowGap: value,
        }),
      },
      {
        // Use our sacred geometry spacing values
        values: spacing,
      }
    );

    // Add fibonacci sequence based sizing utilities
    matchUtilities(
      {
        'fib-w': (value) => ({
          width: value,
        }),
        'fib-h': (value) => ({
          height: value,
        }),
        'fib-size': (value) => ({
          width: value,
          height: value,
        }),
        'fib-max-w': (value) => ({
          maxWidth: value,
        }),
        'fib-max-h': (value) => ({
          maxHeight: value,
        }),
        'fib-min-w': (value) => ({
          minWidth: value,
        }),
        'fib-min-h': (value) => ({
          minHeight: value,
        }),
      },
      {
        values: fibonacci.scale,
      }
    );
  },
  {
    theme: {
      extend: {
        // Extend Tailwind's theme with our sacred geometry values
        spacing: {
          ...spacing,
        },
        borderRadius: {
          ...geometry.shapes.borderRadius,
        },
        aspectRatio: {
          golden: String(PHI),
          'golden-inverse': String(1 / PHI),
          ...geometry.shapes.aspectRatio.fibonacci,
        },
        animation: {
          'golden-pulse': animation.preset.pulse.animation,
          'fibonacci': animation.preset.fibonacci.animation,
          'pattern369': animation.preset.pattern369.animation,
        },
        keyframes: {
          'golden-pulse': animation.keyframes.goldenPulse,
          'fibonacci-scale': animation.keyframes.fibonacciScale,
          'pattern369-fade': animation.keyframes.pattern369Fade,
        },
        transitionTimingFunction: {
          'golden-in': animation.easing.goldenEaseIn,
          'golden-out': animation.easing.goldenEaseOut,
          'golden-in-out': animation.easing.goldenEaseInOut,
          'natural': animation.easing.natural,
          'pattern3': animation.easing.pattern3,
          'pattern6': animation.easing.pattern6,
          'pattern9': animation.easing.pattern9,
        },
        transitionDuration: {
          ...animation.duration,
        },
        gridTemplateColumns: {
          ...grid.columns,
          'golden-section': grid.templates.goldenSection,
          'golden-thirds': grid.templates.goldenThirds,
          'phi3': grid.templates.phi3Grid,
        },
        scale: {
          'phi': String(PHI),
          'phi-inverse': String(1 / PHI),
          'phi2': String(PHI * PHI),
          'phi3': String(PHI * PHI * PHI),
        },
      },
    },
  }
);

export default sacredGeometryPlugin; 