# Monitoring & Alerting Checklist

This checklist ensures your platform is ready to monitor, alert, and respond as you onboard your first 100 users and beyond.

## Analytics
- [ ] PostHog (or similar) is integrated and tracking:
  - [ ] Signups
  - [ ] Logins
  - [ ] Key user actions (onboarding, profile updates, etc.)
  - [ ] Drop-offs and funnel analytics
- [ ] Analytics dashboards are reviewed regularly

## Error Monitoring
- [ ] Sentry (or similar) is integrated in all apps
- [ ] All unhandled errors are reported to Sentry
- [ ] Alerts are configured for new errors and spikes
- [ ] Error logs are reviewed after every release

## Uptime & Performance
- [ ] Uptime monitoring is set up (e.g., Vercel, UptimeRobot, StatusCake)
- [ ] Alerts are configured for downtime or slow response times
- [ ] Performance metrics (API latency, page load) are tracked

## Scaling & Reliability
- [ ] Database and API can handle 100+ concurrent users (test if possible)
- [ ] Rate limiting and abuse prevention are in place
- [ ] Backups are scheduled and tested
- [ ] Incident response plan is documented

## Actionable Items
- [ ] Review monitoring dashboards daily during initial user onboarding
- [ ] Set up escalation for critical alerts (email, Slack, etc.)
- [ ] Document and review all incidents and responses

---

*Update this checklist as you scale and add new monitoring tools or processes.* 