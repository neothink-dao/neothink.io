# Contributing to Neothink Ecosystem

Thank you for considering contributing to the Neothink platform ecosystem! This document provides guidelines and instructions for contributing to our codebase.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive in your communication
- Value diverse perspectives and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community and users
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before you begin contributing, ensure you have:

1. A GitHub account
2. Node.js 18.17.0 or higher installed
3. npm 9.6.0 or higher installed
4. Git set up on your local machine

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/neothink.io.git
   cd neothink.io
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/neothink-dao/neothink.io.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

We follow a structured branching strategy:

- `main`: Production-ready code
- `develop`: Integration branch for feature development
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches
- `docs/*`: Documentation updates

### Making Changes

1. Sync your fork with the upstream repository:
   ```bash
   git checkout develop
   git pull upstream develop
   git push origin develop
   ```

2. Create a new branch for your changes:
   ```bash
   # For a new feature
   git checkout -b feature/your-feature-name
   
   # For a bug fix
   git checkout -b fix/issue-description
   
   # For documentation
   git checkout -b docs/update-description
   ```

3. Make your changes following our coding standards

4. Commit your changes using conventional commit messages:
   ```bash
   git commit -m "feat: add new authentication flow"
   git commit -m "fix: resolve issue with profile data loading"
   git commit -m "docs: update API documentation"
   ```

5. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```

6. Create a pull request from your branch to our `develop` branch

### Pull Request Process

1. Fill in the provided pull request template
2. Ensure your code passes all automated tests
3. Request a review from at least one maintainer
4. Address any feedback from reviewers
5. Once approved, a maintainer will merge your changes

## Coding Standards

### JavaScript/TypeScript

- Follow modern ES6+ syntax
- Use TypeScript with strict mode enabled
- Include proper type definitions
- Use async/await for asynchronous code
- Document complex functions with JSDoc comments

### React/Next.js

- Use functional components with hooks
- Adopt React Server Components where appropriate
- Keep components focused on a single responsibility
- Use proper error boundaries
- Follow Next.js best practices for routing and data fetching

### CSS/Styling

- Use Tailwind CSS for styling
- Follow our design system guidelines
- Ensure responsive design for all components
- Maintain accessibility standards
- Use CSS variables for theming

### Testing

- Write unit tests for utility functions
- Create component tests for UI elements
- Include integration tests for critical flows
- Ensure accessibility testing is performed

## Documentation

When contributing, please update the documentation accordingly:

- Add JSDoc comments to functions and components
- Update README files if changing functionality
- Document API changes in the API documentation
- Create or update guides for significant features

## Submitting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in our GitHub issues
2. If not, create a new issue using the appropriate template
3. Provide as much detail as possible:
   - For bugs: steps to reproduce, expected behavior, actual behavior
   - For features: clear description, use cases, proposed implementation

## Community

Join our community:

- [Discord](https://discord.gg/neothink)
- [Twitter](https://twitter.com/neothink)
- [Community Forum](https://forum.neothink.io)

## License

By contributing to this project, you agree that your contributions will be licensed under the project's proprietary license.

Thank you for contributing to the Neothink ecosystem! 