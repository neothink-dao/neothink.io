# API Documentation

Welcome to the Neothink+ API documentation. This section provides comprehensive information about all the APIs available in the Neothink+ ecosystem.

## Core APIs

- [Platform Bridge](platform-bridge.md) - Core API for platform integration and switching
- [Authentication](authentication.md) - User authentication and session management
- [Database](database.md) - Database access and management
- [Real-time](realtime.md) - Real-time communication and events

## Platform-Specific APIs

### Hub

- [User Management](hub/users.md)
- [Profile Management](hub/profiles.md)
- [Platform Access](hub/access.md)

### Ascenders

- [Learning Paths](ascenders/learning.md)
- [Challenges](ascenders/challenges.md)
- [Progress Tracking](ascenders/progress.md)

### Neothinkers

- [Content Management](neothinkers/content.md)
- [Community Features](neothinkers/community.md)
- [Learning Tools](neothinkers/learning.md)

### Immortals

- [Project Management](immortals/projects.md)
- [Resource Access](immortals/resources.md)
- [Collaboration Tools](immortals/collaboration.md)

## Integration Guides

- [Getting Started](guides/getting-started.md)
- [Authentication](guides/authentication.md)
- [Error Handling](guides/error-handling.md)
- [Rate Limiting](guides/rate-limiting.md)
- [Best Practices](guides/best-practices.md)

## API Reference

### REST APIs

```typescript
interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  authentication: boolean;
  parameters?: Parameter[];
  responses: Response[];
}
```

### WebSocket APIs

```typescript
interface WebSocketEvent {
  event: string;
  data: any;
  channel?: string;
  timestamp: number;
}
```

### GraphQL Schema

```graphql
type Query {
  user(id: ID!): User
  platform(slug: String!): Platform
  content(id: ID!): Content
}

type Mutation {
  updateUser(input: UserInput!): User
  switchPlatform(input: PlatformInput!): PlatformState
}
```

## Security

- [Authentication](../security/authentication.md)
- [Authorization](../security/authorization.md)
- [Rate Limiting](../security/rate-limiting.md)
- [Data Protection](../security/data-protection.md)

## Tools and SDKs

- [JavaScript/TypeScript SDK](sdks/typescript.md)
- [Python SDK](sdks/python.md)
- [API Client](tools/api-client.md)
- [CLI Tools](tools/cli.md)

## Support

- [FAQ](support/faq.md)
- [Known Issues](support/known-issues.md)
- [Troubleshooting](support/troubleshooting.md)
- [Contact Support](support/contact.md)

## Contributing

- [API Design Guidelines](contributing/api-design.md)
- [Documentation Style Guide](contributing/documentation-style.md)
- [Testing Requirements](contributing/testing.md)
- [Review Process](contributing/review-process.md)

### Gamification & Tokenomics
- [Gamification & Tokenomics API](./gamification.md)
- [Full API Reference (OpenAPI)](./api-documentation.md)