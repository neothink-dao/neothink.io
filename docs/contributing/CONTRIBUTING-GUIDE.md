# Contributing Guide

## Overview

This guide outlines the process for contributing to the Neothink Sites monorepo.

## Development Setup

### 1. Prerequisites
```bash
# Required tools
node -v  # >= 18.0.0
npm -v   # >= 10.2.4
git --version
```

### 2. Repository Setup
```bash
# Clone repository
git clone https://github.com/neothink/sites.git
cd sites

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### 3. Local Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Code Style

### 1. TypeScript
```typescript
// Use strict typing
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type inference where possible
const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com'
}
```

### 2. React Components
```typescript
// Use functional components
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      className={`button button--${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### 3. CSS/Styling
```css
/* Use BEM naming */
.button {
  /* Base styles */
}

.button--primary {
  /* Variant styles */
}

.button__icon {
  /* Element styles */
}
```

## Git Workflow

### 1. Branch Naming
```
feature/  # New features
bugfix/   # Bug fixes
hotfix/   # Urgent fixes
release/  # Release preparation
```

### 2. Commit Messages
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### 3. Pull Requests
```markdown
## Description
Brief description of changes

## Changes
- List of changes
- Bullet points

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] Updated documentation

## Screenshots
Add relevant screenshots if applicable
```

## Testing

### 1. Unit Tests
```typescript
// Example test
describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })
})
```

### 2. Integration Tests
```typescript
// Example test
describe('Authentication', () => {
  it('handles login successfully', async () => {
    const { getByLabelText, getByText } = render(<LoginForm />)
    
    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    })
    
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(getByText('Login'))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })
})
```

### 3. E2E Tests
```typescript
// Example test
describe('User Flow', () => {
  it('completes registration process', async () => {
    await page.goto('/register')
    await page.fill('#email', 'test@example.com')
    await page.fill('#password', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
  })
})
```

## Documentation

### 1. Code Comments
```typescript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Total price with tax
 */
function calculateTotal(price: number, taxRate: number): number {
  return price * (1 + taxRate)
}
```

### 2. README Updates
```markdown
# Project Name

## Description
Brief project description

## Installation
```bash
npm install
```

## Usage
```typescript
import { Component } from 'package'
```

## API Reference
Document API endpoints and usage
```

### 3. Changelog
```markdown
# Changelog

## [1.0.0] - 2023-01-01
### Added
- New feature A
- New feature B

### Changed
- Updated dependency X
- Improved performance

### Fixed
- Bug in component Y
- Security issue Z
```

## Review Process

### 1. Code Review
```markdown
## Review Checklist
- [ ] Code follows style guide
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No security issues
- [ ] Performance is acceptable
```

### 2. Testing
```bash
# Run all tests
npm test

# Run specific test
npm test -- Component.test.tsx

# Check coverage
npm run test:coverage
```

### 3. Deployment
```bash
# Create release branch
git checkout -b release/1.0.0

# Update version
npm version patch  # or minor/major

# Push to production
git push origin main
```

## Best Practices

1. **Code Quality**
   - Follow SOLID principles
   - Write clean, maintainable code
   - Use appropriate design patterns
   - Keep functions small and focused

2. **Security**
   - Validate all inputs
   - Sanitize outputs
   - Use secure dependencies
   - Follow security guidelines

3. **Performance**
   - Optimize database queries
   - Minimize network requests
   - Use caching appropriately
   - Monitor performance metrics

4. **Accessibility**
   - Follow WCAG guidelines
   - Test with screen readers
   - Ensure keyboard navigation
   - Use semantic HTML

5. **Maintenance**
   - Regular dependency updates
   - Code cleanup
   - Documentation updates
   - Performance monitoring 