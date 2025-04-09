# Neothink Hub Platform

## Value Proposition

**"Prosper Happily Forever and Go Further, Faster, Forever by being, doing, and having it all as a Superachiever."**

The Neothink Hub (`go.neothink.io`) serves as the central management platform for the entire Neothink ecosystem, allowing users to access and manage their subscriptions across all platforms:

- **Ascenders** - For greater PROSPERITY (wealth)
- **Neothinkers** - For greater HAPPINESS (knowledge)
- **Immortals** - For greater LONGEVITY (health)

The Hub enables the "Superachiever" experience by providing a unified dashboard for users subscribed to all three platforms ($297/m).

## Core Functions

### Cross-Platform Management
Centralized interface for accessing all subscribed platforms, managing account settings, and tracking progress across the ecosystem.

### Subscription Management
Handles subscription creation, upgrades, downgrades, and billing for all platforms, including the Superachiever tier.

### Unified Dashboard
Provides a holistic view of a user's journey across prosperity, happiness, and longevity with key metrics and insights.

### Administrative Functions
Includes system-wide administration tools, reporting, and management capabilities for the entire ecosystem.

## Routes and Navigation Structure

The Neothink Hub serves as the central navigation point to access all platforms:

- **/** - Main dashboard with progress overview across all subscribed platforms
- **/account** - User profile and account management
- **/subscriptions** - Subscription management for all platforms
- **/platforms**
  - **/platforms/ascenders** - Portal to the Ascenders platform
  - **/platforms/neothinkers** - Portal to the Neothinkers platform
  - **/platforms/immortals** - Portal to the Immortals platform
- **/admin** - Administrative functions (Guardian access only)
- **/settings** - Cross-platform user settings

The Hub enables seamless navigation between all platforms based on the user's subscription tier.

## Technical Architecture

As the central hub of the ecosystem, this platform:

- **Frontend**: Next.js application with ecosystem-wide styling and components
- **Backend**: Supabase for authentication, database, and storage
- **Shared Code**: Uses and manages components and utilities in the `/lib` directory
- **Deployment**: Separate Vercel deployment with hub-specific environment variables

## Design System

