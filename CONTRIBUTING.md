# Contributing to Neothink+

Thank you for your interest in contributing to the Neothink+ ecosystem! This document provides a brief overview of how to contribute. For detailed information, please refer to our [comprehensive contribution guide](docs/contributing/README.md).

## Quick Start

1. **Prerequisites**
   - Node.js 18.x or later
   - pnpm 8.x or later
   - Git
   - Valid Neothink+ team credentials
   - Signed NDA on file

2. **Setup**
   ```bash
   git clone https://github.com/neothink-dao/neothink.io.git
   cd neothink.io
   pnpm install
   ```

3. **Development**
   ```bash
   # Start all platforms
   pnpm dev

   # Start specific platform
   pnpm dev:hub
   pnpm dev:ascenders
   pnpm dev:neothinkers
   pnpm dev:immortals
   ```

## Development Guidelines

- Follow our [coding standards](docs/contributing/code-style.md)
- Write tests for new features
- Update documentation as needed
- Follow the [security guidelines](docs/guides/security.md)

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request
5. Update based on review feedback

## Documentation

For more detailed information, please refer to:

- [Contribution Guide](docs/contributing/README.md)
- [Development Guide](docs/guides/development.md)
- [Testing Guide](docs/guides/testing.md)
- [Security Guide](docs/guides/security.md)
- [Architecture Overview](docs/architecture/overview.md)

## Getting Help

- [Join our Discord](https://discord.gg/neothink)
- [Check our FAQ](docs/reference/faq.md)
- [Contact Support](https://neothink.io/support)

## Security

Please report security vulnerabilities to security@neothink.io.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 