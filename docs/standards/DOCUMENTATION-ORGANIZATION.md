# Documentation Organization Guide

## 🎯 Overview

This guide defines how we organize documentation for optimal AI and human readability, following 2025 best practices.

## 📁 Directory Structure

```
docs/
├── architecture/          # System architecture and design
│   ├── MONOREPO-GUIDE.md
│   ├── SHARED-SUPABASE.md
│   ├── AUTHENTICATION-FLOW.md
│   ├── DATABASE-ARCHITECTURE.md
│   ├── WHY-MODERN-STACK.md
│   ├── platform-bridge.md
│   ├── ai-integration.md
│   ├── UNIFIED-PLATFORM.md
│   └── cross-platform-navigation.md
├── development/          # Development guides and practices
│   ├── GETTING-STARTED.md
│   ├── AUTHENTICATION-STATUS.md
│   ├── API.md
│   ├── TESTING.md
│   ├── development-environment.md
│   └── TEST_PLAN.md
├── database/            # Database-specific documentation
│   ├── SUPABASE-INTEGRATION.md
│   ├── SCHEMA.md
│   ├── MIGRATIONS.md
│   └── QUERY-PATTERNS.md
├── deployment/          # Deployment and operations
│   ├── VERCEL-DEPLOYMENT.md
│   ├── ENVIRONMENT.md
│   ├── CI-CD.md
│   └── MONITORING.md
├── security/           # Security practices and policies
│   ├── SECURITY.md
│   ├── AUTHENTICATION.md
│   ├── DATA-PROTECTION.md
│   ├── COMPLIANCE.md
│   ├── RBAC-IMPLEMENTATION.md
│   └── security.md
├── analytics/          # Analytics and monitoring
│   ├── ANALYTICS.md
│   ├── EVENTS.md
│   └── REPORTING.md
├── components/         # UI/UX components and design system
│   ├── component-library.md
│   └── sacred-geometry-design-system.md
├── api/               # API documentation
│   └── api-documentation.md
├── guides/            # User guides and tutorials
│   ├── user-guide.md
│   └── user-journeys.md
├── getting-started/   # Onboarding documentation
│   ├── INDEX.md
│   ├── core-concepts.md
│   └── quick-start.md
├── templates/         # Documentation templates
│   └── DOCUMENTATION-TEMPLATE.md
├── standards/         # Documentation standards
│   ├── DOCUMENTATION.md
│   ├── DOCUMENTATION-ORGANIZATION.md
│   └── AI-GUIDELINES.md
├── gamification/      # Gamification features and mechanics
│   ├── REWARDS.md
│   ├── ACHIEVEMENTS.md
│   └── LEADERBOARDS.md
├── reference/         # Technical reference documentation
│   ├── API-REFERENCE.md
│   ├── CONFIGURATION.md
│   └── TROUBLESHOOTING.md
├── platforms/         # Platform-specific documentation
│   ├── WEB.md
│   ├── MOBILE.md
│   └── DESKTOP.md
├── admin/            # Administrative documentation
│   ├── DASHBOARD.md
│   ├── USER-MANAGEMENT.md
│   └── SETTINGS.md
├── contributing/     # Contribution guidelines
│   ├── CONTRIBUTING.md
│   ├── CODE-OF-CONDUCT.md
│   └── PULL-REQUESTS.md
├── authentication/   # Authentication and authorization
│   ├── AUTH-FLOW.md
│   ├── OAuth.md
│   └── SSO.md
├── troubleshooting/  # Troubleshooting guides
│   ├── COMMON-ISSUES.md
│   ├── DEBUGGING.md
│   └── SUPPORT.md
└── email/           # Email-related documentation
    ├── TEMPLATES.md
    ├── DELIVERY.md
    └── TRACKING.md
```

## 📝 File Structure

### Metadata Block
Every documentation file must start with a metadata block:

```markdown
<!--
@metadata
{
  "type": "guide|reference|tutorial",
  "category": "category-name",
  "related": ["related-file1.md", "related-file2.md"],
  "tags": ["tag1", "tag2"],
  "last_updated": "YYYY-MM-DD",
  "ai_context": {
    "purpose": "Document purpose",
    "target_audience": ["developers", "devops", "security", "ai"],
    "complexity": "beginner|intermediate|advanced"
  }
}
-->
```

### Content Structure

1. **Title and Overview**
   - Clear, descriptive title
   - Brief overview of content
   - Key features or concepts

2. **Table of Contents**
   - Auto-generated from headings
   - Links to sections
   - Hierarchical structure

3. **Main Content**
   - Clear section hierarchy
   - Consistent formatting
   - Code examples with context
   - Visual aids where helpful

4. **References**
   - Related documents
   - External resources
   - API documentation
   - Version information

## 🔍 AI-Specific Features

### Semantic Markers
```markdown
<!-- @ai-hint: Critical security information -->
<!-- @ai-note: Environment setup required -->
<!-- @ai-warning: Irreversible operation -->
```

### Code Blocks
```markdown
<!-- @codeblock-start: example-name -->
```typescript
// Code here
```
<!-- @codeblock-end: example-name -->
```

