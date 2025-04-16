# Development Environment Setup

## Overview

This guide provides comprehensive instructions for setting up and maintaining your development environment for the Neothink+ platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Tools](#development-tools)
4. [Environment Configuration](#environment-configuration)
5. [Best Practices](#best-practices)

## Prerequisites

### System Requirements

- Operating System: macOS 12.0+, Windows 10+, or Linux
- Node.js: v18.0.0 or later
- npm: v9.0.0 or later
- Git: v2.30.0 or later

### Required Software

1. **Code Editor**
   - VS Code (recommended)
   - Extensions:
     - ESLint
     - Prettier
     - TypeScript
     - Tailwind CSS IntelliSense

2. **Development Tools**
   - Docker Desktop
   - Postman or Insomnia
   - Git GUI client (optional)

## Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/neothink.git
   cd neothink
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Configure required environment variables

## Development Tools

### VS Code Configuration

1. **Recommended Settings**
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "typescript.tsdk": "node_modules/typescript/lib"
   }
   ```

2. **Workspace Extensions**
   - Install recommended extensions from `.vscode/extensions.json`

### Docker Setup

1. **Development Containers**
   ```bash
   docker-compose up -d
   ```

2. **Database Setup**
   ```bash
   npm run db:setup
   ```

## Environment Configuration

### Local Development

1. **API Configuration**
   - Base URL: `http://localhost:3000`
   - API Version: v1

2. **Database Configuration**
   - Host: localhost
   - Port: 5432
   - Database: neothink_dev

### Testing Environment

1. **Test Database**
   ```bash
   npm run test:db:setup
   ```

2. **Test Configuration**
   - Environment: test
   - Log Level: debug

## Best Practices

1. **Code Quality**
   - Follow ESLint rules
   - Use Prettier for formatting
   - Write unit tests

2. **Git Workflow**
   - Use feature branches
   - Write meaningful commit messages
   - Create pull requests for review

3. **Development Process**
   - Regular dependency updates
   - Documentation updates
   - Code reviews

## Troubleshooting

Common issues and solutions:

1. **Dependency Issues**
   ```bash
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

2. **Database Connection**
   - Check Docker status
   - Verify environment variables
   - Check port availability

3. **Build Errors**
   - Clear build cache
   - Check TypeScript errors
   - Verify Node.js version

## Maintenance

Regular maintenance tasks:

1. **Weekly**
   - Update dependencies
   - Clean up old branches
   - Review logs

2. **Monthly**
   - Update development tools
   - Review environment configuration
   - Update documentation

## Support

For additional support:

1. **Documentation**
   - Check the [main documentation](README.md)
   - Review [API documentation](api/README.md)

2. **Community**
   - Join the [Discord server](https://discord.gg/neothink)
   - Check [GitHub Discussions](https://github.com/your-org/neothink/discussions) 