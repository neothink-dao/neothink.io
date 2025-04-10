# Neothink Platform Ecosystem

![Neothink Logo](https://via.placeholder.com/150x50?text=Neothink)

> *"Elevate consciousness through integrated digital experiences"*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-green.svg)](https://supabase.io/)

## 🌟 Overview

The Neothink Platform Ecosystem is a unified application architecture that powers multiple interconnected platforms, each targeting specific aspects of human advancement and consciousness expansion:

- **Hub** - Central knowledge repository and integration point
- **Ascenders** - Financial sovereignty and wealth creation
- **Immortals** - Longevity, health optimization, and transcendence
- **Neothinkers** - Community, connection, and collaborative thought

All platforms share core infrastructure, state management, AI capabilities, and design systems while maintaining their unique identities and specialized features.

## 🧩 Architecture

### Platform Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    NEOTHINK PLATFORMS                       │
├────────────┬────────────┬─────────────────┬───────────────┤
│    Hub     │ Ascenders  │    Immortals    │  Neothinkers  │
├────────────┴────────────┴─────────────────┴───────────────┤
│                      SHARED PACKAGES                        │
├────────────┬────────────┬─────────────────┬───────────────┤
│  Database  │ AI Engine  │ Platform Bridge │      UI       │
└────────────┴────────────┴─────────────────┴───────────────┘
```

### Directory Structure

```
├── apps/                   # Platform applications
│   ├── hub/                # Central knowledge platform
│   ├── ascenders/          # Financial sovereignty platform
│   ├── immortals/          # Longevity and health platform 
│   └── neothinkers/        # Community platform
│
├── packages/               # Shared capabilities
│   ├── database/           # Data persistence and schema
│   ├── platform-bridge/    # Cross-platform state management
│   ├── ai-integration/     # AI services and vector storage
│   └── ui/                 # Design system components
│
└── infrastructure/         # Deployment and CI/CD
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x+
- npm 10.x+
- Supabase account
- OpenAI API key (for AI features)

### First-Time Setup

1. **Clone and install dependencies:**

```bash
git clone https://github.com/neothink/platform-monorepo.git
cd platform-monorepo
npm install
```

2. **Environment configuration:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys and configuration values:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
```

3. **Start development server:**

```bash
# Run all platforms
npm run dev

# Run specific platform
npm run dev:hub
npm run dev:ascenders
npm run dev:immortals
```

### Development Workflow

Our development process follows these principles:

1. **Feature branches** - Create branches from `main` for each feature
2. **Atomic commits** - Make small, focused commits with clear messages
3. **Pull requests** - All changes go through PR review before merging
4. **CI/CD pipeline** - Automated testing and deployment

## 🧠 Key Technologies

### Core Stack

- **TypeScript** - Type-safe development across the ecosystem
- **Next.js** - React framework with App Router and Server Components
- **Supabase** - Backend with real-time capabilities and vector storage
- **OpenAI** - Foundation models for natural language and embeddings

### Platform Bridge

The platform bridge enables seamless transitions between Neothink platforms:

- State synchronization across platforms
- Unified preference management
- Cross-platform notifications
- Seamless navigation

### AI Integration

Our AI integration layer provides:

- Context-aware conversation capabilities
- Semantic search with vector embeddings
- Personalized recommendations
- Content generation and summarization

## 📚 Platform Packages

### Database

```typescript
// Example: Database client usage
import { supabase } from '@neothink/database';

// Query user preferences
const { data } = await supabase
  .from('platform_preferences')
  .select('*')
  .eq('user_id', userId);
```

### Platform Bridge

```typescript
// Example: Cross-platform navigation
import { usePlatformBridge } from '@neothink/platform-bridge';

function PlatformSwitcher() {
  const { navigateToPlatform } = usePlatformBridge();
  
  return (
    <button onClick={() => navigateToPlatform('immortals')}>
      Switch to Immortals
    </button>
  );
}
```

### AI Integration

```typescript
// Example: AI text generation
import { useAI } from '@neothink/ai-integration';

function AIAssistant() {
  const { generateText, isGenerating } = useAI();
  
  const handleQuestion = async (question) => {
    const response = await generateText(question);
    setAnswer(response);
  };
  
  // Component implementation...
}
```

## 🗄️ Database Schema

Our Supabase database includes these key tables:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `platform_preferences` | User preferences by platform | `user_id`, `platform`, `preferences` |
| `platform_state` | Cross-platform state | `user_id`, `platform`, `key`, `value` |
| `ai_conversations` | Conversation history | `user_id`, `messages`, `metadata` |
| `ai_embeddings` | Vector embeddings | `content`, `embedding`, `metadata` |

## 📱 Platform Features

### Hub

- Knowledge repository and content management
- Central dashboard and platform integration
- Administrative tools and analytics

### Ascenders

- Wealth strategy tools
- Financial education content
- Investment tracking and optimization

### Immortals

- Health protocols and tracking
- Biometric integration
- Longevity research and personalized recommendations

### Neothinkers

- Community forums and discussions
- Collaborative projects
- Events and connections

## 👩‍💻 Contributing

We welcome contributions that align with our vision:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-idea`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-idea`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 🚢 Deployment

Each platform is deployed independently to its own domain:

```bash
# Deploy specific platform
npm run deploy:hub         # Deploys to hub.neothink.io
npm run deploy:ascenders   # Deploys to ascenders.neothink.io
npm run deploy:immortals   # Deploys to immortals.neothink.io
```

## 📑 License

Proprietary © Neothink

---

<p align="center">Built with ❤️ by the Neothink team</p> 