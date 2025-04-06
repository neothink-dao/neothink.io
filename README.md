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
├── apps/                   # Platform applications
│   ├── hub/                # Hub platform (go.neothink.io)
│   ├── ascenders/          # Ascenders platform
│   ├── neothinkers/        # Neothinkers platform
│   └── immortals/          # Immortals platform
├── lib/                    # Shared library code
│   ├── ui/                 # Shared UI components
│   ├── auth/               # Authentication utilities
│   ├── api/                # API utilities
│   └── supabase/           # Database utilities
├── packages/               # Shared configuration
│   ├── config/             # Shared configuration
│   ├── tsconfig/          # TypeScript configuration
│   └── eslint/            # ESLint configuration
└── docs/                  # Documentation
```

## Core Features

- **Unified Authentication**: Single account across all platforms
- **Cross-Platform Features**: Seamless integration between platforms
- **Shared Components**: Core UI elements shared across platforms
- **Platform-Specific Theming**: Each platform has its own visual identity
- **Role-Based Access**: Granular permissions for each platform
- **Superachiever Bundle**: Premium all-platform offering

## Getting Started

See [docs/development/MONOREPO-GUIDE.md](docs/development/MONOREPO-GUIDE.md) for detailed setup instructions.

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

### For Stakeholders
- [Unified Platform Overview](docs/UNIFIED-PLATFORM.md) - Complete overview of the value-unlocking approach
- [Why Modern Stack](docs/WHY-MODERN-STACK.md) - Benefits of our modern tech stack

### For Developers
- [Technical Implementation](docs/TECHNICAL-IMPLEMENTATION.md) - Complete technical details
- [Development Guides](docs/development/) - Setup and workflow guides
- [Technical Reference](docs/reference/) - Architecture and features

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

Proprietary © 2024 Neothink. All rights reserved. 