### Color Palette
- **Primary**: "zinc" color palette (#71717a as base, with lighter/darker variants)
- **Secondary**: Horizontal gradient of "amber-orange-red" for accents and emphasis
  - Amber: #f59e0b as base
  - Orange: #f97316 as transition
  - Red: #ef4444 as final gradient color
- **Background**: Light zinc tones for light mode, dark zinc tones for dark mode
- **Text**: Dark zinc tones for light mode, light zinc tones for dark mode

For platform-specific sections, the Hub will use the respective platform's color scheme:
- Ascenders sections: zinc with orange accents
- Neothinkers sections: zinc with amber accents
- Immortals sections: zinc with red accents

All components should use these color palettes consistently across the platform.

## Development Guidelines

### Hub-Specific Styling

Use the Hub theme variables for all UI components:

```tsx
import { useTheme } from '@lib/hooks/useTheme';

function HubComponent() {
  const { colors } = useTheme();
  
  return (
    <div style={{ color: colors.primary }}>
      Hub-themed content
    </div>
  );
}
```

### Key Features to Implement

1. **Cross-Platform Navigation**
   - Seamless navigation between all platforms
   - Platform availability based on subscription tier
   - Visual indicators for subscribed platforms
   - Promotional elements for non-subscribed platforms

2. **Subscription Management**
   - Subscription creation and management
   - Upgrade/downgrade workflows
   - Billing history and management
   - Special handling for Superachiever tier

3. **Unified Dashboard**
   - Cross-platform progress visualization
   - Key metrics from all subscribed platforms
   - Personalized recommendations
   - Achievement tracking across platforms

4. **User Management**
   - Profile management with platform-specific sections
   - Settings that apply across all platforms
   - Permission management based on subscription tier
   - Notification preferences for all platforms

### Database Considerations

When working with the shared database, remember:

1. Hub-specific content should use the `tenant_slug = 'hub'` identifier
2. Subscription data requires secure handling and proper RLS policies
3. Cross-platform data aggregation should use efficient query patterns
4. Guardian access controls must be properly implemented

### Testing Requirements

Before submitting a pull request, ensure:

1. Cross-platform navigation works correctly for all subscription tiers
2. Subscription management functions correctly for all scenarios
3. Platform-specific data is correctly aggregated and displayed
4. Guardian administrative functions operate correctly

## Getting Started

### Local Development

```bash
# Start the development server for the Hub
npm run dev:hub

# Build for production
npm run build:hub
```

### Environment Variables

Ensure these platform-specific environment variables are set:

```
NEXT_PUBLIC_PLATFORM_SLUG=hub
NEXT_PUBLIC_PLATFORM_NAME="Neothink Hub"
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

## Guardian Administrative Functions

The Hub contains special administrative functions for system guardians:

### User Management
- User search and filtering across all platforms
- Profile editing and subscription management
- Role assignment and permission management
- Access restriction capabilities

### Content Management
- Cross-platform content publishing
- Content approval workflows
- Content performance metrics
- Featured content management

### System Configuration
- Platform-specific settings management
- Global system settings
- Notification template management
- Feature flag configuration

### Analytics Dashboard
- Cross-platform user metrics
- Subscription analytics and revenue reporting
- Content performance across platforms
- User journey visualization

## Integration Points

### Platform Integrations

The Hub connects to all three platforms:

- **Ascenders Platform**: For prosperity metrics and content
- **Neothinkers Platform**: For happiness metrics and content
- **Immortals Platform**: For longevity metrics and content

### External Integrations

- **Payment Processor**: Stripe for subscription management
- **Email Provider**: For system notifications and marketing
- **Analytics**: For cross-platform tracking and reporting
- **Customer Support**: For user assistance

## Deployment

This platform is deployed to Vercel with automatic deployments from the GitHub repository.

### Deployment Checklist

- Environment variables are properly configured
- Database migrations are applied
- Payment integration is tested
- Cross-platform navigation is working correctly
- Guardian administrative functions are secured

## Resources

- [Platform Architecture](/docs/MULTI_TENANT_ARCHITECTURE.md)
- [Shared Components](/lib/README.md)
- [Master Plan](/docs/MASTER_PLAN.md)
- [Cross-Platform Features](/docs/CROSS_PLATFORM_FEATURES.md)

## User Guide

### Routes

Neothink Hub follows a progressive journey that unlocks features week by week:

#### Initial Access (Week 1)
- **[/discover](https://go.neothink.io/discover)** - ✅ **UNLOCKED**
  - Your starting point for the Neothink journey
  - Introduces the core concepts
  - Provides navigation to other platforms
  
- **[/onboard](https://go.neothink.io/onboard)** - 🔒 **LOCKED**
  - Visible but locked until Week 2
  - Shows a teaser of what's coming
  - Unlock attempts are tracked for personalized notifications

- **[/progress](https://go.neothink.io/progress)** - 🚫 **HIDDEN**
  - Not visible or accessible until Week 3
  - Will show your journey progress when unlocked

- **[/endgame](https://go.neothink.io/endgame)** - 🚫 **HIDDEN**
  - Not visible or accessible until Week 4
  - Will reveal mastery content when unlocked

### Platform Journey

Start your Neothink journey today. The Hub platform is designed to guide you through a transformative experience:

1. **Discover** (Week 1): Begin your journey by exploring foundational ideas and concepts.
2. **Onboard** (Unlocks Week 2): Dive deeper with essential tools and practices.
3. **Progress** (Unlocks Week 3): Track your growth and apply what you've learned.
4. **Endgame** (Unlocks Week 4): Achieve mastery and experience full transformation.

As you progress through your journey, additional features will be unlocked automatically, creating a personalized experience that matches your stage of growth.

## Developer Documentation

### Project Structure

```
go.neothink.io/
├── app/                 # Next.js application
│   ├── discover/        # Discover route - unlocked by default
│   ├── onboard/         # Onboarding route - locked initially
│   ├── progress/        # Progress route - hidden initially
│   └── endgame/         # Endgame route - hidden initially
├── components/          # Shared components
├── lib/                 # Utilities and helpers
├── public/              # Static assets
└── styles/              # Global styles
```

### Feature Access Control

Access to features is controlled by the `useUserProgress` hook:

```typescript
import { useUserProgress } from '@neothink/hooks';

function MyComponent() {
  const { checkFeatureStatus } = useUserProgress('hub');
  const featureStatus = checkFeatureStatus('progress'); // 'unlocked', 'locked', or 'hidden'
  
  // Render based on status
}
```

### Analytics Implementation

Events are tracked automatically on all routes. Add custom tracking with:

```typescript
import { analytics } from '@neothink/analytics';

// Track a specific interaction
analytics.trackContentInteraction('hub', 'feature-button', 'click');
```

### Testing

Run Hub-specific tests with:

```bash
pnpm test:hub
```

## Additional Information

For more details on the Hub platform and its integration with other Neothink platforms, see:

- [Development Guide](../DEVELOPMENT.md) for implementation details
- [Supabase Guide](../SUPABASE.md) for database and analytics information
- [Deployment Guide](../deployment.md) for deployment instructions 