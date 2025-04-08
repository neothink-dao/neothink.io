# AI Tools Integration Guide

This document explains how to leverage AI tools like Cursor and Grok with our codebase, and how to maintain AI-friendly documentation.

## Table of Contents

- [Overview](#overview)
- [AI-Friendly Documentation](#ai-friendly-documentation)
- [Using the AI Validator](#using-the-ai-validator)
- [Working with Cursor](#working-with-cursor)
- [Working with Grok](#working-with-grok)
- [Best Practices](#best-practices)

## Overview

Our codebase is designed to be AI-friendly, with structured documentation and code annotations that help AI tools understand the relationships, architecture, and implementation details. This helps with:

- Faster onboarding of new developers
- More accurate code suggestions and completions
- Better understanding of complex systems
- More effective assistance with debugging and implementation

## AI-Friendly Documentation

We maintain AI-friendly documentation through:

1. **Structured code comments** - Using specific tags and formats
2. **Central context file** - The `.ai-context.json` file at the root of the project
3. **Relationship documentation** - Explicitly documenting connections between components
4. **Contextual information** - Including business logic explanations, not just technical details

See the [AI Annotation Guide](./ai-annotation-guide.md) for detailed documentation standards.

## Using the AI Validator

We've created a validator tool to ensure our AI documentation stays consistent and complete. Use it with:

```bash
# Run the validator to check all AI annotations
npm run ai:validate

# Just update the timestamp in .ai-context.json
npm run ai:update-context
```

The validator will:

1. Scan all code files for AI annotations
2. Validate that annotations include required tags
3. Report issues and compliance statistics
4. Update the timestamp in `.ai-context.json`

## Working with Cursor

Cursor is an AI-powered code editor that excels at:

- Understanding code and providing intelligent completions
- Answering questions about the codebase
- Generating new code based on natural language descriptions
- Explaining complex code

### Effective Prompts for Cursor

For best results with Cursor, use these types of prompts:

```
Can you explain how the [ComponentName] component works and its relationship to [OtherComponent]?

How does the authentication system integrate with the RBAC implementation?

Show me how data flows from [Component] to [Database]

What's the best way to implement [feature] following our existing patterns?
```

## Working with Grok

Grok is particularly powerful when using its DeepSearch functionality to analyze entire codebases.

### Using DeepSearch with Grok

For the best experience with Grok's DeepSearch:

1. Share the repository URL: `https://github.com/your-org/neothink-platforms`
2. Use the "DeepSearch" keyword to trigger the deep analysis mode
3. Ask specific questions about architecture or relationships

Example DeepSearch prompt:

```
DeepSearch: https://github.com/your-org/neothink-platforms

I need to understand:
1. How the role-based access control system is implemented across platforms
2. The data flow between the UserProfile component and profiles table
3. What components are used in the Authentication system
```

## Best Practices

To ensure you get the best assistance from AI tools:

1. **Keep annotations up to date** - Run the validator regularly
2. **Be explicit about relationships** - Don't assume AI tools can infer connections
3. **Include business context** - Explain why, not just what
4. **Use consistent naming patterns** - Follow our naming conventions
5. **Update `.ai-context.json`** - When adding new features or modules
6. **Follow the annotation guide** - Use the documented formats
7. **Be specific in your prompts** - Provide context and clear questions

By maintaining high-quality AI documentation, we make our codebase more comprehensible to both human developers and AI assistants, leading to higher productivity and better code quality. 