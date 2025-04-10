# API Documentation

## Overview

This document outlines the API endpoints available across the Neothink platform ecosystem. Each platform has its own set of endpoints, with shared authentication and AI capabilities provided through common interfaces.

## Authentication

All API endpoints require authentication using Supabase Auth. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Common Endpoints

### Authentication

```typescript
POST /api/auth/login
{
  email: string;
  password: string;
}

POST /api/auth/register
{
  email: string;
  password: string;
  name: string;
}

POST /api/auth/logout
```

### AI Integration

```typescript
// AI Chat Interface
POST /api/chat
{
  message: string;               // The user's message
  appName: 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
  conversationId?: string;       // Optional: continue existing conversation
  metadata?: object;             // Optional: additional context
}
// Returns: Streamed response with conversation context
// Authentication: Supabase Auth required
// Response format:
{
  conversationId: string;        // UUID for the conversation
  response: string;              // AI-generated response
  messageId: string;             // UUID for this specific message
}

// Feedback Analysis & Summarization
POST /api/summarize
{
  app_name: string;              // Platform name for context
  timeframe?: string;            // Optional: time period to analyze
  category?: string;             // Optional: feedback category
}
// Returns: Summary with sentiment analysis
// Authentication: Admin-only access required
// Response format:
{
  summary: string;               // Text summary of the feedback
  sentiment: {
    positive: number;            // Percentage (0-100)
    neutral: number;             // Percentage (0-100)
    negative: number;            // Percentage (0-100)
  },
  trends: [{
    category: string;
    volume: number;
    sentiment: string;
  }],
  recommendations: string[]      // AI-generated action items
}

// Vector Search
POST /api/search
{
  query: string;                 // Natural language search query
  collection: string;            // What to search: 'content', 'conversations', etc.
  app_name?: string;             // Optional: specific platform context
  limit?: number;                // Optional: max results (default: 5)
}
// Returns: Semantically similar content
// Authentication: Supabase Auth required
// Response format:
{
  results: [{
    id: string;
    content: string;
    similarity: number;          // Score between 0-1
    metadata: object;
  }]
}

// User Preferences
GET /api/ai/preferences
// Returns: User's AI preferences

PUT /api/ai/preferences
{
  model?: string;                // Preferred AI model
  systemPrompt?: string;         // Custom system instructions
  temperature?: number;          // Creativity setting (0-1)
  features?: {                   // Feature toggles
    notifications: boolean;
    suggestions: boolean;
    analytics: boolean;
  }
}
// Returns: Updated preferences
```

## Platform-Specific APIs

### Hub (go.neothink.io)

```typescript
// Dashboard Data
GET /api/dashboard/stats
// Returns user's cross-platform statistics

// Profile Management
GET /api/profile
PUT /api/profile
{
  name?: string;
  preferences?: object;
  settings?: object;
}

// Knowledge Repository
GET /api/knowledge/articles
POST /api/knowledge/articles
{
  title: string;
  content: string;
  tags: string[];
}

// Conversations
GET /api/conversations
// Returns all user conversations

GET /api/conversations/:id
// Returns specific conversation with messages

DELETE /api/conversations/:id
// Deletes a conversation
```

### Ascenders (www.joinascenders.org)

```typescript
// Wealth Tracking
GET /api/wealth/portfolio
POST /api/wealth/transactions
{
  type: 'income' | 'expense' | 'investment';
  amount: number;
  category: string;
  date: string;
}

// AI Financial Advisor
POST /api/advisor/analyze
{
  financialData: object;
  goals: string[];
  timeframe: string;
}
// Returns financial analysis and recommendations

// Education
GET /api/education/courses
GET /api/education/progress
```

### Immortals (www.joinimmortals.org)

```typescript
// Health Tracking
GET /api/health/metrics
POST /api/health/metrics
{
  type: string;
  value: number;
  date: string;
}

// AI Health Analysis
POST /api/health/analyze
{
  metrics: object;
  goals: string[];
  protocols: string[];
}
// Returns health insights and protocol recommendations

// Protocols
GET /api/protocols
POST /api/protocols/track
{
  protocolId: string;
  completion: number;
  notes?: string;
}
```

### Neothinkers (www.joinneothinkers.org)

```typescript
// Community
GET /api/community/posts
POST /api/community/posts
{
  title: string;
  content: string;
  tags?: string[];
}

// AI Content Analysis
POST /api/community/analyze
{
  content: string;
}
// Returns content analysis, keyword extraction, and topic suggestions

// Events
GET /api/events
POST /api/events
{
  title: string;
  description: string;
  date: string;
  type: string;
}
```

## Error Handling

All API endpoints follow a standard error response format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;     // For tracking in logs
  }
}
```

Common error codes:
- `auth/unauthorized`: Authentication required
- `auth/forbidden`: Insufficient permissions
- `validation/error`: Invalid input data
- `not_found`: Resource not found
- `server_error`: Internal server error
- `rate_limit`: Too many requests
- `ai/unavailable`: AI service temporarily unavailable

## Rate Limiting

API endpoints are rate-limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- 50 AI requests per hour per user (chat, summarize, analyze)

## Streaming Responses

For AI-generated content, we use streaming responses to improve user experience:

```typescript
// Example client code for handling streamed responses
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'Hello AI assistant',
    appName: 'hub'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let result = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  result += chunk;
  // Update UI with each chunk
}
```

## Versioning

The API version is specified in the URL path:
```
/api/v1/... # Current version
```

## Development Guidelines

1. **Authentication**:
   - Always use HTTPS
   - Implement proper token handling
   - Follow security best practices

2. **Error Handling**:
   - Use standard error formats
   - Provide meaningful error messages
   - Include appropriate HTTP status codes

3. **Testing**:
   - Write comprehensive tests
   - Include error scenarios
   - Test rate limiting

4. **Documentation**:
   - Keep API docs updated
   - Include request/response examples
   - Document all error scenarios

## Need Help?

- Check [API Issues](https://github.com/neothink-dao/neothink.io/issues?q=is:issue+is:open+label:api)
- Join our [Discord](#) (coming soon)
- Review [Setup Guide](./setup.md) 