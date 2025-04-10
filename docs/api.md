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

### AI Integration (Planned)

```typescript
POST /api/chat
{
  prompt: string;
  app: 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
  context?: {
    userId: string;
    platformData?: any;
  }
}
// Returns: Streamed GPT-3.5 response

POST /api/summarize
{
  app_name: string;
  content?: string;
  userId?: string;
}
// Returns: { summary: string }
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
  }
}
```

Common error codes:
- `auth/unauthorized`: Authentication required
- `auth/forbidden`: Insufficient permissions
- `validation/error`: Invalid input data
- `not_found`: Resource not found
- `server_error`: Internal server error

## Rate Limiting

API endpoints are rate-limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

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