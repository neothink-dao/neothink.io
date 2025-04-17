# Security Policy

Thank you for helping keep the Neothink DAO platform and its users safe!

## Supported Versions
We support the latest production deployments of all four Vercel projects (Hub, Immortals, Ascenders, Neothinkers) and all shared packages in this monorepo.

## Reporting a Vulnerability
If you discover a security vulnerability, please report it responsibly:

- **Email:** security@neothink.io
- **GitHub Security Advisories:** [Create a private advisory](https://github.com/neothink-dao/neothink.io/security/advisories)
- **Do not disclose vulnerabilities publicly** until we have addressed them and coordinated a release/patch.

We aim to respond to all security reports within 2 business days and resolve critical issues as quickly as possible.

## Our Security Principles
- **User and admin trust is paramount.**
- **All apps use centralized, robust middleware for authentication, rate limiting, and security headers.**
- **No secrets or credentials are ever hardcoded.**
- **We use automated dependency and secret scanning.**
- **We welcome responsible disclosure and will credit researchers if desired.**

## Contributor Security & RLS Checklist
To maintain the highest security standards, all contributors must:

1. **Enable Row Level Security (RLS) on all new Supabase tables**
   - Add granular RLS policies for `select`, `insert`, `update`, and `delete` as appropriate.
   - Document the purpose and roles covered by each policy.
   - Reference: [`supabase/schema/RLS_AND_FUNCTIONS.md`](../supabase/schema/RLS_AND_FUNCTIONS.md)
2. **Apply all schema changes using migrations**
   - Never edit applied migrations; always create a new migration for changes.
   - Follow the timestamped migration convention.
   - Reference: [`supabase/migrations/`](../supabase/migrations/)
3. **Sync and regenerate TypeScript types after schema changes**
   - Run `pnpm generate:supabase-types` and commit the result.
   - Ensure CI passes type/schema sync checks.
4. **Update documentation for all security or schema changes**
   - Update ER diagrams, RLS docs, and onboarding guides as needed.
5. **Request a security review for PRs affecting sensitive data or permissions**
   - Tag `@security` or relevant reviewers in your pull request.

For more details, see [ONBOARDING.md](./ONBOARDING.md) and [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md).

## Hall of Fame
We are grateful to all security researchers and users who help keep our platform safe. If you wish to be recognized, let us know in your report!

---

*This policy applies to all code and deployments in this monorepo, including all Vercel projects and the shared Supabase backend.* 