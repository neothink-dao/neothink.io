# Neothink+ Platform Monorepo

This monorepo contains the four main applications that make up the Neothink+ ecosystem:

- **Neothink+ Hub** (go.neothink.io) - Central platform for unified experience and cross-platform integration
- **Ascenders** (joinascenders.org) - Business and financial sovereignty platform
- **Neothinkers** (joinneothinkers.org) - Knowledge and community platform
- **Immortals** (joinimmortals.org) - Health and longevity platform

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Deployment**: Vercel
- **Testing**: Vitest
- **Analytics**: PostHog
- **Error Tracking**: Sentry
- **AI Integration**: OpenAI GPT-4
- **Vector Search**: pgvector

## Project Structure

```
.
├── apps/                      # Application code
│   ├── hub/                   # Neothink+ Hub platform
│   ├── ascenders/            # Ascenders platform
│   ├── neothinkers/         # Neothinkers platform
│   └── immortals/           # Immortals platform
├── packages/                  # Shared packages
│   ├── ui/                   # Shared UI components
│   ├── platform-bridge/     # Platform switching and state
│   ├── auth/                # Authentication utilities
│   ├── database/            # Database client and utilities
│   ├── types/               # Shared TypeScript types
│   ├── config/              # Shared configuration
│   └── analytics/           # Analytics utilities
├── supabase/                 # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── seed.sql             # Seed data
└── docs/                     # Documentation
    ├── architecture/        # Architecture documentation
    ├── platforms/          # Platform-specific docs
    └── guides/             # Development guides
```

## Getting Started

1. **Prerequisites**
   ```bash
   # Install pnpm
   npm install -g pnpm@8.15.4

   # Install dependencies
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Update with your values
   nano .env
   ```

3. **Development**
   ```bash
   # Start all applications
   pnpm dev

   # Start specific application
   pnpm dev --filter=@neothink/hub
   ```

4. **Building**
   ```bash
   # Build all applications
   pnpm build

   # Build specific application
   pnpm build --filter=@neothink/hub
   ```

## Development Workflow

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Development branch
   - Feature branches: `feature/name`
   - Hotfix branches: `hotfix/name`

2. **Testing**
   ```bash
   # Run all tests
   pnpm test

   # Run specific tests
   pnpm test --filter=@neothink/hub
   ```

3. **Linting**
   ```bash
   # Lint all code
   pnpm lint

   # Fix linting issues
   pnpm lint:fix
   ```

## Deployment

Each application is deployed to Vercel with its own configuration:

- Hub: [go.neothink.io](https://go.neothink.io)
- Ascenders: [joinascenders.org](https://joinascenders.org)
- Neothinkers: [joinneothinkers.org](https://joinneothinkers.org)
- Immortals: [joinimmortals.org](https://joinimmortals.org)

## Documentation

- [Architecture Overview](docs/architecture/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Contributing Guide](CONTRIBUTING.md)

## Features

### Cross-Platform Integration
- Seamless platform switching
- Unified authentication
- Shared UI components
- Cross-platform state management
- Real-time updates
- Comprehensive analytics
- AI-powered features

### Platform-Specific

#### Neothink+ Hub
- Unified dashboard
- Cross-platform navigation
- Progress tracking
- Resource integration
- Community connections
- AI-enhanced insights
- Platform switching

#### Ascenders
- Business tools
- Financial education
- Networking features
- Resource library

#### Neothinkers
- Learning paths
- Progress tracking
- Community features
- Content library

#### Immortals
- Health protocols
- Tracking tools
- Community support
- Resource access

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 