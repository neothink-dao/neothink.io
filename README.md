# Neothink Platforms Monorepo

This repository contains the codebase for all Neothink platforms, including Hub, Ascenders, Neothinkers, and Immortals.

## Overview

Neothink is a collection of interconnected platforms that share a common infrastructure and codebase. The platforms are:

- **[Hub](https://go.neothink.io)** - Central platform for Neothink content
- **[Ascenders](https://joinascenders.org)** - Wealth building platform
- **[Neothinkers](https://joinneothinkers.org)** - Neothink community platform
- **[Immortals](https://joinimmortals.org)** - Health and longevity platform

## Repository Structure

```
/
├── apps/                  # Deployable applications
│   ├── hub/               # Hub platform (go.neothink.io)
│   ├── ascenders/         # Ascenders platform (joinascenders.org)
│   ├── immortals/         # Immortals platform (joinimmortals.org)
│   └── neothinkers/       # Neothinkers platform (joinneothinkers.org)
├── packages/              # Shared internal packages
│   ├── database/          # Database client and utilities
│   ├── auth/              # Authentication logic
│   ├── ui/                # UI components
│   ├── config/            # Shared configuration
│   └── utils/             # Common utilities
├── docs/                  # Documentation
└── supabase/              # Database definitions
```

## Getting Started

See the [Getting Started Guide](docs/getting-started/index.md) for detailed setup instructions.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/neothink.git
cd neothink

# Install dependencies
pnpm install

# Build shared packages
pnpm build --filter=@neothink/database --filter=@neothink/auth --filter=@neothink/ui

# Start development server
pnpm dev
```

## Documentation

- [Getting Started](docs/getting-started/index.md)
- [Development Guide](docs/getting-started/development.md)
- [Architecture](docs/architecture/monorepo.md)
- [Database](docs/architecture/database.md)
- [Authentication](docs/architecture/auth.md)
- [UI Components](docs/architecture/ui.md)

## Contributing

1. Ensure you understand the monorepo structure
2. Follow the coding conventions
3. Write tests for new features
4. Submit a PR with your changes

## License

Proprietary - All rights reserved. 