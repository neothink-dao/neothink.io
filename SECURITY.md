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

## ✨ Security & RLS: User & Admin Guide (2025)

**For Users:**
- Your data is protected by granular Row Level Security (RLS) and role-based access controls, enforced on every gamification and tokenomics table (XP, tokens, badges, referrals, events, teams, multipliers, governance, and more).
- All actions (including point earning/spending, governance, onboarding) are logged for integrity and auditability. See [Gamification Events Table](./docs/database/tables/gamification_events.md) for details.
- You have the right to access your data, request corrections, and report issues. See [Support & Feedback](./docs/support/README.md).
- For privacy and security, only you and authorized admins can access your sensitive data via RLS policies. No data is shared without your explicit action.

**For Admins:**
- Enforce and review RLS for all core and app-specific tables, including positive-sum enforcement and append-only event logs for rewards, tokens, and governance.
- Audit logs for sensitive actions (reward issuance, governance votes, migrations) are available in [gamification_events](./docs/database/tables/gamification_events.md), [xp_events], [token_events], and [badge_events] tables.
- Use tamper-evident logging and incident response protocols for all critical flows. See [Incident Response](./docs/admin/ADMIN-OVERVIEW.md#incident-response).
- Security checklists for onboarding new features and flows are maintained. See [Contributor Security & RLS Checklist](#contributor-security--rls-checklist).
- Periodically review [database migrations](./docs/database/MIGRATIONS.md) to ensure all new tables have RLS enabled and policies documented.

## 🚀 What’s New in 2025?
- Granular RLS for every new table and action (gamification, governance, onboarding), with cross-linked documentation for each policy.
- Tamper-evident audit logs for all sensitive actions, including reward issuance, badge grants, and governance votes.
- Expanded incident response and failed transaction documentation, with step-by-step admin guides.
- Security checklists for admins and developers, now covering edge functions and analytics event tables.

## 📚 Quick Links
- [Gamification & Tokenomics API](./docs/api/gamification.md)
- [Admin Overview](./docs/admin/ADMIN-OVERVIEW.md)
- [Database & Schema](./docs/architecture/database.md)
- [Migrations](./docs/database/MIGRATIONS.md)
- [Gamification Events Table](./docs/database/tables/gamification_events.md)
- [Support & Feedback](./docs/support/README.md)

## 🗺️ Security Journeys
- **Users:**
  1. Data is protected and auditable via RLS and event logs
  2. Report issues and understand rights (see [Support](./docs/support/README.md))
- **Admins:**
  1. Review/enforce RLS and positive-sum logic for all tables
  2. Audit logs and incident response (see [Admin Overview](./docs/admin/ADMIN-OVERVIEW.md))
  3. Use security checklists for new features (see [Contributor Security & RLS Checklist](#contributor-security--rls-checklist))

## 🔄 Continuous Improvement
- Security docs, RLS, and audit flows are reviewed and improved regularly based on analytics, feedback, and new migrations. All changes are tracked in the [Changelog](./CHANGELOG.md).

## Contributor Security & RLS Checklist
To maintain the highest security standards, all contributors must:

1. **Enable Row Level Security (RLS) on all new Supabase tables**
   - Add granular RLS policies for `select`, `insert`, `update`, and `delete` as appropriate, referencing the [RLS Policy Documentation](./docs/security/authorization.md).
   - Document the purpose and roles covered by each policy in migration files and table docs.
   - Reference: [`supabase/schema/RLS_AND_FUNCTIONS.md`](../supabase/schema/RLS_AND_FUNCTIONS.md)
2. **Apply all schema changes using migrations**
   - Never edit applied migrations; always create a new migration for changes.
   - Follow the timestamped migration convention and add header comments for every migration.
   - Reference: [`supabase/migrations/`](../supabase/migrations/)
3. **Sync and regenerate TypeScript types after schema changes**
   - Run `pnpm generate:supabase-types` and commit the result.
   - Ensure CI passes type/schema sync checks and that all packages are using the latest type exports.
4. **Update documentation for all security or schema changes**
   - Update ER diagrams, RLS docs, and onboarding guides as needed.
   - Cross-link all new tables and policies in the docs.
5. **Request a security review for PRs affecting sensitive data or permissions**
   - Tag `@security` or relevant reviewers in your pull request.

For more details, see [ONBOARDING.md](./ONBOARDING.md) and [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md).

## Hall of Fame
We are grateful to all security researchers and users who help keep our platform safe. If you wish to be recognized, let us know in your report!

---

*This policy applies to all code and deployments in this monorepo, including all Vercel projects and the shared Supabase backend.* 