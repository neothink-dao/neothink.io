# UI Package Documentation

The `@neothink/ui` package provides a set of reusable UI components for all Neothink platforms. It follows a consistent design language and provides a solid foundation for building user interfaces.

## Installation

```bash
# This package is included in the monorepo and doesn't need to be installed separately
# For local development, make sure to build the package
pnpm --filter=@neothink/ui build
```

## Components

### Button

A versatile button component with multiple variants and sizes:

```tsx
import { Button } from '@neothink/ui';

function MyComponent() {
  return (
    <div>
      <Button>Default Button</Button>
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="link">Link Button</Button>
      <Button variant="destructive">Destructive Button</Button>
      <Button variant="success">Success Button</Button>
      
      {/* Platform-specific variants */}
      <Button variant="ascenders">Ascenders Button</Button>
      <Button variant="immortals">Immortals Button</Button>
      <Button variant="neothinkers">Neothinkers Button</Button>
      
      {/* Size variants */}
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="2xl">2XL</Button>
      <Button size="icon">Icon</Button>
      
      {/* Width variants */}
      <Button width="auto">Auto Width</Button>
      <Button width="full">Full Width</Button>
      
      {/* With loading state */}
      <Button isLoading>Loading</Button>
      
      {/* With icons */}
      <Button leftIcon={<Icon />}>With Left Icon</Button>
      <Button rightIcon={<Icon />}>With Right Icon</Button>
    </div>
  );
}
```

### Input

A versatile input component with multiple variants and states:

```tsx
import { Input } from '@neothink/ui';

function MyComponent() {
  return (
    <div>
      <Input placeholder="Default input" />
      
      {/* Size variants */}
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
      
      {/* State variants */}
      <Input state="default" placeholder="Default state" />
      <Input state="error" placeholder="Error state" />
      <Input state="success" placeholder="Success state" />
      
      {/* With error message */}
      <Input error="This field is required" />
      
      {/* With left/right elements */}
      <Input leftElement={<Icon />} placeholder="With left icon" />
      <Input rightElement={<Icon />} placeholder="With right icon" />
      
      {/* Specific input types */}
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
    </div>
  );
}
```

## Utilities

### cn (class name utility)

A utility for conditionally joining class names:

```tsx
import { cn } from '@neothink/ui';

function MyComponent({ className, variant }) {
  return (
    <div
      className={cn(
        'base-styles',
        variant === 'primary' && 'primary-styles',
        variant === 'secondary' && 'secondary-styles',
        className
      )}
    >
      Content
    </div>
  );
}
```

## Design System

The UI package implements a cohesive design system based on Tailwind CSS with consistent:

- Typography
- Colors
- Spacing
- Border radius
- Shadows
- Component variants

### Theming

The components are designed to work with Tailwind CSS themes:

```ts
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Base colors
        primary: {
          DEFAULT: '#007bff',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6c757d',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#dc3545',
          foreground: '#ffffff',
        },
        
        // Platform-specific colors
        ascenders: '#FFD700',
        immortals: '#4169E1',
        neothinkers: '#228B22',
        
        // ... other colors
      },
    },
  },
};
```

## Best Practices

1. **Component Consistency**: Use the provided components consistently across the application.

2. **Customization**: Customize components using the provided props rather than adding new variants.

3. **Responsive Design**: Use the responsive variants provided by Tailwind CSS.

4. **Accessibility**: Ensure all components are accessible.

5. **Performance**: Minimize component re-renders.

6. **Documentation**: Document any custom components built on top of the UI package.

## Extension

To extend the UI package with new components:

1. Create a new component in the package.
2. Follow the existing patterns for props, variants, and styles.
3. Update the exports in `packages/ui/src/index.ts`.
4. Build the package.

```tsx
// packages/ui/src/components/NewComponent.tsx
'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const newComponentVariants = cva(
  'base-styles',
  {
    variants: {
      variant: {
        default: 'default-styles',
        primary: 'primary-styles',
        // ... other variants
      },
      size: {
        sm: 'small-styles',
        md: 'medium-styles',
        lg: 'large-styles',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface NewComponentProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof newComponentVariants> {
  // Additional props
}

export const NewComponent: React.FC<NewComponentProps> = ({
  className,
  variant,
  size,
  ...props
}) => {
  return (
    <div
      className={cn(newComponentVariants({ variant, size }), className)}
      {...props}
    />
  );
};

export default NewComponent;
```

Then update the exports:

```tsx
// packages/ui/src/index.ts
export { NewComponent } from './components/NewComponent';
``` 