# Platform Bridge API Documentation

## Overview

The Platform Bridge is a core service that enables seamless integration and state management across the Neothink+ ecosystem. It provides a unified interface for platform switching, state management, and cross-platform communication.

## Installation

```bash
# Install from workspace packages
pnpm add @neothink/platform-bridge
```

## Core Concepts

### Platform State
```typescript
interface PlatformState {
  currentPlatform: PlatformSlug;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  progress: {
    achievements: Array<any>;
    completedModules: Array<string>;
    lastActivity: string;
  };
  recentItems: Array<any>;
}
```

### Platform Access
```typescript
interface PlatformAccess {
  platform: PlatformSlug;
  accessLevel: 'visitor' | 'member' | 'admin';
  features: string[];
  restrictions: string[];
}
```

### Error Handling
```typescript
interface SwitchError {
  code: 'UNAUTHORIZED' | 'NOT_FOUND';
  message: string;
  details: Record<string, any>;
}
```

## API Reference

### Platform Management

#### switchPlatform
Switch to a different platform while preserving state.

```typescript
async function switchPlatform(
  platform: PlatformSlug,
  options?: SwitchOptions
): Promise<void>

interface SwitchOptions {
  preserveState?: boolean;
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: SwitchError) => void;
}

// Example
try {
  await platformBridge.switchPlatform('ascenders', {
    preserveState: true,
    onSuccess: () => console.log('Switch successful'),
  });
} catch (error) {
  console.error('Switch failed:', error);
}
```

#### getCurrentPlatform
Get the current active platform.

```typescript
function getCurrentPlatform(): PlatformSlug

// Example
const currentPlatform = platformBridge.getCurrentPlatform();
```

### State Management

#### getState
Get the current platform state.

```typescript
async function getState(): Promise<PlatformState>

// Example
const state = await platformBridge.getState();
console.log('Current platform:', state.currentPlatform);
```

#### updateState
Update the platform state.

```typescript
async function updateState(
  update: Partial<PlatformState>
): Promise<PlatformState>

// Example
await platformBridge.updateState({
  preferences: {
    theme: 'dark',
    notifications: true,
  },
});
```

#### syncState
Synchronize state across platforms.

```typescript
async function syncState(options?: SyncOptions): Promise<void>

interface SyncOptions {
  force?: boolean;
  platforms?: PlatformSlug[];
}

// Example
await platformBridge.syncState({
  platforms: ['hub', 'ascenders'],
});
```

### Access Control

#### checkAccess
Check user access for a platform.

```typescript
async function checkAccess(
  platform: PlatformSlug
): Promise<PlatformAccess>

// Example
const access = await platformBridge.checkAccess('neothinkers');
if (access.accessLevel === 'member') {
  // Handle member access
}
```

#### requestAccess
Request access to a platform.

```typescript
async function requestAccess(
  platform: PlatformSlug,
  level: AccessLevel
): Promise<RequestResult>

// Example
const result = await platformBridge.requestAccess('immortals', 'member');
```

### Event Handling

#### subscribe
Subscribe to platform events.

```typescript
function subscribe(
  event: PlatformEvent,
  callback: (data: any) => void
): () => void

// Example
const unsubscribe = platformBridge.subscribe('stateChange', (state) => {
  console.log('State updated:', state);
});

// Cleanup
unsubscribe();
```

#### emit
Emit a platform event.

```typescript
function emit(event: PlatformEvent, data?: any): void

// Example
platformBridge.emit('userAction', {
  type: 'completeModule',
  moduleId: 'mod-123',
});
```

## React Hooks

### usePlatform
React hook for platform state and actions.

```typescript
function usePlatform(): {
  platform: PlatformSlug;
  state: PlatformState;
  switchTo: (platform: PlatformSlug) => Promise<void>;
  updateState: (update: Partial<PlatformState>) => Promise<void>;
}

// Example
function PlatformSwitcher() {
  const { platform, switchTo } = usePlatform();
  
  return (
    <button onClick={() => switchTo('ascenders')}>
      Switch to Ascenders
    </button>
  );
}
```

### usePlatformState
React hook for platform state management.

```typescript
function usePlatformState<T extends keyof PlatformState>(
  key: T
): [PlatformState[T], (value: PlatformState[T]) => void]

// Example
function ThemeToggle() {
  const [theme, setTheme] = usePlatformState('theme');
  
  return (
    <button onClick={() => setTheme('dark')}>
      Toggle Theme
    </button>
  );
}
```

## Error Handling

### Error Types
```typescript
type ErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'INVALID_STATE';

interface PlatformError extends Error {
  code: ErrorCode;
  details: Record<string, any>;
}
```

### Error Handling Example
```typescript
try {
  await platformBridge.switchPlatform('ascenders');
} catch (error) {
  if (error instanceof PlatformError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Handle unauthorized access
        break;
      case 'NOT_FOUND':
        // Handle platform not found
        break;
      default:
        // Handle other errors
        break;
    }
  }
}
```

## Best Practices

### State Management
1. Always handle state synchronization errors
2. Use optimistic updates for better UX
3. Implement proper error boundaries
4. Cache state appropriately
5. Validate state updates

### Platform Switching
1. Preserve user context when needed
2. Handle loading states
3. Implement proper error handling
4. Validate access before switch
5. Update analytics on switch

### Performance
1. Minimize state updates
2. Use proper memoization
3. Implement efficient caching
4. Handle race conditions
5. Optimize network requests

## Examples

### Basic Platform Integration
```typescript
import { PlatformProvider, usePlatform } from '@neothink/platform-bridge';

function App() {
  return (
    <PlatformProvider>
      <PlatformSwitcher />
      <PlatformContent />
    </PlatformProvider>
  );
}

function PlatformSwitcher() {
  const { platform, switchTo } = usePlatform();
  
  return (
    <nav>
      <button onClick={() => switchTo('hub')}>Hub</button>
      <button onClick={() => switchTo('ascenders')}>Ascenders</button>
      <button onClick={() => switchTo('neothinkers')}>Neothinkers</button>
      <button onClick={() => switchTo('immortals')}>Immortals</button>
    </nav>
  );
}
```

### State Management Example
```typescript
function UserProgress() {
  const { state, updateState } = usePlatform();
  
  const completeModule = async (moduleId: string) => {
    try {
      await updateState({
        progress: {
          ...state.progress,
          completedModules: [...state.progress.completedModules, moduleId],
        },
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };
  
  return (
    <div>
      <h2>Progress</h2>
      <ul>
        {state.progress.completedModules.map((moduleId) => (
          <li key={moduleId}>{moduleId}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Further Reading

- [Architecture Overview](../architecture/overview.md)
- [Development Guide](../guides/development.md)
- [Testing Guide](../guides/testing.md)
- [Security Guide](../guides/security.md) 