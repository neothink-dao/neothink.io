# Neothink Platform

A monorepo containing four Next.js applications focused on human advancement and consciousness expansion:

- **Hub** (go.neothink.io) - Holistic growth platform for Superachievers
- **Ascenders** (www.joinascenders.org) - Prosperity through Ascension and FLOW
- **Immortals** (www.joinimmortals.org) - Longevity and health optimization
- **Neothinkers** (www.joinneothinkers.org) - Community and collaborative growth

## Features

- 🧠 **AI-powered Experience**:
  - Platform-specific chatbots providing tailored guidance for Ascenders, Immortals, and Neothinkers
  - Real-time conversation updates with semantic search for contextual responses
  - Vector embeddings for improved memory across interactions
  - Sentiment analysis for personalized feedback

- 📊 **Admin Analytics**:
  - Real-time feedback dashboard with sentiment visualization
  - Cross-platform user activity tracking and insights
  - AI-powered content suggestions based on user engagement

- 🔄 **Real-time Notifications**:
  - Instant updates across all platforms
  - Personalized alerts based on user activity and preferences
  - Event-driven architecture with Supabase Realtime

- 🛡️ **Enterprise-grade Security**:
  - Row-Level Security (RLS) with Supabase Auth
  - End-to-end encryption for sensitive data
  - Comprehensive audit logging

- 🎨 **Integrated UI/UX**:
  - Responsive Tailwind designs across all platforms
  - Smooth Framer Motion animations
  - Consistent branded experience

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Required environment variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   # Run all applications
   pnpm run dev
   
   # Run a specific application
   pnpm run dev:hub
   pnpm run dev:ascenders
   pnpm run dev:immortals
   pnpm run dev:neothinkers
   ```

## Documentation

- [Contributing Guidelines](CONTRIBUTING.md)
- [Database Schema](supabase/README.md)
- [API Documentation](docs/api.md)

## License

Proprietary - All Rights Reserved

Copyright © 2025 Neothink DAO and The Mark Hamilton Family

This software is protected by copyright law and international treaties. 
Unauthorized reproduction or distribution of this software, or any portion of it, 
may result in severe civil and criminal penalties, and will be prosecuted 
to the maximum extent possible under law.

Built with ❤️ by the Neothink+ team 