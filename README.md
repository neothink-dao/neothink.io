# Neothink Platforms Ecosystem

A monorepo containing all Neothink platform applications with unified authentication, shared components, and platform-specific implementations.

## Platforms

| Platform | URL | Description |
|----------|-----|-------------|
| Hub | [go.neothink.io](https://go.neothink.io) | Central management platform |
| Ascenders | [www.joinascenders.org](https://www.joinascenders.org) | Platform for future-focused thinkers |
| Neothinkers | [www.joinneothinkers.org](https://www.joinneothinkers.org) | Community for innovative thinkers |
| Immortals | [www.joinimmortals.org](https://www.joinimmortals.org) | Platform for longevity enthusiasts |

## Architecture

The ecosystem is built with:

- **Next.js**: React framework for all platforms
- **Supabase**: Database, authentication, and storage
- **Tailwind CSS**: Styling with platform-specific theming
- **TypeScript**: Type safety across all codebases
- **Vercel**: Hosting and deployment

## Repository Structure

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

## Core Features

- **Unified Authentication**: Single account across all platforms
- **Platform Access Control**: Users can access specific platforms
- **Guardian (Admin) Users**: Access and manage all platforms
- **Platform Detection**: Automatic detection via domain or path
- **Shared Components**: Core UI elements shared across platforms
- **Platform-Specific Theming**: Each platform has its own visual identity

## Key Features

- **Unified Authentication**: Single sign-on across all platforms with Supabase Auth
- **Role-Based Access Control**: Granular permissions for each platform
- **Cross-Platform Notifications**: Unified notification system for all platforms
- **Shared Component Library**: Consistent UI across all platforms
- **Platform Detection**: Automatic detection of current platform
- **Admin Management**: Centralized user and permission management

## Getting Started

See [GETTING-STARTED.md](./GETTING-STARTED.md) for detailed setup instructions.

Quick start:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

## Documentation

- [Getting Started](./GETTING-STARTED.md): Development setup guide
- [Master Plan](./MASTER-PLAN.md): Strategic roadmap
- [Refactoring Summary](./REFACTORING-SUMMARY.md): Summary of refactoring changes
- [Recent Improvements](./IMPROVEMENTS.md): Summary of recent improvements
- [Strategic Value](./docs/STRATEGIC-VALUE.md): Business case for the unified platform
- [Executive Summary](./docs/EXECUTIVE-SUMMARY.md): Concise value proposition
- [Superachiever Concept](./docs/SUPERACHIEVER-CONCEPT.md): Multi-platform user benefits
- [Supabase Integration](./docs/SUPABASE.md): Database and auth details
- [Monorepo Structure](./docs/MONOREPO.md): Repository organization
- [Notifications System](./docs/NOTIFICATIONS.md): Cross-platform notifications

## Development Workflow

1. Local Development:
   - Path-based routing (`/hub`, `/ascenders`, etc.)
   - Shared Supabase instance

2. Staging:
   - Branch deployments on Vercel
   - Branch database in Supabase

3. Production:
   - Domain-specific deployments
   - Production database

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass
5. Request review from a team member

## License

Proprietary © 2023 Neothink. All rights reserved. 

## Monorepo Structure

This project is set up as a monorepo using Turborepo for build orchestration and workspace management. The structure follows best practices for a Next.js-based monorepo:

- All platforms are contained in their respective directories without nested git repositories
- Workspaces are properly configured in the root package.json
- Turborepo pipeline is defined in turbo.json
- Shared code is located in the lib directory
- Documentation correctly reflects the actual directory structure

Each platform can be developed independently or together, with shared dependencies being managed efficiently by Turborepo. 