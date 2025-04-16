# Neothink+ Hub

## Overview

The Neothink+ Hub (go.neothink.io) serves as an optional integration platform that enhances the experience across our independent platforms: Ascenders, Neothinkers, and Immortals. While each platform maintains its complete value proposition and independence, the Hub provides additional benefits for users engaged with multiple platforms.

## Core Principles

### Platform Independence
Each platform is designed to be fully functional and valuable independently:

- **Ascenders** (joinascenders.org)
  - Complete financial sovereignty system
  - Independent business platform
  - Full prosperity tools

- **Neothinkers** (joinneothinkers.org)
  - Complete knowledge system
  - Independent community platform
  - Full learning resources

- **Immortals** (joinimmortals.org)
  - Complete longevity system
  - Independent health platform
  - Full wellness tools

### Optional Integration
The Hub enhances multi-platform experiences without compromising independence:
- Seamless platform switching
- Cross-platform state management
- Unified authentication (optional)
- Enhanced features and insights

## Technical Architecture

### Platform Bridge
```typescript
interface PlatformState {
  currentPlatform: PlatformSlug
  preferences: {
    theme: string
    notifications: boolean
    language: string
  }
  progress: {
    achievements: Array<any>
    completedModules: Array<string>
    lastActivity: string
  }
  recentItems: Array<any>
}
```

### Platform Switching
```typescript
interface PlatformAccess {
  platform: PlatformSlug
  accessLevel: 'visitor' | 'member' | 'admin'
  features: string[]
  restrictions: string[]
}

interface SwitchError {
  code: 'UNAUTHORIZED' | 'NOT_FOUND'
  message: string
  details: Record<string, any>
}
```

### Platform Configuration
```typescript
interface PlatformConfig {
  slug: PlatformSlug
  name: string
  description: string
  color: string
  url: string
  features: string[]
  requirements?: {
    minimumLevel?: number
    prerequisites?: string[]
  }
}
```

## Features

### Current Features

#### Platform Navigation
- Seamless platform switching
- State preservation
- Error handling
- Loading states
- Progress tracking

#### User Management
- Profile management
- Access control
- Progress tracking
- Preference management

#### Cross-Platform Features
- Unified dashboard
- Shared resources
- Integrated progress
- Community connections

#### Analytics
- Usage tracking
- Platform metrics
- Feature adoption
- Performance monitoring

### Planned Features

#### Enhanced AI Integration
- Personalized recommendations
- Cross-platform insights
- Content discovery
- Learning optimization

#### Advanced Analytics
- Detailed metrics
- Custom reports
- Performance insights
- Usage patterns

#### Community Tools
- Cross-platform collaboration
- Resource sharing
- Knowledge integration
- Community building

## Development

### Setup
```bash
# Start Hub development
pnpm dev --filter=@neothink/hub

# Run tests
pnpm test --filter=@neothink/hub

# Build for production
pnpm build --filter=@neothink/hub
```

### Key Files
```
apps/hub/
├── app/                    # Next.js app
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── platforms/         # Platform routes
├── components/            # UI components
├── lib/                   # Utilities
│   ├── platform/         # Platform logic
│   ├── auth/            # Authentication
│   └── api/             # API handlers
└── types/                # TypeScript types
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_HUB_URL=https://go.neothink.io
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_APP_URL=your_app_url
NEXT_PUBLIC_APP_NAME=your_app_name
NEXT_PUBLIC_APP_VERSION=your_app_version
```

## Database Schema

### Platform Tables
```sql
-- Platform state
CREATE TABLE platform_state (
  user_id UUID REFERENCES auth.users(id),
  platform VARCHAR NOT NULL,
  preferences JSONB,
  progress JSONB,
  recent_items JSONB,
  PRIMARY KEY (user_id, platform)
);

-- Platform access
CREATE TABLE platform_access (
  user_id UUID REFERENCES auth.users(id),
  platform VARCHAR NOT NULL,
  access_level VARCHAR NOT NULL,
  features JSONB,
  restrictions JSONB,
  PRIMARY KEY (user_id, platform)
);
```

## Best Practices

### Platform Switching
1. Always preserve state
2. Handle errors gracefully
3. Show loading states
4. Validate access
5. Update analytics

### State Management
1. Use platform bridge
2. Maintain consistency
3. Handle conflicts
4. Cache appropriately
5. Sync efficiently

### Security
1. Validate access
2. Sanitize data
3. Handle errors
4. Audit actions
5. Protect privacy

## Contributing

See [Contributing Guide](../../CONTRIBUTING.md) for:
- Development setup
- Code standards
- Testing requirements
- Review process

## Resources

- [Architecture Overview](../architecture/overview.md)
- [Development Guide](../guides/development.md)
- [API Documentation](../api/platform-bridge.md)
- [Testing Guide](../guides/testing.md) 