# Contributing to Neothink DAO

Thank you for your interest in contributing to the Neothink DAO ecosystem! This document provides a brief overview of how to contribute. For detailed information, please refer to our [comprehensive contribution guide](docs/contributing/README.md).

## Quick Start

1. **Prerequisites**
   - Node.js 22.x or later
   - pnpm 9.x or later
   - Git
   - Valid Neothink DAO team credentials
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

## 📄 License
This project is proprietary software owned by Neothink DAO and the Mark Hamilton Family. All rights reserved. See the [LICENSE](LICENSE) file for details.

## Security & Authorization Onboarding

### Running the RLS Audit and Documentation Generator
- To generate and audit RLS policy documentation, run:
  ```sh
  pnpm run rls:docs
  ```
- This will update `docs/security/rls-policies.md` and output a list of tables missing RLS to `docs/security/rls-missing.md`.
- Review `rls-missing.md` after any schema or migration changes.

### Updating or Adding RLS/RBAC Policies
- Make changes to RLS or RBAC policies via Supabase migrations or dashboard.
- After any policy change, always run the RLS doc generator and review the output.
- Document new or updated policies in the appropriate markdown files.

### Checklist After DB/Policy Changes
- [ ] Run `pnpm run rls:docs` and review both `rls-policies.md` and `rls-missing.md`.
- [ ] Update documentation for any new/changed policies.
- [ ] Ensure no sensitive tables are missing RLS.
- [ ] Commit and push documentation updates.

### Requesting a Security Review
- Open a GitHub issue with the `security` label or contact a project admin.
- Include details of the change and any new policies or sensitive data flows.

### Key Security Documentation
- [RLS Policies](docs/security/rls-policies.md)
- [Authorization Model](docs/security/authorization.md)
- [RBAC Implementation](docs/security/RBAC-IMPLEMENTATION.md)
- [Data Protection](docs/security/data-protection.md)
- [Network Security](docs/security/network-security.md) 