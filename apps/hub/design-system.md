# Neothink DAO Hub Design System

## Overview

This design system document outlines the core principles and components for the Neothink DAO Hub application. The system is designed to provide a cohesive user experience across all features.

## Color System

The application uses a cohesive color system that reinforces the platform's core concepts through consistent visual patterns.

### Primary Colors

| Purpose     | Main Color   | Gradient                        | Background | Text Color  | Border Color | Usage                      |
|-------------|-------------|--------------------------------|------------|-------------|--------------|----------------------------|
| Primary     | Blue        | from-blue-500 to-indigo-600    | bg-blue-50 | text-blue-700 | border-blue-200 | Primary actions, focus     |
| Secondary   | Emerald     | from-emerald-500 to-green-600  | bg-emerald-50 | text-emerald-700 | border-emerald-200 | Success, progress |
| Accent      | Rose        | from-rose-500 to-pink-600      | bg-rose-50 | text-rose-700 | border-rose-200 | Highlights, attention |
| Special     | Amber       | from-amber-500 to-yellow-600   | bg-amber-50 | text-amber-700 | border-amber-200 | Important features        |

### Status Colors

| Status      | Background   | Text Color    | Border Color   | Usage               |
|-------------|-------------|---------------|----------------|---------------------|
| Success     | bg-green-100  | text-green-800 | border-green-200 | Successful actions  |
| Warning     | bg-yellow-100 | text-yellow-800| border-yellow-200| Warning states      |
| Error       | bg-red-100    | text-red-800   | border-red-200   | Error states        |
| Info        | bg-blue-100   | text-blue-800  | border-blue-200  | Information states  |

## Typography

### Font Family
- Primary: Inter
- Secondary: system-ui
- Monospace: ui-monospace

### Font Sizes
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
Card variations exist for different content types, using appropriate background and border colors.

### Buttons
Buttons use the color system with:
- Primary buttons: Gradient backgrounds
- Secondary buttons: Lighter backgrounds with colored text
- Tertiary buttons: Ghost style with colored borders

### Badges
Badges are used to identify different types of content and status levels.

### Progress Bars
Progress bars use gradients for visual consistency.

### Forms
- Input fields have consistent padding and border radius
- Focus states use primary color
- Error states use error colors
- Success states use success colors

### Navigation
- Active states use primary color
- Hover states use lighter variants
- Mobile-friendly tap targets

### Modals
- Consistent padding and border radius
- Backdrop blur effect
- Smooth transitions

### Lists
- Consistent spacing
- Clear hierarchy
- Interactive states

### Icons
- Consistent size system
- Color matches text
- Optional background shapes

## Layout

### Grid System
- 12-column grid
- Responsive breakpoints
- Consistent gutters

### Spacing
- 4px base unit
- Consistent spacing scale
- Responsive adjustments

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Animation

### Transitions
- Duration: 150ms
- Timing: ease-in-out
- Consistent across components

### Loading States
- Skeleton loading
- Spinner animation
- Progress indicators

## Best Practices

1. **Visual Hierarchy**: Clear content hierarchy
2. **Consistency**: Use established patterns
3. **Accessibility**: Follow WCAG guidelines
4. **Responsiveness**: Mobile-first approach
5. **Performance**: Optimize assets

## Implementation

### CSS Structure
- Tailwind utility classes
- Custom CSS variables
- Consistent naming

### Component Library
- Reusable components
- Proper documentation
- Usage examples

### Version Control
- Semantic versioning
- Change documentation
- Migration guides

## Resources

- Figma Design Files
- Component Storybook
- Icon Library
- Color Palette 