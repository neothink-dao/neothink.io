# Getting Started with Neothink+

Welcome to Neothink+! This guide will help you get started with development in the Neothink+ ecosystem.

## Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later
- Git
- VS Code (recommended)
- Docker (optional, for local development)

## Quick Start

1. **Clone the Repository**

```bash
git clone https://github.com/neothink-dao/neothink.io.git
cd neothink.io
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Set Up Environment**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=your_auth_domain
NEXTAUTH_SECRET=your_nextauth_secret

# API Keys
OPENAI_API_KEY=your_openai_key
```

4. **Start Development Server**

```bash
# Start all platforms
pnpm dev

# Start specific platform
pnpm dev:hub
pnpm dev:ascenders
pnpm dev:neothinkers
pnpm dev:immortals
```

## Project Structure

```
.
├── apps/                 # Platform applications
│   ├── hub/             # Central Hub platform
│   ├── ascenders/       # Ascenders platform
│   ├── neothinkers/     # Neothinkers platform
│   └── immortals/       # Immortals platform
├── packages/            # Shared packages
│   ├── ui/             # UI components
│   ├── auth/           # Authentication
│   ├── database/       # Database utilities
│   └── platform-bridge/ # Platform integration
├── docs/               # Documentation
└── scripts/            # Development scripts
```

## Development Workflow

1. **Create a Feature Branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**

Follow our [coding standards](../contributing/code-style.md) and [best practices](../guides/development.md).

3. **Run Tests**

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

4. **Submit Changes**

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

Create a Pull Request following our [contribution guidelines](../contributing/README.md).

## Platform Development

### Hub Platform

The Hub is the central platform managing user profiles and cross-platform access.

```typescript
// Example: Register platform in Hub
platformBridge.registerPlatform('hub', {
  name: 'Hub',
  description: 'Central platform for Neothink+',
  features: ['user-management', 'cross-platform-access'],
});
```

### Ascenders Platform

Ascenders focuses on advanced learning and challenges.

```typescript
// Example: Create learning path
const learningPath: LearningPath = {
  id: 'path-1',
  name: 'Advanced Concepts',
  modules: [],
  requirements: {
    level: 3,
    prerequisites: ['basic-concepts'],
  },
};
```

### Neothinkers Platform

Neothinkers platform manages content and community features.

```typescript
// Example: Create content
const content: Content = {
  id: 'content-1',
  title: 'Introduction',
  type: 'article',
  visibility: 'public',
  content: '...',
};
```

### Immortals Platform

Immortals platform handles project management and collaboration.

```typescript
// Example: Create project
const project: Project = {
  id: 'project-1',
  name: 'New Initiative',
  team: [],
  milestones: [],
  status: 'active',
};
```

## Common Tasks

### Authentication

```typescript
// Sign in user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Check session
const { data: { session } } = await supabase.auth.getSession();
```

### Database Operations

```typescript
// Query data
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId);

// Insert data
const { data, error } = await supabase
  .from('content')
  .insert([{ title: 'New Content', user_id: userId }]);
```

### Platform Switching

```typescript
// Switch platform
await platformBridge.switchPlatform('ascenders');

// Get current platform
const platform = platformBridge.getCurrentPlatform();
```

## Troubleshooting

### Common Issues

1. **Installation Problems**
   ```bash
   # Clear dependencies
   rm -rf node_modules
   pnpm store prune
   pnpm install
   ```

2. **Database Connection**
   - Check Supabase credentials
   - Verify network access
   - Check RLS policies

3. **Build Errors**
   - Clear Next.js cache
   - Check TypeScript errors
   - Verify dependencies

## Next Steps

1. Read the [Architecture Overview](../architecture/overview.md)
2. Review [Security Guidelines](../guides/security.md)
3. Explore [API Documentation](../api/README.md)
4. Join our [Discord Community](https://discord.gg/neothink)

## Additional Resources

- [Development Guide](../guides/development.md)
- [Testing Guide](../guides/testing.md)
- [API Reference](../api/README.md)
- [Security Guide](../guides/security.md)
- [Contributing Guide](../contributing/README.md) 