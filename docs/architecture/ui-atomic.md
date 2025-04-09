# Atomic Design in the UI Package

This document explains how we've implemented Atomic Design principles in our UI component library.

## What is Atomic Design?

Atomic Design is a methodology for creating design systems. It consists of five distinct levels:

1. **Atoms**: Basic building blocks such as buttons, inputs, and labels.
2. **Molecules**: Simple combinations of atoms that form a functional unit.
3. **Organisms**: Complex UI components composed of molecules and/or atoms.
4. **Templates**: Page-level layouts without content.
5. **Pages**: Specific instances of templates with real content.

## Our Implementation

In our UI package, we've adopted a modified version of Atomic Design focused on the first three levels, with some additional categories:

```
packages/ui/
├── src/
│   ├── atoms/         # Basic components
│   │   ├── Button/
│   │   └── Input/
│   ├── molecules/     # Composite components
│   │   └── FormField/
│   ├── organisms/     # Complex components
│   ├── templates/     # Layout templates
│   ├── theme/         # Theme configuration
│   ├── hooks/         # UI-related hooks
│   └── utils/         # UI utilities
```

## Atoms

Atoms are the foundational building blocks of our interface. They're the simplest components that can't be broken down further without losing their functionality.

Examples of atoms include:

- **Button**: A clickable element that performs an action
- **Input**: A text input field
- **Checkbox**: A selectable checkbox
- **Label**: A text label for form elements

### Example: Button Atom

```tsx
import { Button } from '@neothink/ui';

function MyComponent() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
```

## Molecules

Molecules are relatively simple combinations of atoms. They're components that have a single responsibility.

Examples of molecules include:

- **FormField**: A combination of a label, input, and error/help text
- **Card**: A container with a header and content
- **AlertDialog**: A dialog with title, content, and actions

### Example: FormField Molecule

```tsx
import { FormField } from '@neothink/ui';

function MyForm() {
  return (
    <FormField
      label="Email Address"
      type="email"
      placeholder="Enter your email"
      helperText="We'll never share your email."
      required
    />
  );
}
```

## Organisms

Organisms are complex UI components composed of molecules and/or atoms. They're large, relatively complex components that form a distinct section of an interface.

Examples of organisms include:

- **Navbar**: A navigation bar with logo, links, and user menu
- **RegistrationForm**: A complete form with multiple fields
- **DataTable**: A table with sorting, filtering, and pagination

## Component Composition Pattern

We strongly favor composition over configuration for our component API design:

```tsx
// Preferred composition pattern
<Card>
  <Card.Header>
    <Card.Title>My Card</Card.Title>
  </Card.Header>
  <Card.Body>Content goes here</Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Avoid this configuration pattern
<Card 
  title="My Card"
  content="Content goes here"
  footerButton={<Button>Action</Button>}
/>
```

This approach:
- Provides more flexibility
- Makes component usage more intuitive
- Aligns with React's compositional nature
- Results in cleaner props

## Design Tokens

Our design system is built on a foundation of design tokens, which are the variables that store our styling information:

```tsx
import { tokens } from '@neothink/ui';

// Access color tokens
const primaryColor = tokens.colors.primary[500];

// Access spacing tokens
const spacingLg = tokens.spacing[8];
```

These tokens are used to:
- Ensure consistency across components
- Support platform-specific theming
- Make styling changes easier to maintain

## Platform-Specific Theming

Our design system supports platform-specific theming for Neothink's different platforms:

```tsx
// Theme tokens include platform-specific colors
const hubPrimary = tokens.colors.platform.hub.primary;
const ascendersAccent = tokens.colors.platform.ascenders.accent;
```

## Best Practices

1. **Use the Right Level**: Place components at the appropriate atomic level.
2. **Composition over Configuration**: Prefer component composition over complex props.
3. **Use Design Tokens**: Always use design tokens instead of hardcoded values.
4. **Document Components**: Every component should have proper documentation.
5. **Accessible by Default**: Components should be accessible without extra work.
6. **Platform Agnostic**: Base components should work across all platforms.

## Adding New Components

When adding a new component:

1. Determine which atomic level it belongs to.
2. Create a directory in the appropriate level (e.g., `atoms/Checkbox/`).
3. Implement the component following our composition pattern.
4. Use design tokens for styling.
5. Export the component from the package index.
6. Document the component with examples.

## Documentation-Driven Development

We follow a documentation-driven approach:

1. Document the component's API before implementation.
2. Include usage examples for common scenarios.
3. Document accessibility features.
4. Include design considerations.

## Using Next.js for Component Documentation

We use Next.js App Router for component documentation:

```
apps/docs/
├── app/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── button/
│   │   │   │   ├── page.tsx  # Button documentation page
│   │   │   │   └── demo.tsx  # Interactive demos
```

This approach allows us to:
- Use the same tech stack across our projects
- Create interactive examples
- Test components in a real-world context
- Keep documentation close to the code 