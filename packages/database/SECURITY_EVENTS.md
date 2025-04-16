# SECURITY EVENTS: Canonical Types & Usage

## Overview
All security event types and helpers are defined and exported from `@neothink/database`. This ensures a single source of truth for logging, analytics, and security monitoring across all Neothink sites/apps.

## Canonical Type: `SecurityEvent`
```
type SecurityEvent = {
  event: string; // e.g., "auth.login", "rate_limit_exceeded", "suspicious_activity"
  severity: SecurityEventSeverity; // 'low' | 'medium' | 'high'
  platform_slug: string; // e.g., 'hub', 'ascenders', etc.
  user_id?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
  suspicious_activity?: boolean;
  // Optionally for analytics:
  ip_address?: string;
  request_path?: string;
  request_method?: string;
  request_headers?: Record<string, string>;
};
```

## Enum: `SecurityEventSeverity`
```
type SecurityEventSeverity = 'low' | 'medium' | 'high';
```

## Import Example
```ts
import type { SecurityEvent, SecurityEventSeverity } from '@neothink/database';
```

## Logging Example
```ts
import { logSecurityEvent } from '@neothink/auth/src/utils/security-logger';

await logSecurityEvent(supabase, {
  event: 'auth.login',
  severity: 'low',
  platform_slug: 'hub',
  user_id: user.id,
  context: { ip: req.headers['x-forwarded-for'] },
  details: { method: 'email' },
  suspicious_activity: false,
});
```

## Event Types
- `auth.login`, `auth.logout`, `auth.failure`
- `rate_limit_exceeded`
- `suspicious_activity`
- ...and any custom event relevant to your app

## Best Practices
- Always import types from `@neothink/database`.
- Never define local copies of event types or enums.
- Use explicit field names and severity levels.
- Include as much context as possible for analytics/audit.
