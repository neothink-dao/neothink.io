# AI Enhancements for Neothink Turborepo

This document provides an overview of the AI enhancements implemented for the Neothink Turborepo monorepo, focusing on AI integrations, scalability, and real-time updates across the four Next.js apps.

## Database Schema Enhancements

The following tables and functionality have been added:

### Core Chat System
- **conversations**: Stores chat conversations for each user across apps
- **chat_messages**: Stores individual messages within conversations with role-based system

### AI Features
- **ai_embeddings**: Stores vector embeddings for semantic search and AI processing
- **ai_suggestions**: Contains AI-generated recommendations for users
- **ai_analytics**: Tracks AI usage metrics and performance
- **user_ai_preferences**: Stores user preferences for AI features

### Real-Time Updates
- **notifications**: Supports real-time notifications across all apps
- Implemented real-time triggers for chat messages and notifications

## Key Features

### Vector Search
- Implemented using Postgres `pgvector` extension
- Supports semantic search across conversations and feedback
- Enables AI to find relevant previous conversations when answering questions

### Real-Time Notifications
- Push notifications for new messages and important events
- Configurable notification preferences
- Cross-app notification support

### AI Integration
- OpenAI integration for chat responses
- Vector embeddings for improved AI context
- Analytics tracking for AI performance
- Sentiment analysis for feedback and messages

## Components and Utilities

### Chat Integration
- `NeothinkChatbot`: Core AI chat processing functionality
- Real-time chat subscription system with Supabase Realtime

### AI Utilities
- `SupabaseAI`: Handles embeddings, suggestions, and AI analytics
- API endpoints for AI integration

### UI Components
- `NotificationSystem`: Real-time notification component
- Hooks for working with notifications and chats

## Security

All tables implement Row Level Security (RLS) policies to ensure:
- Users can only access their own data
- Authentication is required for all operations
- Security logs track important system events

## Scalability Considerations

- Optimized database indexes for performance
- Asynchronous processing for embedding generation
- Efficient real-time subscription management
- Metadata fields for future extensibility

## Future Enhancements

- Implement Edge Functions for embedding generation
- Add more sophisticated AI features like summarization
- Enhance vector search with hybrid retrieval methods
- Set up fine-tuned models for each app's specific domain

## Usage Examples

### Start a conversation
```typescript
import { startNewConversation } from '@neothink/hub/lib/supabase/chat-subscription';

const conversation = await startNewConversation(
  supabase,
  userId,
  'hub',
  'Initial message'
);
```

### Using real-time chat subscriptions
```typescript
import { useChatSubscription } from '@neothink/hub/lib/supabase/chat-subscription';

function ChatComponent({ userId, conversationId }) {
  const { messages, isLoading, error } = useChatSubscription({
    userId,
    conversationId,
    onInsert: (message) => {
      // Handle new message
    }
  });
  
  // Render chat interface
}
```

### Adding notifications
```tsx
import { NotificationSystem } from '@neothink/ui/src/NotificationSystem';

function AppLayout({ userId }) {
  return (
    <div>
      {/* App content */}
      <NotificationSystem 
        userId={userId}
        appName="hub"
        position="top-right"
      />
    </div>
  );
}
``` 