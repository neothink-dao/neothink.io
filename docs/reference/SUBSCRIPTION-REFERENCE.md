# Subscription Management System

## Overview

The Subscription Management System handles all aspects of user subscriptions across the Neothink ecosystem. It enables users to subscribe to individual platforms (Ascenders, Neothinkers, Immortals) or become a "Superachiever" with access to all platforms.

## Core Functionality

- **Plan Management**: Define and manage subscription plans for each platform
- **Subscription Processing**: Handle subscription creation, updates, and cancellations
- **Platform Access Control**: Automatically grant or revoke access to platforms based on subscription status
- **Payment Tracking**: Record and monitor payment events
- **Subscription History**: Maintain a complete history of subscription changes

## Database Schema

### Subscription Plans

The `subscription_plans` table defines the available subscription options:

```sql
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  platform_access TEXT[] NOT NULL, -- Array of platform slugs this plan grants access to
  is_active BOOLEAN NOT NULL DEFAULT true,
  features JSONB DEFAULT '{}'::jsonb,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Default plans are:
- **Ascenders** - Access to Ascension + FLOW + Ascenders
- **Neothinkers** - Access to Neothink + Mark Hamilton + Neothinkers
- **Immortals** - Access to Immortalis + Project Life + Immortals
- **Superachiever** - Access to all platforms

### User Subscriptions

The `user_subscriptions` table tracks active user subscriptions:

```sql
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Subscription History

The `subscription_history` table maintains a complete record of subscription changes:

```sql
CREATE TABLE public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  previous_plan_id UUID REFERENCES public.subscription_plans(id),
  new_plan_id UUID REFERENCES public.subscription_plans(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'canceled', 'reactivated', 'payment_failed', 'payment_succeeded', 'upgraded', 'downgraded')),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Platform Access

The `platform_access` table tracks which platforms a user can access:

```sql
CREATE TABLE public.platform_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_slug TEXT NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('full', 'limited', 'trial', 'none')),
  source TEXT NOT NULL CHECK (source IN ('subscription', 'trial', 'comp', 'legacy')),
  source_id UUID, -- Reference to subscription_id or other source
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, platform_slug)
);
```

### Payment History

The `payment_history` table records all payment-related events:

```sql
CREATE TABLE public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);
```

## Automations

### Platform Access Control

When a subscription is created or updated, platform access is automatically managed by the `update_platform_access_on_subscription_change()` function via a trigger:

1. When a subscription becomes `active`, access is granted to all platforms included in the subscription plan
2. When a subscription becomes inactive, access is revoked for all platforms granted by that subscription
3. All changes are recorded in the subscription history

## API Usage

### Checking Platform Access

To check if a user has access to a specific platform:

```sql
-- SQL function
SELECT user_has_platform_access(user_id, 'platform_slug');
```

```typescript
// TypeScript usage with Supabase
const { data, error } = await supabase.rpc('user_has_platform_access', {
  _user_id: userId,
  _platform_slug: platformSlug
});

const hasAccess = data || false;
```

### Creating a Subscription

To create a new subscription:

```typescript
// 1. Create Stripe subscription (server-side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: stripePriceId }],
  metadata: { userId }
});

// 2. Store subscription in database
const { data, error } = await supabase
  .from('user_subscriptions')
  .insert({
    user_id: userId,
    plan_id: planId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string
  });
```

### Handling Subscription Updates

When a subscription status changes (e.g., payment succeeded, payment failed, canceled):

```typescript
// 1. Update subscription status
const { data, error } = await supabase
  .from('user_subscriptions')
  .update({
    status: newStatus,
    current_period_end: newPeriodEnd
  })
  .eq('stripe_subscription_id', stripeSubscriptionId);

// 2. The trigger automatically handles platform access changes
```

### Upgrading/Downgrading Subscriptions

To change a user's subscription plan:

```typescript
// 1. Update Stripe subscription (server-side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
await stripe.subscriptions.update(stripeSubscriptionId, {
  items: [{ 
    id: subscriptionItemId,
    price: newStripePriceId
  }],
  proration_behavior: 'create_prorations'
});

