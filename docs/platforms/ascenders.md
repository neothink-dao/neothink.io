# Ascenders Platform (www.joinascenders.org)

## Overview

The Ascenders platform empowers individuals to achieve financial sovereignty through Ascension principles and FLOW methodologies. It provides comprehensive tools for wealth creation, financial education, and prosperity tracking.

## Core Features

### Current Features
- Financial dashboard
- Wealth tracking tools
- Educational content library
- Community insights
- Progress metrics

### Planned AI Features
- AI financial advisor
- Wealth strategy recommendations
- Market trend analysis
- Personalized learning paths

## Technical Stack

- **Framework**: Next.js (Pages Router)
- **State Management**: Platform Bridge
- **Database**: Supabase
- **AI Integration**: OpenAI GPT
- **Authentication**: Supabase Auth

## Directory Structure

```
apps/ascenders/
├── components/     # Reusable UI components
├── pages/         # Next.js pages and API routes
├── styles/        # CSS and styling
├── lib/          # Utility functions and helpers
├── public/       # Static assets
└── tests/        # Test files
```

## Getting Started

1. **Local Setup**:
   ```bash
   cd apps/ascenders
   npm install
   ```

2. **Environment Variables**:
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   OPENAI_API_KEY=your_openai_key
   ```

3. **Development**:
   ```bash
   # From root directory
   turbo run dev --filter=ascenders
   ```

## Contribution Areas

### 1. UI/UX Improvements
- Enhance financial dashboard
- Add wealth visualization tools
- Improve mobile responsiveness
- Implement dark mode

### 2. AI Features
- Implement financial advisor chatbot
- Add market analysis tools
- Create wealth planning assistant
- Develop learning recommendations

### 3. Integration
- Enhance cross-platform data sharing
- Improve state management
- Add real-time updates
- Optimize performance

### 4. Testing
- Add unit tests for components
- Implement integration tests
- Add E2E testing
- Improve test coverage

## API Routes

### Current Routes
- `/api/auth/*` - Authentication endpoints
- `/api/wealth/*` - Wealth tracking
- `/api/education/*` - Educational content

### Planned AI Routes
- `/api/advisor` - AI financial advisor
- `/api/analyze` - Market analysis
- `/api/plan` - Wealth planning
- `/api/learn` - Learning recommendations

## Development Guidelines

1. **Code Organization**:
   - Use TypeScript for type safety
   - Follow component-based architecture
   - Implement proper error handling
   - Add comprehensive documentation

2. **Testing**:
   - Write tests for new features
   - Ensure existing tests pass
   - Add integration tests
   - Document test cases

3. **Performance**:
   - Optimize bundle size
   - Implement proper caching
   - Use proper loading states
   - Monitor performance metrics

## Need Help?

- Check existing [issues](https://github.com/neothink-dao/neothink.io/issues)
- Join our [Discord](#) (coming soon)
- Review [API documentation](../api.md)
- See [setup guide](../setup.md)
