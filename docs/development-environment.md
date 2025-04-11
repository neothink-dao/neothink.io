# Development Environment Setup

This guide provides detailed instructions for setting up your development environment for the Neothink+ ecosystem.

## System Requirements

### Hardware Requirements
- **CPU**: 4+ cores recommended
- **RAM**: 16GB minimum, 32GB recommended
- **Storage**: 256GB+ SSD recommended
- **Internet**: Stable broadband connection

### Software Requirements
- **Operating System**: macOS, Linux, or Windows 11 with WSL2
- **Node.js**: v18.x or later (LTS recommended)
- **pnpm**: v8.15.4 or later
- **Git**: Latest version
- **Docker**: Latest version for local Supabase
- **VS Code**: Latest version (recommended IDE)

## IDE Setup

### Visual Studio Code

1. **Required Extensions**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - PostCSS Language Support
   - TypeScript Vue Plugin (Volar)
   - GitHub Copilot (recommended)
   - GitLens (recommended)

2. **Workspace Settings**
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.tsdk": "node_modules/typescript/lib",
     "typescript.enablePromptUseWorkspaceTsdk": true
   }
   ```

## Environment Setup

### 1. Node.js Installation

#### Using nvm (recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 18
nvm use 18
```

### 2. pnpm Installation
```bash
# Install pnpm
npm install -g pnpm@8.15.4

# Verify installation
pnpm --version
```

### 3. Docker Setup

1. **Install Docker Desktop**
   - [Download for macOS](https://www.docker.com/products/docker-desktop)
   - [Download for Windows](https://www.docker.com/products/docker-desktop)
   - [Install on Linux](https://docs.docker.com/engine/install/)

2. **Configure Resources**
   - Allocate at least 4GB RAM
   - 2 CPU cores minimum
   - 60GB disk space

### 4. Supabase CLI

```bash
# Install Supabase CLI
pnpm add -g supabase

# Login to Supabase
supabase login

# Initialize Supabase
supabase init
```

## Repository Setup

### 1. Clone and Configure

```bash
# Clone repository
git clone https://github.com/neothink-dao/neothink.io.git
cd neothink.io

# Install dependencies
pnpm install

# Setup git hooks
pnpm prepare
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Generate local keys
pnpm supabase start
```

Update `.env` with required values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
POSTHOG_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
OPENAI_API_KEY=your_openai_key
```

## Development Tools

### 1. Database Management

```bash
# Start local Supabase
pnpm supabase start

# Create migration
pnpm supabase migration new my_migration

# Apply migrations
pnpm supabase db push
```

### 2. Testing Tools

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test path/to/test
```

### 3. Code Quality Tools

```bash
# Type checking
pnpm type-check

# Lint code
pnpm lint

# Format code
pnpm format
```

## Platform-Specific Setup

### Neothink+ Hub
```bash
# Start Hub development
pnpm dev --filter=@neothink/hub
```

### Ascenders
```bash
# Start Ascenders development
pnpm dev --filter=@neothink/ascenders
```

### Neothinkers
```bash
# Start Neothinkers development
pnpm dev --filter=@neothink/neothinkers
```

### Immortals
```bash
# Start Immortals development
pnpm dev --filter=@neothink/immortals
```

## Troubleshooting

### Common Issues

1. **pnpm Install Fails**
   ```bash
   # Clear pnpm store
   pnpm store prune
   
   # Clean install
   pnpm install --force
   ```

2. **Supabase Connection Issues**
   ```bash
   # Reset Supabase
   pnpm supabase stop
   pnpm supabase start
   ```

3. **Port Conflicts**
   ```bash
   # Check ports
   lsof -i :3000
   
   # Kill process
   kill -9 PID
   ```

## Best Practices

1. **Git Workflow**
   - Use feature branches
   - Follow conventional commits
   - Keep PRs focused and small

2. **Code Style**
   - Follow ESLint rules
   - Use TypeScript strictly
   - Document complex logic

3. **Testing**
   - Write unit tests for utilities
   - Add E2E tests for flows
   - Test edge cases

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For additional help:
- Join our [Discord](https://discord.gg/neothink)
- Check [GitHub Issues](https://github.com/neothink-dao/neothink.io/issues)
- Review [FAQ](./faq.md) 