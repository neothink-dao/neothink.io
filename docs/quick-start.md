# Neothink Quick Start Guide

Welcome to the Neothink Platform Ecosystem! This guide will help you get up and running quickly.

## 1. Environment Setup

### Prerequisites

- **Node.js**: Version 20.x or later
- **npm**: Version 10.x or later
- **Git**: Latest version recommended
- **Code Editor**: VS Code with recommended extensions
- **API Keys**: Supabase and OpenAI access

### Initial Setup

1. Clone the repository:

```bash
git clone https://github.com/neothink/platform-monorepo.git
cd platform-monorepo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your API keys:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
```

## 2. Development Workflow

### Running the Development Server

Start a specific platform:

```bash
# Run Hub platform
npm run dev:hub

# Run Ascenders platform
npm run dev:ascenders

# Run Immortals platform
npm run dev:immortals

# Run all platforms
npm run dev
```

### Workspace Tour

Here's what's in the monorepo:

- **`/apps`**: Individual platform applications
- **`/packages`**: Shared code and utilities
- **`/infrastructure`**: Deployment and CI/CD configuration

### Key Packages

- **`@neothink/database`**: Database access and schemas
- **`@neothink/platform-bridge`**: Cross-platform state management
- **`@neothink/ai-integration`**: AI utilities and vector search
- **`@neothink/ui`**: Shared UI components

## 3. Supabase Setup

### Tables Structure

The database includes these key tables:

| Table | Purpose |
|-------|---------|
| `platform_preferences` | User preferences by platform |
| `platform_state` | Shared state between platforms |
| `ai_conversations` | AI conversation history |
| `ai_embeddings` | Vector embeddings for semantic search |

### Local Development

1. If using Supabase locally:

```bash
npx supabase start
```

2. Run initial migrations:

```bash
npm run db:setup
```

## 4. Feature Development

### Adding a New Feature

1. Create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

2. Implement your changes following our coding standards
3. Write tests for your feature
4. Create a pull request

### Working with Shared Packages

Importing from shared packages:

```typescript
// Database access
import { getSupabaseClient } from '@neothink/database';

// Platform bridge
import { usePlatformBridge } from '@neothink/platform-bridge';

// AI integration
import { useAI } from '@neothink/ai-integration';

// UI components
import { Button } from '@neothink/ui';
```

## 5. Platform-Specific Guidelines

### Hub

Primary focus:
- Central knowledge repository
- Navigation to other platforms
- Administrative capabilities

### Ascenders

Primary focus:
- Financial education
- Wealth strategies
- Investment tracking

### Immortals

Primary focus:
- Health protocols
- Biometric tracking
- Longevity optimization

### Neothinkers

Primary focus:
- Community engagement
- Social connection
- Knowledge sharing

## 6. Common Tasks

### Adding a Database Migration

1. Create migration file:

```bash
npm run db:migration:create -- add-new-table
```

2. Edit the generated file in `/supabase/migrations/`
3. Apply the migration:

```bash
npm run db:migration:apply
```

### Deploying to Production

```bash
# Deploy all platforms
npm run deploy

# Deploy specific platform
npm run deploy:hub
```

## 7. Getting Help

- Check the [detailed documentation](./README.md)
- Join our [Discord channel](https://discord.gg/neothink)
- Ask in the #dev-help Slack channel
- Email the development team at dev@neothink.io

---

Welcome aboard! We're excited to have you contribute to the Neothink mission of advancing human consciousness through our integrated digital platforms. 