# Security Audit Checklist

Use this checklist before every major release:

- [ ] All dependencies pass `pnpm audit` with no critical vulnerabilities
- [ ] All environment variables are securely managed (never committed)
- [ ] Supabase RLS policies reviewed and tested
- [ ] Admin endpoints require authentication and proper roles
- [ ] No secrets or sensitive data in client bundles
- [ ] Third-party scripts reviewed for security
- [ ] All user input validated and sanitized
- [ ] Security contact listed in README and CONTRIBUTING
- [ ] Penetration test or external review (recommended before launch)
