# Secrets & Token Rotation Checklist

Regularly reviewing and rotating secrets/tokens is critical for security. Use this checklist to ensure best practices are followed.

## Rotation Schedule
- [ ] Review and rotate all secrets/tokens at least every 3-6 months
- [ ] Rotate immediately if a secret is exposed or a team member leaves

## Rotation Steps
1. **Inventory all secrets/tokens:**
   - GitHub Actions secrets (PATs, DB credentials, API keys)
   - Supabase/DB credentials
   - Third-party service tokens (Vercel, Sentry, PostHog, etc.)
2. **Rotate each secret/token:**
   - Generate a new token/secret in the relevant service
   - Update the value in GitHub Secrets or environment variables
   - Remove or revoke the old token/secret
3. **Test all workflows and deployments:**
   - Ensure all CI/CD, deployments, and integrations work with the new secrets
4. **Document the rotation:**
   - Record the date, rotated secrets, and responsible person in this file or a secure log

## Example Log Entry
```
2024-06-10: Rotated NEOTHINK_DEPLOY_TOKEN and Supabase DB password. All workflows tested. (by @username)
```

## Best Practices
- Use least-privilege for all tokens
- Never commit secrets to the codebase
- Remove unused or stale secrets promptly
- Use environment variables for local development secrets

---

*Review and update this checklist after every rotation or security incident.* 