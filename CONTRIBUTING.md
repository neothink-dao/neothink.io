# Contributing to Neothink Platforms

Welcome to the Neothink ecosystem! We're focused on building and improving our four core platforms:

- **Hub** (go.neothink.io) - Holistic growth platform for Superachievers
- **Ascenders** (www.joinascenders.org) - Prosperity through Ascension and FLOW
- **Immortals** (www.joinimmortals.org) - Longevity and health optimization
- **Neothinkers** (www.joinneothinkers.org) - Community and collaborative growth

## Important Note

We ONLY accept contributions that directly enhance these four platforms. Any contributions not aligned with improving these specific platforms will not be accepted.

## Quick Start

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run a Platform**:
   ```bash
   # Run a specific platform
   pnpm run dev:hub
   pnpm run dev:ascenders
   pnpm run dev:immortals
   pnpm run dev:neothinkers
   
   # Run all platforms
   pnpm run dev
   ```

## Project Structure

```
├── apps/                   # Platform applications
│   ├── hub/               # Superachievers platform
│   ├── ascenders/         # Prosperity platform
│   ├── immortals/         # Longevity platform
│   └── neothinkers/       # Community platform
│
├── packages/              # Shared capabilities
│   ├── database-types/   # Supabase schema types
│   ├── platform-bridge/  # Cross-platform state
│   ├── ai-integration/   # AI capabilities
│   └── ui/               # Design system
│
├── supabase/             # Database migrations and Edge Functions
```

## Areas for Contribution

### Platform-Specific Enhancements ONLY
We are looking for contributions in these specific areas:

1. **Hub Platform** (go.neothink.io)
   - Dashboard improvements
   - AI-powered insights
   - Cross-platform integration features
   - Superachiever journey optimization

2. **Ascenders Platform** (www.joinascenders.org)
   - Financial tracking enhancements
   - Prosperity metrics
   - FLOW system improvements
   - Business system optimization

3. **Immortals Platform** (www.joinimmortals.org)
   - Health tracking features
   - Longevity analytics
   - Project Life integration
   - Wellness optimization tools

4. **Neothinkers Platform** (www.joinneothinkers.org)
   - Community feature enhancements
   - Collaborative tools
   - Learning system improvements
   - Knowledge integration

## Development Guidelines

1. **Platform Focus**
   - Every contribution MUST enhance one or more of our four platforms
   - Changes should align with platform-specific goals
   - Features must integrate with existing platform capabilities
   - Code should follow platform-specific patterns

2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development**:
   ```bash
   # Run specific platform
   pnpm run dev:<platform-name>
   
   # Run all platforms
   pnpm run dev
   ```

4. **Testing**:
   ```bash
   # Run tests for your changes
   pnpm run test --filter=<platform-name>
   ```

5. **Submit Changes**:
   - Push to your fork
   - Create a PR to `main` branch
   - Include clear description and testing steps

## Coding Standards

- Follow TypeScript best practices
- Use ESLint/Prettier configuration
- Follow Next.js conventions
- Write tests for new features
- Document API changes

For detailed standards, see [docs/contributing/README.md](docs/contributing/README.md).

## Need Help?

- **Questions**: Open a [GitHub Discussion](https://github.com/neothink-dao/neothink.io/discussions)
- **Bugs**: File an [Issue](https://github.com/neothink-dao/neothink.io/issues)
- **Contact**: Join our [Discord Community](#) (coming soon)

## Additional Resources

- [Platform Documentation](docs/platforms/)
- [API Documentation](docs/api.md)
- [Development Setup Guide](docs/setup.md)
- [Architecture Overview](docs/architecture/)

Thank you for contributing to the Neothink ecosystem! Together, we're building something extraordinary. 🌟 