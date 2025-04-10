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

### AI Integration
- **Financial AI Assistant**: 
  - Context-aware financial guidance through ChatInterface
  - Personalized wealth strategy recommendations
  - Market insights with semantic understanding
  - Resource recommendations based on financial goals

- **Prosperity Analytics**: 
  - AI-driven financial goal setting
  - Predictive modeling for wealth trajectories
  - Pattern recognition for financial behavior
  - Automated opportunity identification

- **Learning Optimization**:
  - Personalized learning paths based on engagement
  - Adaptive content difficulty based on progress
  - Smart content summarization for key financial concepts
  - Real-time feedback on financial exercises

## Technical Stack

- **Framework**: Next.js (Pages Router)
- **State Management**: Platform Bridge
- **Database**: Supabase with pgvector for embeddings
- **AI Integration**: OpenAI API with vector embeddings
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime for market updates

## Directory Structure

```
apps/ascenders/
├── components/     # Reusable UI components
│   ├── Chat/      # Financial advisor ChatInterface
│   ├── Dashboard/ # Prosperity tracking components
│   └── Learn/     # Educational components
├── pages/         # Next.js pages and API routes
│   ├── api/       # API endpoints including AI services
│   └── wealth/    # Wealth management pages
├── styles/        # Tailwind CSS and styling
├── lib/          # Utility functions and helpers
│   └── supabase/  # Supabase client and hooks
├── public/       # Static assets
└── tests/        # Test files
```

## Getting Started

1. **Local Setup**:
   ```bash
   cd apps/ascenders
   pnpm install
   ```

2. **Environment Variables**:
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_key
   ```

3. **Development**:
   ```bash
   # From root directory
   pnpm run dev:ascenders
   ```

## Contribution Areas

### 1. UI/UX Improvements
- Create responsive wealth tracking dashboards with Tailwind
- Implement animated financial charts with Framer Motion
- Add real-time indicators for market data updates
- Design intuitive wealth visualization interfaces
- Enhance mobile experience for on-the-go financial tracking

### 2. AI Features
- Enhance the Financial Advisor ChatInterface with:
  - Typing indicators and response streaming
  - Context retention between sessions
  - Financial terminology explanations
  - Visual feedback for processing states
- Improve prosperity analytics with:
  - Better visualization of AI-generated insights
  - Enhanced pattern recognition algorithms
  - More accurate predictive modeling

### 3. Real-time Features
- Add real-time market data updates
- Implement collaborative financial planning tools
- Create notification system for financial goals and milestones
- Develop live community engagement features
- Add progress animation for wealth tracking

### 4. Integration
- Enhance data sharing between Hub and Ascenders
- Implement seamless authentication experience
- Optimize API performance for financial calculations
- Create better error handling for financial operations

## API Routes

### AI Routes
- `/api/advisor`: Financial AI assistant for prosperity guidance
  - POST: `{ message, conversationId?, context? }`
  - Returns: Streaming response with financial advice

- `/api/wealth/analyze`: AI analysis of financial patterns and opportunities
  - POST: `{ financialData, timeframe, goals }`
  - Returns: `{ insights, opportunities, risks, recommendations }`

- `/api/learn/recommend`: Personalized learning path recommendations
  - GET: Authenticated user route
  - Returns: `{ recommendedContent, nextSteps, estimatedProgress }`

- `/api/market/forecast`: AI-driven market trend analysis
  - POST: `{ markets, timeframe, interests }`
  - Returns: `{ trends, predictions, confidenceScores }`

## Development Guidelines

1. **AI Financial Features**:
   - Always provide explanations for financial recommendations
   - Include confidence scores with financial predictions
   - Ensure transparency in AI decision-making
   - Implement proper fallbacks for when AI services are unavailable
   - Design interfaces that make complex financial concepts accessible

2. **Performance Optimization**:
   - Optimize financial calculations for real-time updates
   - Implement efficient caching for financial data
   - Use virtualization for large financial datasets
   - Create responsive experiences for all device types
   - Optimize AI token usage for cost efficiency

## Need Help?

- Check existing [issues](https://github.com/neothink-dao/neothink.io/issues)
- Join our [Discord](#) (coming soon)
- Review [API documentation](../api.md)
- See [setup guide](../setup.md)
