# Testing Guide

## Overview

This guide outlines the testing strategy and best practices for the Neothink+ ecosystem. We follow a comprehensive testing approach that includes unit tests, integration tests, and end-to-end tests.

## Testing Philosophy

### Core Principles
1. **Test-Driven Development (TDD)**
   - Write tests before implementation
   - Red-Green-Refactor cycle
   - Focus on behavior, not implementation

2. **Coverage Goals**
   - Unit Tests: 80%+ coverage
   - Integration Tests: Critical paths
   - E2E Tests: Core user journeys

3. **Testing Pyramid**
   ```
   ▲     E2E Tests     ▲
   ▲▲   Integration   ▲▲
   ▲▲▲    Unit      ▲▲▲
   ```

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual components and functions in isolation.

```typescript
// Component Test
describe('PlatformSwitcher', () => {
  it('renders platform options', () => {
    const { getByText } = render(<PlatformSwitcher />);
    expect(getByText('Ascenders')).toBeInTheDocument();
  });

  it('calls onSwitch when clicked', () => {
    const onSwitch = jest.fn();
    const { getByText } = render(
      <PlatformSwitcher onSwitch={onSwitch} />
    );
    fireEvent.click(getByText('Ascenders'));
    expect(onSwitch).toHaveBeenCalledWith('ascenders');
  });
});

// Utility Test
describe('formatPlatformState', () => {
  it('formats state correctly', () => {
    const state = {
      currentPlatform: 'hub',
      preferences: { theme: 'dark' }
    };
    expect(formatPlatformState(state)).toMatchSnapshot();
  });
});
```

### 2. Integration Tests

Integration tests verify that different parts of the application work together correctly.

```typescript
describe('Platform Integration', () => {
  beforeEach(() => {
    // Setup test database
    setupTestDb();
  });

  it('maintains state during platform switch', async () => {
    const { result } = renderHook(() => usePlatform());
    
    // Set initial state
    await act(async () => {
      await result.current.updateState({
        preferences: { theme: 'dark' }
      });
    });

    // Switch platform
    await act(async () => {
      await result.current.switchTo('ascenders');
    });

    // Verify state preserved
    expect(result.current.state.preferences.theme).toBe('dark');
  });
});
```

### 3. E2E Tests

End-to-end tests verify complete user journeys across the application.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Platform Navigation', () => {
  test('user can switch between platforms', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    // Switch platform
    await page.click('[data-testid="platform-switcher"]');
    await page.click('[data-testid="platform-ascenders"]');
    
    // Verify navigation
    await expect(page).toHaveURL('/ascenders');
    await expect(page.locator('h1')).toContainText('Ascenders');
  });
});
```

## Testing Tools

### 1. Test Runners
- **Vitest**: Primary test runner
- **Playwright**: E2E testing
- **React Testing Library**: Component testing

### 2. Mocking
```typescript
// API Mocking
vi.mock('@neothink/api', () => ({
  fetchPlatformState: vi.fn().mockResolvedValue({
    currentPlatform: 'hub',
    preferences: { theme: 'light' }
  })
}));

// Component Mocking
vi.mock('@neothink/ui', () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )
}));
```

### 3. Test Data
```typescript
// Test Factories
const createTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  preferences: { theme: 'light' },
  ...overrides
});

// Fixtures
const loadTestData = () => {
  return JSON.parse(
    readFileSync('./tests/fixtures/platform-state.json', 'utf-8')
  );
};
```

## Testing Standards

### 1. Naming Conventions
```typescript
// Test Files
// Component: ComponentName.test.tsx
// Hook: useHookName.test.ts
// Utility: utilityName.test.ts

// Test Descriptions
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should behavior', () => {
      // Test implementation
    });
  });
});
```

### 2. Test Structure
```typescript
describe('Feature', () => {
  // Setup
  beforeAll(() => {
    // Global setup
  });

  beforeEach(() => {
    // Per-test setup
  });

  // Happy Path
  it('works with valid input', () => {});

  // Edge Cases
  it('handles empty input', () => {});
  it('handles invalid input', () => {});

  // Error Cases
  it('handles network errors', () => {});

  // Cleanup
  afterEach(() => {
    // Per-test cleanup
  });

  afterAll(() => {
    // Global cleanup
  });
});
```

## Best Practices

### 1. Test Organization
- Group related tests
- Use descriptive names
- Follow AAA pattern (Arrange-Act-Assert)
- Keep tests focused and small

### 2. Test Coverage
```bash
# Run coverage report
pnpm test:coverage

# Coverage thresholds
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### 3. Performance
- Mock heavy operations
- Use test isolation
- Clean up resources
- Optimize test runs

## CI/CD Integration

### 1. GitHub Actions
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e
```

### 2. Test Reports
- Coverage reports
- Test results
- Performance metrics
- Error reports

## Debugging Tests

### 1. Debug Tools
```bash
# Debug unit tests
pnpm test:debug

# Debug E2E tests
pnpm test:e2e:debug
```

### 2. Common Issues
- Async timing issues
- State persistence
- Component isolation
- Test environment setup

## Resources

- [Architecture Overview](../architecture/overview.md)
- [Development Guide](./development.md)
- [API Documentation](../api/platform-bridge.md)
- [Security Guide](./security.md) 