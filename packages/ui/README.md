# Neothink UI Package

A shared UI component library for Neothink platforms with Supabase integration.

## Features

- Consistent design system across all platforms
- Authentication components using Supabase UI Library
- Platform-specific styling with theme support
- React components with TypeScript support

## Installation

The package is automatically available in the monorepo:

```bash
# If you need to install dependencies
pnpm install
```

## Usage

### Authentication Components

```tsx
import { SignIn, SignUp, ResetPassword } from '@neothink/ui';
import type { Platform } from '@neothink/types';

// Basic usage
function LoginPage() {
  return <SignIn />;
}

// With customization
function CustomLoginPage() {
  const platform: Platform = 'ascenders';
  
  return (
    <SignIn 
      platform={platform}
      redirectTo="/dashboard"
      appearance={{ theme: 'dark' }}
      socialProviders={['google', 'github']}
    />
  );
}
```

### Theme Usage

```tsx
import { getTheme } from '@neothink/ui';
import type { Platform } from '@neothink/types';

function ThemedComponent({ platform }: { platform: Platform }) {
  const theme = getTheme(platform);
  
  // Access theme properties
  const { colors, typography, spacing } = theme;
  
  return (
    <div style={{ 
      backgroundColor: colors.background,
      color: colors.text,
      padding: spacing[4],
      fontFamily: typography.fontFamily.sans,
    }}>
      <h1 style={{ 
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
      }}>
        Themed Component
      </h1>
    </div>
  );
}
```

### UI Components

```tsx
import { Button, Card, Input } from '@neothink/ui';
import type { Platform } from '@neothink/types';

function ExampleForm({ platform }: { platform: Platform }) {
  return (
    <Card platform={platform}>
      <h2>Contact Form</h2>
      
      <Input 
        platform={platform}
        label="Email"
        type="email"
        placeholder="Enter your email"
      />
      
      <Button 
        platform={platform} 
        variant="primary"
        size="lg"
      >
        Submit
      </Button>
    </Card>
  );
}
```

## Components

### Auth Components

- `Auth` - Main authentication component with view control
- `SignIn` - Sign in form
- `SignUp` - Sign up form
- `ResetPassword` - Password reset request form
- `UpdatePassword` - Password update form

### UI Components

- `Button` - Flexible button component with variants
- `Card` - Content container with elevation
- `Input` - Form input fields
- `Layout` - Page layout components

### Theme Utilities

- `getTheme` - Get theme configuration for a platform
- `platformColors` - Color schemes for each platform
- `typography` - Typography scale
- `spacing` - Spacing scale
- `borderRadius` - Border radius scale
- `shadows` - Box shadow scale

## Customization

The UI package is designed to be customizable per platform while maintaining consistency:

```tsx
import { Button } from '@neothink/ui';

// Platform-specific styling
function PlatformButton() {
  return (
    <>
      <Button platform="hub">Hub Button</Button>
      <Button platform="ascenders">Ascenders Button</Button>
      <Button platform="neothinkers">Neothinkers Button</Button>
      <Button platform="immortals">Immortals Button</Button>
    </>
  );
}
```

## Best Practices

1. Always specify the `platform` prop to ensure consistent styling
2. Use the theme utilities for custom components
3. Prefer composition over inheritance when extending components
4. Follow the component API documentation for proper usage

## Design Principles

- **Consistency** - Unified design language across platforms
- **Flexibility** - Adaptable to each platform's needs
- **Accessibility** - WCAG compliant components
- **Performance** - Optimized for minimal bundle size

## Contributing

1. Create components in their own directory with an index.tsx file
2. Include TypeScript types for all props
3. Document usage examples in the component file
4. Update the README with new components 