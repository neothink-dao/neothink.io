# Documentation Standards

This guide defines the standards for writing documentation that is both human-readable and AI-friendly.

## 📝 File Structure

### Metadata Block
Every documentation file must start with a metadata block following this schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["type", "category", "last_updated"],
  "properties": {
    "type": {
      "type": "string",
      "enum": ["guide", "reference", "tutorial", "api", "security"],
      "description": "Type of documentation"
    },
    "category": {
      "type": "string",
      "enum": ["architecture", "development", "database", "deployment", "security", "monitoring"],
      "description": "Documentation category"
    },
    "related": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-zA-Z0-9-]+\\.md$"
      },
      "description": "Related documentation files"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Searchable tags"
    },
    "last_updated": {
      "type": "string",
      "format": "date",
      "description": "Last update date (YYYY-MM-DD)"
    },
    "ai_context": {
      "type": "object",
      "properties": {
        "purpose": {
          "type": "string",
          "description": "Primary purpose of the document"
        },
        "target_audience": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["developers", "devops", "security", "ai"]
          }
        },
        "complexity": {
          "type": "string",
          "enum": ["beginner", "intermediate", "advanced"],
          "description": "Document complexity level"
        }
      }
    }
  }
}
```

Example metadata block:
```markdown
<!--
@metadata
{
  "type": "guide",
  "category": "database",
  "related": ["MIGRATIONS.md", "SCHEMA.md"],
  "tags": ["supabase", "migrations", "versioning"],
  "last_updated": "2024-03-20",
  "ai_context": {
    "purpose": "Guide for managing database migrations across applications",
    "target_audience": ["developers", "devops"],
    "complexity": "intermediate"
  }
}
-->
```

### Sections
Use consistent section headers with emojis:
- 🏗️ Architecture
- 🔧 Development
- 📦 Database
- 🚀 Deployment
- 🔒 Security
- 📈 Monitoring

## 📋 Content Guidelines

### Code Blocks
Wrap code blocks with type-specific markers:

```markdown
<!-- @codeblock-start: block-name -->
```language
// code here
```
<!-- @codeblock-end: block-name -->
```

Supported types:
- `@codeblock-start`: General code
- `@sql-start`: SQL queries
- `@command-start`: Terminal commands
- `@json-start`: JSON data
- `@typescript-start`: TypeScript code

### Lists
Wrap lists with list markers:

```markdown
<!-- @list-start: list-name -->
1. Item one
2. Item two
<!-- @list-end: list-name -->
```

### Links
Wrap external links with link markers:

```markdown
<!-- @links-start: section-name -->
- [Link Text](url)
<!-- @links-end: section-name -->
```

## 🔍 AI-Specific Guidelines

### Context Preservation
- Use clear, unambiguous language
- Avoid pronouns without clear antecedents
- Provide explicit context for code examples
- Include error scenarios and edge cases

### Code Examples
- Include complete, runnable examples
- Show input and expected output
- Document error conditions
- Provide alternative approaches

### Semantic Structure
- Use consistent heading hierarchy
- Maintain clear document flow
- Include cross-references
- Document dependencies

### AI Processing Hints
```markdown
<!-- @ai-hint: This section contains critical security information -->
<!-- @ai-note: This example requires specific environment setup -->
<!-- @ai-warning: This operation cannot be undone -->
```

## 📚 Best Practices

### Writing Style
- Use active voice
- Be concise but complete
- Include practical examples
- Use consistent terminology

### Technical Accuracy
- Keep code examples up-to-date
- Verify all commands work
- Document edge cases
- Include error handling

### Maintenance
- Update metadata when changing content
- Review documentation quarterly
- Remove deprecated content
- Add new features promptly

## 🔧 Tools

### AI Documentation Tools
```bash
# Validate metadata against schema
pnpm docs:validate-metadata

# Check AI readability
pnpm docs:check-ai-readability

# Generate AI-friendly documentation
pnpm docs:generate-ai

# Update AI context
pnpm docs:update-ai-context
```

### Documentation Linting
```bash
# Check documentation style
pnpm docs:lint

# Fix documentation issues
pnpm docs:lint --fix

# Check AI-specific guidelines
pnpm docs:lint-ai
```

## 📊 Quality Checklist

- [ ] Metadata block present and valid
- [ ] Clear structure and hierarchy
- [ ] Working examples with context
- [ ] Error handling documented
- [ ] Related links maintained
- [ ] Up-to-date content
- [ ] Consistent style
- [ ] Technical accuracy
- [ ] AI context provided
- [ ] Semantic markers used
- [ ] Cross-references valid 