# Development Guidelines

## Monorepo Development

### Project Structure

Each platform in the monorepo follows this structure:
```
platform-directory/
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── lib/           # Platform-specific libraries
│   └── types/         # TypeScript types
├── public/            # Static assets
├── package.json       # Platform-specific dependencies
└── vercel.json        # Deployment configuration
```

### Dependencies

1. **Root Dependencies**
   - Only add dependencies needed by multiple platforms
   - Use `pnpm add -w package-name` for root installation

2. **Platform Dependencies**
   - Install using `pnpm --filter @neothink/platform-name add package-name`
   - Keep platform-specific dependencies in platform's package.json

### Development Workflow

1. **Starting Development**
   ```bash
   # Install all dependencies
   pnpm install

   # Start specific platform
   pnpm --filter @neothink/platform-name dev
   ```

2. **Running Multiple Platforms**
   ```bash
   # Start multiple platforms
   pnpm turbo run dev --filter=@neothink/platform-1... --filter=@neothink/platform-2...
   ```

### Code Standards

1. **TypeScript**
   - Use strict mode
   - Define types for all props and state
   - Avoid `any` type

2. **Components**
   - Use functional components
   - Implement proper error boundaries
   - Follow atomic design principles

3. **State Management**
   - Use React Query for server state
   - Use Zustand for client state
   - Keep state close to where it's used

### Git Workflow

1. **Branches**
   - `main`: Production code
   - `feature/*`: New features
   - `fix/*`: Bug fixes
   - `docs/*`: Documentation updates

2. **Commits**
   - Use conventional commit messages
   - Reference issues in commits
   - Keep commits focused and atomic

3. **Pull Requests**
   - Create PR against main branch
   - Get required reviews
   - Ensure CI passes

### Testing

1. **Unit Tests**
   - Test components in isolation
   - Use React Testing Library
   - Maintain high coverage

2. **Integration Tests**
   - Test feature workflows
   - Verify cross-platform functionality
   - Test with real API calls

3. **E2E Tests**
   - Use Cypress for critical paths
   - Test cross-platform journeys
   - Verify production builds

### Performance

1. **Build Optimization**
   - Use Turborepo's cache
   - Optimize image assets
   - Implement code splitting

2. **Runtime Performance**
   - Implement proper memoization
   - Use performance monitoring
   - Optimize re-renders

### Debugging

1. **Development Tools**
   - Use React DevTools
   - Enable Source Maps
   - Use proper logging

2. **Common Issues**
   - Check Turborepo cache
   - Verify dependency versions
   - Monitor build output

### Documentation

1. **Code Documentation**
   - Document complex functions
   - Add component prop types
   - Include usage examples

2. **API Documentation**
   - Document all endpoints
   - Include request/response examples
   - Note authentication requirements

### Security

1. **Code Security**
   - No sensitive data in code
   - Implement proper validation
   - Use security headers

2. **API Security**
   - Validate all inputs
   - Use proper CORS settings
   - Implement rate limiting

### Deployment

1. **Pre-deployment Checks**
   - Run all tests
   - Check bundle size
   - Verify environment variables

2. **Monitoring**
   - Check Vercel analytics
   - Monitor error rates
   - Track performance metrics

## Platform-Specific Guidelines

### Neothink+ Hub
- Central authentication logic
- Cross-platform navigation
- User management features

### Ascenders
- Business-focused features
- Integration with Hub
- Performance tracking

### Neothinkers
- Learning management
- Progress tracking
- Community features

### Immortals
- Health tracking
- Legacy planning
- Secure data handling

## Support and Resources

1. **Documentation**
   - [Monorepo Guide](MONOREPO.md)
   - [Supabase Setup](SUPABASE.md)
   - Platform READMEs

2. **Tools**
   - Turborepo Dashboard
   - Vercel Analytics
   - Supabase Dashboard

3. **Help**
   - Team chat channels
   - Documentation updates
   - Regular team meetings 