// 2. Update subscription in database
const { data, error } = await supabase
  .from('user_subscriptions')
  .update({
    plan_id: newPlanId
  })
  .eq('id', subscriptionId);

// 3. The trigger automatically handles platform access changes
```

## Frontend Integration

### Subscription Management UI

The Neothink Hub provides a subscription management interface:

```tsx
import { useSubscription } from '@lib/hooks/useSubscription';

function SubscriptionManager() {
  const { 
    currentSubscription, 
    availablePlans,
    upgradeSubscription,
    cancelSubscription,
    reactivateSubscription
  } = useSubscription();

  // Render subscription management UI
}
```

### Platform Access Control

Each platform checks for valid access during navigation:

```tsx
import { usePlatformAccess } from '@lib/hooks/usePlatformAccess';

function ProtectedRoute({ children }) {
  const { hasAccess, isLoading, redirectToHub } = usePlatformAccess();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!hasAccess) {
    return <SubscriptionRequired onUpgradeClick={redirectToHub} />;
  }
  
  return children;
}
```

## Webhook Integration

The system processes Stripe webhooks to handle asynchronous subscription events:

```typescript
// pages/api/webhooks/stripe.ts
export default async function handler(req, res) {
  const event = validateStripeWebhook(req);
  
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
    // Handle other event types
  }
  
  res.status(200).json({ received: true });
}
```

## Security Considerations

- Row-Level Security (RLS) policies ensure that users can only view their own subscription data
- Only users with Guardian status can manage subscription plans or modify user subscriptions
- Sensitive payment information is never stored in our database
- All subscription operations are logged for audit purposes

## Testing Subscriptions

### Test Mode

The system supports a test mode for development and testing:

1. Set `NEXT_PUBLIC_STRIPE_TEST_MODE=true` in the environment
2. Use Stripe test cards for payment processing
3. Test users will have the `is_test_account` flag set in their metadata

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

## Reporting

The system provides key subscription metrics:

1. **Active Subscriptions** - Count and revenue of active subscriptions by plan
2. **Churn Rate** - Percentage of subscriptions canceled per period
3. **Upgrade Rate** - Percentage of users upgrading to higher-tier plans
4. **Lifetime Value** - Average revenue generated per subscriber
5. **Platform Distribution** - Breakdown of subscriptions by platform

## Implementation Roadmap

1. **Phase 1 (Current)**: Basic subscription management with Stripe integration
2. **Phase 2**: Enhanced analytics and reporting
3. **Phase 3**: Promotions, discounts, and special offers
4. **Phase 4**: Enterprise/team subscription management

## Troubleshooting

### Common Issues

1. **User loses platform access** - Check subscription status and platform_access table
2. **Failed payment webhook** - Review Stripe dashboard and webhook logs
3. **Subscription not updating** - Ensure Stripe events are being properly processed
4. **Duplicate platform access** - Check for multiple active subscriptions granting the same access

### Database Queries for Debugging

```sql
-- Check user's subscriptions
SELECT s.*, p.name as plan_name, p.platform_access
FROM user_subscriptions s
JOIN subscription_plans p ON s.plan_id = p.id
WHERE s.user_id = 'user-uuid';

-- Check platform access
SELECT * FROM platform_access
WHERE user_id = 'user-uuid';

-- Check subscription history
SELECT h.*, p.name as plan_name
FROM subscription_history h
LEFT JOIN subscription_plans p ON h.new_plan_id = p.id
WHERE h.user_id = 'user-uuid'
ORDER BY h.created_at DESC;
```

## Questions?

If you have questions about subscription management, please contact:
- Technical questions: [tech-lead@neothink.io](mailto:tech-lead@neothink.io)
- Business questions: [business-lead@neothink.io](mailto:business-lead@neothink.io)

*For more information on the technical implementation, see the [Technical Implementation Guide](../TECHNICAL-IMPLEMENTATION.md).* 