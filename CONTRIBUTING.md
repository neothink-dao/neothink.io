# Contributing to Neothink Platforms

Welcome to the Neothink ecosystem! We're excited to have you join us in building transformative digital experiences that elevate human consciousness and potential. Our platform consists of four interconnected applications, each focusing on a unique aspect of human advancement:

- **Hub** (go.neothink.io) - Holistic growth platform for Superachievers
- **Ascenders** (www.joinascenders.org) - Prosperity through Ascension and FLOW
- **Immortals** (www.joinimmortals.org) - Longevity and health optimization
- **Neothinkers** (www.joinneothinkers.org) - Community and collaborative growth

## Quick Start

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run a Platform**:
   ```bash
   # Run a specific platform
   turbo run dev --filter=hub
   turbo run dev --filter=ascenders
   turbo run dev --filter=immortals
   turbo run dev --filter=neothinkers
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
│   ├── database/         # Supabase integration
│   ├── platform-bridge/  # Cross-platform state
│   ├── ai-integration/   # AI capabilities
│   └── ui/               # Design system
```

## Areas for Contribution

### 1. Platform Enhancements
- **Hub**: Improve dashboard UI, add AI-powered insights
- **Ascenders**: Enhance financial tracking, add prosperity metrics
- **Immortals**: Implement health tracking, longevity analytics
- **Neothinkers**: Build community features, collaborative tools

### 2. AI Integration
- Implement user-facing chatbots
- Add administrative summaries
- Enhance content recommendations
- Develop semantic search

### 3. Cross-Platform Features
- Improve navigation between platforms
- Enhance state synchronization
- Add unified notifications
- Optimize authentication flows

## Development Workflow

1. **Choose Your Focus**:
   - Pick a platform (`apps/<name>`) or shared package (`packages/<name>`)
   - Check existing issues or create a new one

2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development**:
   ```bash
   # Run specific platform
   turbo run dev --filter=<platform-name>
   
   # Run all platforms
   turbo run dev
   ```

4. **Testing**:
   ```bash
   # Run tests for your changes
   turbo run test --filter=<platform-name>
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