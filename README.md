# Neothink Ecosystem

![Neothink Logo](https://neothink.io/assets/images/logo.png)

## Overview

The Neothink platform ecosystem is a collection of interconnected web applications built on a monorepo architecture. This repository houses multiple platforms serving distinct user communities while sharing a common codebase and infrastructure.

### Platforms

| Platform | URL | Description |
|----------|-----|-------------|
| Hub | [go.neothink.io](https://go.neothink.io) | Central platform for users to access all Neothink services and manage account settings |
| Ascenders | [joinascenders.com](https://joinascenders.com) | Platform focused on business and entrepreneurial growth |
| Neothinkers | [joinneothinkers.com](https://joinneothinkers.com) | Platform for personal development and thought exercises |
| Immortals | [joinimmortals.com](https://joinimmortals.com) | Platform for health optimization and legacy creation |

## Technology Stack

This ecosystem is built with modern, production-ready technologies:

- **Frontend**: Next.js 15, React 18, TypeScript 5.4+
- **UI**: Tailwind CSS 3.4+, Shadcn/UI components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Deployment**: Vercel (Edge Functions, Analytics)
- **Development**: Turborepo for monorepo management

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.6.0 or higher
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase project details.

4. Run the development server:
   ```bash
   npm run dev
   ```

### Platform-Specific Setup

Each platform can be run independently:

```bash
# Hub
cd go.neothink.io
npm run dev

# Ascenders
cd joinascenders
npm run dev

# Neothinkers
cd joinneothinkers
npm run dev

# Immortals
cd joinimmortals
npm run dev
```

## Architecture

The Neothink ecosystem follows a monorepo structure with the following organization:

```
/
├── go.neothink.io/       # Hub platform
├── joinascenders/        # Ascenders platform
├── joinneothinkers/      # Neothinkers platform
├── joinimmortals/        # Immortals platform
├── lib/                  # Shared libraries
│   ├── supabase/         # Supabase client and utilities
│   ├── ui/               # Shared UI components
│   └── utils/            # Shared utility functions
├── supabase/             # Supabase migrations and schemas
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── types/                # Shared TypeScript type definitions
├── docs/                 # Documentation
└── scripts/              # Utility scripts for development and deployment
```

## Authentication and Security

The ecosystem implements a unified authentication system with robust security features:

- Row Level Security (RLS) policies for database access control
- Role-based access control (RBAC) for platform-specific permissions
- Cross-platform single sign-on (SSO) via Supabase Auth
- JWT validation and security headers for API routes
- Comprehensive audit logging and security monitoring

## Development Guidelines

### Code Style

- Follow TypeScript best practices with strict type checking
- Use ESLint and Prettier for code formatting
- Write self-documenting code with minimal comments
- Use semantic commit messages (e.g., `feat:`, `fix:`, `docs:`)

### Testing

- Write unit tests for shared utilities and components
- Implement integration tests for critical user flows
- Perform end-to-end testing for full user journeys

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for feature development
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

## Deployment

The repository is configured for automated deployments through Vercel:

- **Production**: Deploys from the `main` branch
- **Preview**: Deploys from pull requests
- **Development**: Deploys from the `develop` branch

## Documentation

For detailed documentation, refer to the `/docs` directory:

- [Authentication](./docs/auth-implementation-summary.md)
- [Database Schema](./docs/database-schema.md)
- [API Documentation](./docs/api-documentation.md)
- [Component Library](./docs/component-library.md)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary software owned by Neothink DAO. All rights reserved.

## Support

For support or inquiries, contact support@neothink.io. 