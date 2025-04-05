# Neothink Sites Monorepo

## Overview

This monorepo contains the source code for all Neothink platforms:
- Hub Platform (go.neothink.io)
- Ascenders Platform (joinascenders)
- Neothinkers Platform (joinneothinkers)
- Immortals Platform (joinimmortals)

## Documentation

### Quick Links
- [Architecture Overview](docs/architecture/README.md)
- [Authentication Flow](docs/authentication/README.md)
- [Database Schema](docs/database/README.md)
- [Shared Components](docs/components/README.md)
- [Email Templates](docs/email/README.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/troubleshooting/README.md)
- [Contributing Guide](docs/contributing/README.md)

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 10.2.4
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/neothink/sites.git
cd sites

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
sites/
├── docs/                    # Documentation
│   ├── architecture/       # Architecture docs
│   ├── authentication/     # Auth docs
│   ├── database/          # Database docs
│   ├── components/        # Component docs
│   ├── email/            # Email template docs
│   ├── troubleshooting/  # Troubleshooting docs
│   └── contributing/    # Contributing docs
├── go.neothink.io/      # Hub Platform
├── joinascenders/       # Ascenders Platform
├── joinneothinkers/    # Neothinkers Platform
└── joinimmortals/     # Immortals Platform
```

## Shared Resources

### Authentication
- Supabase Auth integration
- JWT-based sessions
- Platform-specific policies

### Backend
- Supabase database
- Edge Functions
- Storage

### Components
- UI components
- Layout components
- Form components
- Auth components
- Data components

### Email Templates
- Auth emails
- Notification emails
- Marketing emails
- System emails

## Deployment

Each platform is deployed independently through Vercel:

1. **Hub Platform**
   - Production: go.neothink.io
   - Staging: staging.go.neothink.io

2. **Ascenders Platform**
   - Production: joinascenders.com
   - Staging: staging.joinascenders.com

3. **Neothinkers Platform**
   - Production: joinneothinkers.com
   - Staging: staging.joinneothinkers.com

4. **Immortals Platform**
   - Production: joinimmortals.com
   - Staging: staging.joinimmortals.com

## Best Practices

1. **Code Quality**
   - Follow TypeScript best practices
   - Write clean, maintainable code
   - Use appropriate design patterns
   - Keep functions small and focused

2. **Security**
   - Validate all inputs
   - Sanitize outputs
   - Use secure dependencies
   - Follow security guidelines

3. **Performance**
   - Optimize database queries
   - Minimize network requests
   - Use caching appropriately
   - Monitor performance metrics

4. **Accessibility**
   - Follow WCAG guidelines
   - Test with screen readers
   - Ensure keyboard navigation
   - Use semantic HTML

5. **Maintenance**
   - Regular dependency updates
   - Code cleanup
   - Documentation updates
   - Performance monitoring

## Contributing

Please read our [Contributing Guide](docs/contributing/README.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 