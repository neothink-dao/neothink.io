# Real User QA Checklist

This checklist is for validating all real user flows before launch. Check off each item as you verify it in production-like conditions.

## Core Flows
- [ ] User can sign up with a valid email and strong password
- [ ] User receives and can use email verification (if enabled)
- [ ] User can sign in with valid credentials
- [ ] User cannot sign in with invalid credentials (clear error shown)
- [ ] User can reset password via email
- [ ] User can complete onboarding (if present)
- [ ] User can update profile information (name, email, avatar, etc.)
- [ ] User can log out and is redirected appropriately

## Validation & Error Handling
- [ ] All forms validate required fields and show clear errors
- [ ] Weak passwords are rejected with a clear message
- [ ] Duplicate emails/usernames are rejected with a clear message
- [ ] Network/server errors show a user-friendly message
- [ ] All error messages are accessible and visible

## Security & Privacy
- [ ] User cannot access another user's data (test with multiple accounts)
- [ ] Sensitive data (email, tokens, PII) is never exposed in the UI or API
- [ ] RLS and RBAC are enforced for all user data tables

## Accessibility & Responsiveness
- [ ] All flows work on desktop and mobile
- [ ] All forms and navigation are accessible via keyboard
- [ ] Screen readers can access all form fields and error messages
- [ ] UI is responsive and visually consistent

## Monitoring & Support
- [ ] Analytics (e.g., PostHog) track signups, logins, and errors
- [ ] Error monitoring (e.g., Sentry) is active and tested
- [ ] In-app support/contact is available or clearly linked

## Legal & Compliance
- [ ] Privacy policy and terms of service are accessible from the app

---

*Review and update this checklist before every major release or user onboarding campaign.* 