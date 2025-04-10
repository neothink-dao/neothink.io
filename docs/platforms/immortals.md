# Immortals Platform (www.joinimmortals.org)

## Overview

The Immortals platform focuses on longevity, health optimization, and transcendence. It provides advanced tools for tracking health metrics, implementing optimization protocols, and achieving peak physical and mental performance.

## Core Features

### Current Features
- Health dashboard
- Biometric tracking
- Protocol management
- Community insights
- Progress tracking

### Planned AI Features
- AI health advisor
- Protocol recommendations
- Biomarker analysis
- Personalized optimization paths

## Technical Stack

- **Framework**: Next.js (Pages Router)
- **State Management**: Platform Bridge
- **Database**: Supabase
- **AI Integration**: OpenAI GPT
- **Authentication**: Supabase Auth

## Directory Structure

```
apps/immortals/
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
   cd apps/immortals
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
   turbo run dev --filter=immortals
   ```

## Contribution Areas

### 1. UI/UX Improvements
- Enhance health dashboard
- Add biometric visualizations
- Improve mobile responsiveness
- Implement dark mode

### 2. AI Features
- Implement health advisor chatbot
- Add biomarker analysis
- Create protocol optimization
- Develop personalized recommendations

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
- `/api/health/*` - Health tracking
- `/api/protocols/*` - Protocol management

### Planned AI Routes
- `/api/advisor` - AI health advisor
- `/api/analyze` - Biomarker analysis
- `/api/optimize` - Protocol optimization
- `/api/recommend` - Health recommendations

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
