# Development Testing Guide

## Overview

This guide covers testing procedures and utilities for the Neothink platform ecosystem.

## Test Environment Setup

1. Set up environment variables:
   ```bash
   NEXT_PUBLIC_STRIPE_TEST_MODE=true
   NEXT_PUBLIC_SUPABASE_URL=your_test_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_test_key
   ```

2. Use test credentials:
   - Stripe test cards for payment processing
   - Test email addresses (e.g., `test+{random}@example.com`)

## Subscription Testing

### Test Mode

The subscription system supports a test mode for development:

1. Enable test mode with `NEXT_PUBLIC_STRIPE_TEST_MODE=true`
2. Use Stripe test cards for payment processing
3. Test users will have the `is_test_account` flag in their metadata

### Creating Test Subscriptions

For testing platform access without actual payments:

```typescript
// Only works with guardian access and in development/staging environments
export async function createTestSubscription(userId, planSlug) {
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('slug', planSlug)
    .single();
  
  if (!plan) throw new Error('Plan not found');
  
  const now = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  
  return supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: plan.id,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
      metadata: { is_test: true }
    });
}
```

## Shared Test Utilities

Common test utilities and mocks are available in the `packages/testing` directory:

```typescript
import { mockUser, mockSession, mockProfile } from '@neothink/testing';
import { createTestClient } from '@neothink/testing/supabase';
```

### Authentication Mocks

```typescript
// Mock user data
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

// Mock session data
const mockSession = {
  user: mockUser,
  access_token: 'test-token',
};

// Mock profile data
const mockProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  platforms: ['hub'],
};
```

## Testing Best Practices

1. Use shared test utilities instead of duplicating mocks
2. Test in isolation using proper mocking
3. Follow the testing pyramid:
   - Unit tests: Most numerous
   - Integration tests: Medium
   - E2E tests: Least numerous

## Continuous Integration

Tests are run automatically on:
1. Pull request creation/updates
2. Push to main branch
3. Release creation

## Questions?

For questions about testing, contact:
- Technical questions: [tech-lead@neothink.io](mailto:tech-lead@neothink.io) 