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

### 1. Platform Enhancements
- **Hub**: Improve dashboard UI, add AI-powered insights
- **Ascenders**: Enhance financial tracking, add prosperity metrics
- **Immortals**: Implement health tracking, longevity analytics
- **Neothinkers**: Build community features, collaborative tools

### 2. AI Integration
- **ChatInterface Enhancements**:
  - Improve animation transitions in `apps/*/components/Chat.tsx` using Framer Motion
  - Add typing indicators and response streaming
  - Enhance conversation context management
  - Implement platform-specific response styles
  
- **Feedback Analysis**:
  - Improve sentiment analysis accuracy in the `FeedbackDashboard` component
  - Enhance visualization of sentiment trends
  - Implement automated categorization of feedback
  
- **Edge Functions**:
  - Enhance `supabase/functions/summarize.ts` logic for better content summarization
  - Improve vector embedding generation for semantic search
  - Optimize real-time notification triggers
  
- **Admin Tools**:
  - Enhance analytics dashboards with AI-powered insights
  - Improve content moderation tools
  - Develop better visualization for cross-platform user journeys

### 3. UX/UI Contributions
- Implement responsive designs using Tailwind CSS
- Create fluid animations with Framer Motion
- Ensure consistent design language across platforms
- Optimize for accessibility (WCAG AA compliance)
- Design mobile-first experiences for all components
- Implement dark/light theme support

### 4. Cross-Platform Features
- Improve navigation between platforms
- Enhance state synchronization
- Add unified notifications
- Optimize authentication flows with Supabase Auth

## Development Workflow

1. **Choose Your Focus**:
   - Pick a platform (`apps/<n>`) or shared package (`packages/<n>`)
   - Check existing issues or create a new one

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