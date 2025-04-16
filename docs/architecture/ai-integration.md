# AI Integration in the Neothink Ecosystem

This guide provides comprehensive documentation for working with the Neothink AI integration features.

![AI Integration Architecture](https://via.placeholder.com/800x400?text=AI+Integration+Architecture)

## Overview

The Neothink AI integration layer provides intelligent capabilities across all platforms through a unified architecture that includes:

- **Text Generation** - Natural language interaction and content creation
- **Vector Search** - Semantic retrieval of relevant information
- **Context Awareness** - Platform and user-aware AI responses
- **Multi-modal Processing** - Support for text, images, and other data types

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI INTEGRATION LAYER                      │
├─────────────┬──────────────┬───────────────┬───────────────┤
│  Providers  │ Text & Chat  │ Vector Search │ Context Aware │
│  OpenAI     │ Generation   │ Retrieval     │ Processing    │
├─────────────┴──────────────┴───────────────┴───────────────┤
│                    SHARED INFRASTRUCTURE                     │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- OpenAI API key (or other supported provider)
- Supabase project with vector extension enabled
- Database migrations applied (see [Database Setup](#database-setup))

### Installation

The AI integration is available as an internal package:

```typescript
import { useAI, TextGenerationService, SupabaseVectorStore } from '@neothink/ai-integration';
```

### Basic Usage

#### React Components

```tsx
import { useAI, AIChatMessage, AIChatInput } from '@neothink/ai-integration';

function AIChat() {
  const [messages, setMessages] = useState([]);
  const { generateText, isGenerating } = useAI();
  
  const handleSend = async (message) => {
    // Add user message
    setMessages([...messages, { content: message, isUser: true }]);
    
    // Get AI response
    const response = await generateText(message);
    
    // Add AI response
    setMessages([...messages, 
      { content: message, isUser: true },
      { content: response, isUser: false }
    ]);
  };
  
  return (
    <div className="ai-chat">
      <div className="messages">
        {messages.map((msg, i) => (
          <AIChatMessage 
            key={i}
            message={msg.content}
            isUser={msg.isUser}
          />
        ))}
      </div>
      
      <AIChatInput 
        onSend={handleSend}
        disabled={isGenerating}
        placeholder="Ask anything..."
      />
    </div>
  );
}
```

#### Direct Service Usage

```typescript
import { TextGenerationService } from '@neothink/ai-integration';

async function generateContent() {
  const generator = new TextGenerationService({
    provider: 'openai',
    modelName: 'gpt-4o',
    temperature: 0.7
  });
  
  const response = await generator.generateText(
    "Write a short paragraph about the Neothink philosophy",
    { 
      retrievalEnabled: true,
      maxTokens: 200
    }
  );
  
  return response;
}
```

## Key Features

### Text Generation

The text generation system enables natural language interaction with various AI models:

```typescript
import { TextGenerationService } from '@neothink/ai-integration';

// Create service
const textGenerator = new TextGenerationService({
  provider: 'openai',
  modelName: 'gpt-4o',
  temperature: 0.7
});

// Generate text
const response = await textGenerator.generateText(
  "Explain the concept of Integrated Thinking",
  { maxTokens: 300 }
);

// Streaming generation
await textGenerator.generateStreamingText(
  "Write a step-by-step guide to financial independence",
  (chunk) => {
    // Process each chunk as it arrives
    appendToUI(chunk);
  }
);

// Chat conversations
const history = [
  { id: '1', role: 'user', content: 'What is Neothink?', createdAt: new Date().toISOString() },
  { id: '2', role: 'assistant', content: 'Neothink is a philosophy...', createdAt: new Date().toISOString() }
];

const chatResponse = await textGenerator.generateChatResponse(
  history,
  { retrievalEnabled: true }
);
```

### Vector Search

The vector search system enables semantic retrieval of content:

```typescript
import { SupabaseVectorStore } from '@neothink/ai-integration';

// Initialize vector store
const vectorStore = new SupabaseVectorStore(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    tableName: 'ai_embeddings',
    embeddings: {
      similarityThreshold: 0.8
    }
  }
);

// Search for content
const searchResults = await vectorStore.search({
  query: "financial independence strategies",
  platform: 'ascenders',
  maxResults: 5,
  minScore: 0.75
});

// Store a document with embeddings
await vectorStore.storeDocument({
  id: 'doc-123',
  content: 'Neothink philosophy emphasizes integrated thinking...',
  metadata: {
    source: 'philosophy-guide',
    author: 'Mark Hamilton',
    platform: 'hub',
    createdAt: new Date().toISOString()
  },
  embedding: [...] // Vector of 1536 dimensions
});
```

### Context Extraction

```typescript
import { extractContext } from '@neothink/ai-integration';

// Extract context for AI processing
const context = await extractContext(
  userId,
  'immortals',
  'https://immortals.neothink.io/protocols/longevity',
  'Longevity Protocol Guide',
  {
    includeUserProfile: true,
    includePageContent: true,
    maxContentLength: 1500
  }
);
```

## Database Setup

The AI integration requires these tables in your Supabase project:

### Required Extensions

```sql
-- Enable vector extension for embedding similarity search
CREATE EXTENSION IF NOT EXISTS "vector";
```

### AI Conversations Table

```sql
-- Store conversation history
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Add RLS policies
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own conversations"
  ON ai_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### AI Embeddings Table

```sql
-- Store vector embeddings
CREATE TABLE ai_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  platform TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON ai_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

### AI Usage Metrics Table

```sql
-- Track AI usage
CREATE TABLE ai_usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add usage tracking function
CREATE OR REPLACE FUNCTION track_ai_usage(
  p_user_id UUID,
  p_platform TEXT,
  p_model TEXT,
  p_prompt_tokens INTEGER,
  p_completion_tokens INTEGER,
  p_cost FLOAT DEFAULT NULL
) RETURNS UUID
-- [Function implementation...]
```

## Advanced Features

### 1. Retrieval-Augmented Generation

The AI integration supports Retrieval-Augmented Generation (RAG) by combining text generation with vector search:

```typescript
import { TextGenerationService } from '@neothink/ai-integration';

const generator = new TextGenerationService();

// Enable retrieval for more accurate answers
const response = await generator.generateText(
  "What are the main principles of Neothink philosophy?",
  {
    retrievalEnabled: true,
    retrievalOptions: {
      maxDocuments: 3,
      minRelevanceScore: 0.8,
      includeSources: true
    }
  }
);

// The response includes source information
console.log(response.text);
console.log(response.sources); // Array of source documents
```

### 2. Platform-Specific Context

Tailor AI responses based on the specific platform context:

```typescript
import { TextGenerationService } from '@neothink/ai-integration';
import { extractContext } from '@neothink/ai-integration';

// Create service with platform awareness
const generator = new TextGenerationService();

// Extract platform-specific context
const context = await extractContext(
  userId,
  'ascenders', // Financial platform
  currentUrl,
  pageTitle
);

// Generate platform-aware content
const response = await generator.generateText(
  "What investment strategies should I consider?",
  { context }
);
```

### 3. AI Provider Configuration

Support for multiple AI providers:

```typescript
// OpenAI configuration
const openAIGenerator = new TextGenerationService({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o'
});

// Anthropic (Claude) configuration
const anthropicGenerator = new TextGenerationService({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  modelName: 'claude-3-opus-20240229'
});

// Provider-specific options
const response = await openAIGenerator.generateText(
  "Explain Neothink concepts",
  {
    temperature: 0.7,
    maxTokens: 500,
    topP: 0.95
  }
);
```

## Best Practices

### Performance Optimization

1. **Cache common queries** - Store frequently accessed AI responses
2. **Streaming for long outputs** - Use streaming for better UX
3. **Optimize embeddings** - Index properly and use appropriate dimensions
4. **Batch operations** - Combine operations when possible

### Security Considerations

1. **Input validation** - Sanitize user inputs before processing
2. **Rate limiting** - Implement rate limits for AI requests
3. **Cost monitoring** - Track token usage and implement budgets
4. **Sensitive data** - Exclude sensitive information from AI context

### User Experience

1. **Loading states** - Show clear loading indicators during generation
2. **Fallbacks** - Provide graceful degradation when AI services fail
3. **Progressive enhancement** - Layer AI features on top of core functionality
4. **Clear attribution** - Indicate when content is AI-generated

## Troubleshooting

### Common Issues

1. **Rate limiting** - "Too many requests" from OpenAI
   - Solution: Implement exponential backoff and retry logic

2. **Missing embeddings** - Vector search returns no results
   - Solution: Check embedding dimensions and table configuration

3. **Context length exceeded** - Model rejects long inputs
   - Solution: Implement chunking or summarization for large contexts

4. **OpenAI API key issues**
   - Solution: Verify key is valid and has sufficient credits

### Debugging Tools

```typescript
// Enable debug mode
const generator = new TextGenerationService({
  debug: true,
  logLevel: 'verbose'
});

// Monitor token usage
const response = await generator.generateText("...");
console.log(`Used ${response.tokenUsage.total} tokens`);
console.log(`Prompt: ${response.tokenUsage.prompt} tokens`);
console.log(`Completion: ${response.tokenUsage.completion} tokens`);
```

## Roadmap and Future Development

- **Multi-modal support** - Image and video understanding
- **Voice interfaces** - Speech recognition and synthesis
- **Fine-tuned models** - Platform-specific model customization
- **Agent capabilities** - Task execution and automation

---

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Supabase Vector Documentation](https://supabase.com/docs/guides/ai/vector-columns)
- [Internal Wiki: AI Engineering Best Practices](https://wiki.neothink.io/engineering/ai-best-practices)
- [AI Integration Architecture Diagram](https://wiki.neothink.io/architecture/ai-integration) 