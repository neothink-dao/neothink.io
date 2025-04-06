# Neothink Platforms Ecosystem: Master Plan

## Overview

This document outlines the architecture, development roadmap, and operational guidelines for the Neothink platforms ecosystem, which consists of four interconnected platforms:

1. **Hub** (go.neothink.io) - Central management platform for the ecosystem
2. **Ascenders** (www.joinascenders.org) - Platform for future-focused thinkers
3. **Neothinkers** (www.joinneothinkers.org) - Community for innovative thinkers
4. **Immortals** (www.joinimmortals.org) - Platform for longevity enthusiasts

All platforms share a common authentication system, database, and core components while maintaining their unique branding, features, and user experience.

## Architecture

### Infrastructure

- **Codebase**: Monorepo architecture with shared core components
- **Database**: Supabase PostgreSQL with shared schema
- **Hosting**: Individual Vercel deployments for each platform
- **Authentication**: Unified Supabase Auth system with platform-specific access controls

### Key Components

1. **Authentication System**
   - Unified Supabase client factory
   - Platform-specific configuration
   - Guardian (admin) user management
   - Role-based access control
   - Cross-platform access management

2. **Platform Detection**
   - Domain-based detection (primary method)
   - Path-based detection (fallback)
   - Header-based detection (API)
   - Local development support

3. **UI Component Library**
   - Platform-specific theming
   - Shared layout components
   - Protected routes with access control
   - Platform switcher for cross-platform navigation

4. **Database Schema**
   - Users and profiles
   - Platform access control
   - Role-based permissions
   - Security and audit logging

## Development Workflow

### Code Organization

```
/
├── lib/                    # Shared library code
│   ├── supabase/           # Supabase client & auth utilities
│   ├── utils/              # Common utilities
│   ├── hooks/              # React hooks
│   ├── components/         # Shared UI components
│   ├── theme/              # Theming system
│   └── config/             # Platform configuration
├── go.neothink.io/         # Hub platform
├── joinascenders/          # Ascenders platform
├── joinneothinkers/        # Neothinkers platform
├── joinimmortals/          # Immortals platform
└── supabase/               # Database migrations and functions
```

### Development Guidelines

1. **Shared Components**
   - Always check for existing implementation before creating new components
   - Use the theme system for styling
   - Ensure components work across all platforms

2. **Platform-Specific Features**
   - Implemented within platform directories
   - Use shared hooks for auth and platform access
   - Follow platform-specific design guidelines

3. **Database Changes**
   - All schema changes require migrations
   - Test migrations on development branch first
   - Document all schema changes

## Deployment Workflow

1. **Development**
   - Local development with path-based routing
   - Supabase local development

2. **Staging**
   - Branch deployments on Vercel
   - Test database on separate branch

3. **Production**
   - Platform-specific Vercel deployments
   - Main Supabase production database

## User Management

### User Types

1. **Regular Users**
   - Access to specific platforms they've been granted
   - Platform-specific roles and permissions

2. **Guardian Users**
   - Admin access across all platforms
   - Can manage users and their platform access
   - Full visibility across the ecosystem

### Access Control

1. **Platform Access**
   - Managed via the Hub platform
   - Can be granted/revoked on a per-platform basis
   - Optional expiration dates for temporary access

2. **Permissions**
   - Role-based permission system
   - Platform-specific permission sets
   - Inheritance and overrides

## Roadmap

### Phase 1: Foundation (Completed)
- ✅ Unified authentication system
- ✅ Cross-platform access control
- ✅ Shared component library
- ✅ Database schema optimization

### Phase 2: Feature Enhancement (In Progress)
- 🔲 User management interface in Hub
- ✅ Cross-platform notification system
- 🔲 Shared content repository
- 🔲 Improved analytics and tracking

### Phase 3: Advanced Features
- 🔲 AI-powered content recommendations
- 🔲 Advanced collaboration tools
- 🔲 Mobile app integration
- 🔲 Enhanced community features

### Phase 4: Scaling & Optimization
- 🔲 Performance optimization
- 🔲 Internationalization
- 🔲 Enhanced security measures
- 🔲 Expanded API capabilities

## Monitoring & Maintenance

### Key Metrics
- User engagement across platforms
- Cross-platform activity
- Authentication success/failure rates
- API performance

### Regular Maintenance
- Weekly dependency updates
- Monthly security reviews
- Quarterly performance audits

## Documentation

All documentation is maintained in the following locations:

1. **Code Documentation**
   - Inline comments for complex functions
   - README files for modules
   - TypeScript types for all public APIs

2. **User Documentation**
   - Platform-specific help pages
   - Admin documentation in Hub
   - API documentation for developers

3. **Operational Documentation**
   - Deployment procedures
   - Database maintenance
   - Incident response

## Next Steps

Based on the roadmap, the immediate next steps are:

1. Develop the user management interface in the Hub platform
2. Implement the cross-platform notification system
3. Create the shared content repository
4. Enhance analytics and tracking across all platforms 