### Lists
```markdown
<!-- @list-start: list-name -->
1. Item one
2. Item two
<!-- @list-end: list-name -->
```

### Links
```markdown
<!-- @links-start: section-name -->
- [Link Text](url)
<!-- @links-end: section-name -->
```

## 📚 Best Practices

### Writing Style
- Use active voice
- Be concise but complete
- Include practical examples
- Use consistent terminology
- Avoid ambiguous pronouns
- Provide clear context

### Technical Accuracy
- Keep code examples up-to-date
- Verify all commands work
- Document edge cases
- Include error handling
- Specify version requirements
- Document dependencies

### AI Optimization
- Use clear, unambiguous language
- Provide complete context
- Include error scenarios
- Document assumptions
- Use consistent formatting
- Include metadata

## 🔧 Tools and Automation

### Documentation Generator
```bash
# Generate documentation
pnpm docs:generate

# Validate documentation
pnpm docs:validate

# Update metadata
pnpm docs:update-metadata

# Check AI readability
pnpm docs:check-ai-readability
```

### Linting
```bash
# Check documentation style
pnpm docs:lint

# Fix documentation issues
pnpm docs:lint --fix

# Check AI-specific guidelines
pnpm docs:lint-ai
```

## 📊 Quality Checklist

### Content
- [ ] Clear purpose and scope
- [ ] Complete and accurate
- [ ] Well-structured
- [ ] Error handling documented
- [ ] Examples provided
- [ ] References included

### AI Readability
- [ ] Metadata present
- [ ] Semantic markers used
- [ ] Context provided
- [ ] Code examples clear
- [ ] Links valid
- [ ] Terminology consistent

### Maintenance
- [ ] Version information
- [ ] Last updated date
- [ ] Related documents
- [ ] Dependencies listed
- [ ] Change log maintained
- [ ] Review schedule

## 📈 Continuous Improvement

### Regular Reviews
- Quarterly content review
- Monthly link checking
- Weekly metadata updates
- Daily AI readability checks
- Continuous feedback collection

### Metrics
- Documentation coverage
- AI comprehension score
- User feedback ratings
- Update frequency
- Error rate
- Usage statistics

## 📚 Resources

- [Documentation Best Practices](https://supabase.com/docs/guides/documentation)
- [AI Documentation Guidelines](https://supabase.com/docs/guides/ai-documentation)
- [Technical Writing Standards](https://supabase.com/docs/guides/technical-writing)
- [Version Control for Docs](https://supabase.com/docs/guides/version-control)

## 📝 File Naming Conventions

### General Rules
- Use uppercase for main documentation files (e.g., `ARCHITECTURE-GUIDE.md`)
- Use lowercase for supporting files (e.g., `overview.md`)
- Use hyphens for multi-word filenames
- Include file type in name when appropriate (e.g., `-GUIDE.md`, `-API.md`)

### Special Cases
- Platform-specific files use uppercase (e.g., `ASCENDERS.md`, `HUB.md`)
- API documentation uses `-API.md` suffix
- Overview files use `-OVERVIEW.md` suffix
- Guide files use `-GUIDE.md` suffix

## 🔍 Content Organization

### Architecture Documentation
- Keep high-level architecture in root of `architecture/` directory
- Place component-specific architecture in subdirectories
- Use consistent section structure across all architecture docs
- Include diagrams using Mermaid syntax
- Reference related components and systems

### Platform Documentation
- Maintain separate files for each platform
- Include platform-specific considerations
- Document integration points
- Cover deployment and maintenance procedures

### API Documentation
- Group by API type (e.g., REST, GraphQL)
- Include authentication requirements
- Document rate limits and quotas
- Provide example requests and responses

## 📚 Cross-References

### Internal Links
- Use relative paths for internal links
- Reference files using their exact names
- Include section anchors when linking to specific content
- Update links when files are moved or renamed

### External Links
- Use absolute URLs for external resources
- Include link titles for clarity
- Group related links in dedicated sections
- Verify links periodically

## 🔧 Maintenance

### Regular Tasks
- Monthly link verification
- Quarterly content review
- Annual structure review
- Continuous metadata updates

### Version Control
- Use semantic versioning for documentation
- Maintain changelog for significant updates
- Track documentation dependencies
- Document breaking changes

## 📈 Quality Metrics

### Content Quality
- Completeness of documentation
- Accuracy of technical content
- Clarity of explanations
- Relevance of examples

### AI Readability
- Metadata completeness
- Context clarity
- Example relevance
- Terminology consistency

### Maintenance
- Update frequency
- Link validity
- Cross-reference accuracy
- Review schedule adherence

## 📊 Continuous Improvement

### Feedback Collection
- Regular user surveys
- Documentation usage analytics
- Error reporting
- Feature requests

### Improvement Process
1. Identify areas for improvement
2. Prioritize based on impact
3. Implement changes
4. Verify effectiveness
5. Document lessons learned

## 📚 Resources

- [Documentation Best Practices](https://supabase.com/docs/guides/documentation)
- [AI Documentation Guidelines](https://supabase.com/docs/guides/ai-documentation)
- [Technical Writing Standards](https://supabase.com/docs/guides/technical-writing)
- [Version Control for Docs](https://supabase.com/docs/guides/version-control) 