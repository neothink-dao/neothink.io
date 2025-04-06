# Neothink Sites Documentation

This documentation is organized to provide clear context and guidance for working with the Neothink Sites monorepo.

## Quick Links

- [Project Context](context/README.md)
- [Context Rules](context/RULES.md)
- [Architecture Overview](architecture/README.md)
- [Authentication Flow](authentication/README.md)
- [Database Schema](database/README.md)
- [Components](components/README.md)
- [Email Templates](email/README.md)
- [Deployment](deployment/README.md)
- [Troubleshooting](troubleshooting/README.md)
- [Contributing](contributing/README.md)

## Documentation Structure

```
docs/
├── context/               # Core project context
│   ├── README.md          # Project overview and concepts
│   └── RULES.md           # Context maintenance rules
│
├── architecture/           # System architecture and design
│   ├── README.md          # Overview of system architecture
│   ├── diagrams/          # Architecture diagrams
│   └── decisions/         # Architecture decision records
│
├── authentication/        # Authentication and authorization
│   ├── README.md          # Authentication overview
│   ├── flows/             # Authentication flow diagrams
│   └── policies/          # Authorization policies
│
├── database/              # Database documentation
│   ├── README.md          # Database overview
│   ├── schema/            # Schema documentation
│   └── migrations/        # Migration guides
│
├── components/            # Shared components
│   ├── README.md          # Components overview
│   ├── ui/                # UI components
│   └── hooks/             # Custom hooks
│
├── email/                 # Email templates
│   ├── README.md          # Email overview
│   └── templates/         # Template documentation
│
├── deployment/            # Deployment documentation
│   ├── README.md          # Deployment overview
│   ├── vercel/            # Vercel deployment
│   └── supabase/          # Supabase deployment
│
├── troubleshooting/       # Troubleshooting guides
│   ├── README.md          # Troubleshooting overview
│   ├── common-issues/     # Common issues and solutions
│   └── debugging/         # Debugging guides
│
└── contributing/          # Contribution guidelines
    ├── README.md          # Contribution overview
    ├── guidelines/        # Development guidelines
    └── standards/         # Coding standards
```

## How to Use This Documentation

1. **For All Development**
   - Start with [Project Context](context/README.md)
   - Review [Context Rules](context/RULES.md)
   - Follow documentation standards

2. **For New Features**
   - Start with [Architecture Overview](architecture/README.md)
   - Check [Database Schema](database/README.md) for data requirements
   - Review [Components](components/README.md) for reusable code
   - Follow [Contributing Guidelines](contributing/README.md)

3. **For Bug Fixes**
   - Check [Troubleshooting](troubleshooting/README.md)
   - Review relevant component documentation
   - Follow debugging guides

4. **For Deployment**
   - Follow [Deployment Guide](deployment/README.md)
   - Check environment requirements
   - Verify database migrations

5. **For Authentication Changes**
   - Review [Authentication Flow](authentication/README.md)
   - Check [Database Schema](database/README.md)
   - Verify [Email Templates](email/README.md)

## Keeping Documentation Updated

1. **When Adding New Features**
   - Update architecture documentation
   - Add component documentation
   - Update database schema if needed
   - Add any new email templates

2. **When Fixing Bugs**
   - Add to troubleshooting guides
   - Update component documentation if needed
   - Document any workarounds

3. **When Deploying Changes**
   - Update deployment documentation
   - Document any new environment variables
   - Update database migration guides

## Getting Help

1. **For Development Issues**
   - Check troubleshooting guides
   - Review component documentation
   - Check architecture documentation

2. **For Deployment Issues**
   - Check deployment documentation
   - Review environment setup
   - Check database migration guides

3. **For Authentication Issues**
   - Review authentication flow
   - Check database schema
   - Review email templates 