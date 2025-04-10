# Neothink DAO Hub Design System

## Overview

This design system document outlines the core principles, components, and token-based styling approach for the Neothink DAO Hub application. The system is designed to provide a cohesive user experience across all features while expressing the key token concepts (LUCK, LIVE, LOVE, LIFE) through consistent visual patterns.

## Token Color System

The application uses a token-based color system that assigns specific colors to each token type. These colors are used consistently throughout the application to reinforce the token concepts.

### Primary Token Colors

| Token | Main Color   | Gradient                        | Background | Text Color  | Border Color | Usage                      |
|-------|-------------|--------------------------------|------------|-------------|--------------|----------------------------|
| LUCK  | Blue        | from-blue-500 to-indigo-600    | bg-blue-50 | text-blue-700 | border-blue-200 | Insights, synchronicity    |
| LIVE  | Emerald     | from-emerald-500 to-green-600  | bg-emerald-50 | text-emerald-700 | border-emerald-200 | Vitality, health practices |
| LOVE  | Rose        | from-rose-500 to-pink-600      | bg-rose-50 | text-rose-700 | border-rose-200 | Connections, relationships |
| LIFE  | Amber       | from-amber-500 to-yellow-600   | bg-amber-50 | text-amber-700 | border-amber-200 | Wisdom, integration        |

### Subscription Tier Colors

| Tier          | Background     | Text Color      | Accent Color   | Usage                  |
|---------------|----------------|-----------------|----------------|------------------------|
| Free          | bg-gray-100    | text-gray-800   | border-gray-200 | Basic access           |
| Premium       | bg-purple-100  | text-purple-800 | border-purple-200 | Premium subscribers    |
| Superachiever | bg-indigo-100  | text-indigo-800 | border-indigo-200 | All-access subscribers |

## Typography

The application uses a consistent typographic scale:

- Headings: Inter font, with weights of 600-700
- Body: Inter font, with weights of 400-500
- Display: Inter font, with weights of 700-800

Font sizes follow a scale of:
- xs: 0.75rem
- sm: 0.875rem
- base: 1rem
- lg: 1.125rem
- xl: 1.25rem
- 2xl: 1.5rem
- 3xl: 1.875rem
- 4xl: 2.25rem

## Components

### Cards

Cards are a primary component used throughout the application. They have consistent styling with:
- Rounded corners (rounded-lg)
- Light borders
- Subtle shadows
- Padding consistency

Card variations exist for each token type, using the token's background and border colors.

### Buttons

Buttons use the token-based color system with:
- Primary buttons: Gradient backgrounds using token colors
- Secondary buttons: Lighter backgrounds with token-colored text
- Ghost buttons: Transparent with subtle hover states

### Badges

Badges are used to identify token types and subscription levels, using the token's background and text colors.

### Progress Indicators

Progress bars in the application use token-based gradients for visual consistency.

## Layout and Spacing

The application uses a consistent spacing system with a 4px base unit (0.25rem).
Common spacing values:
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)

## Accessibility

The design system ensures WCAG 2.2 AA compliance by:
- Maintaining sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Including focus states for all interactive elements
- Using semantic HTML5 elements
- Providing appropriate ARIA labels for interactive components
- Ensuring keyboard navigation support

## Animation and Motion

Subtle animations are used to enhance user experience:
- Hover effects: 150-200ms transitions
- Page transitions: 300ms fade transitions
- Loading states: Subtle pulse animations

## Responsive Design

The design system is built to be fully responsive with breakpoints at:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Icon System

The application uses Lucide React icons for consistency, with specific icons assigned to different feature areas.

## Design Principles

1. **Token Reinforcement**: Visual design reinforces the token concepts
2. **Clarity**: Clear visual hierarchy and user flow
3. **Consistency**: Consistent application of patterns and components
4. **Delight**: Subtle animations and interactions that delight users
5. **Accessibility**: Ensuring all users can access and use features effectively

## Implementation Notes

The design system is implemented using:
- Tailwind CSS v4 for styling
- shadcn/ui as the component foundation
- CSS variables for token colors
- CSS Grid and Flexbox for layouts
- Next.js 15 Server Components for optimized rendering

## 2025 Design Enhancements

The 2025 design system includes:
- Support for color themes (light/dark/system)
- Advanced motion design with view transitions API
- Variable font support for optimized typography
- Container queries for more contextual responsive design
- Enhanced accessibility features above WCAG requirements
- Advanced gradient and generative design patterns 