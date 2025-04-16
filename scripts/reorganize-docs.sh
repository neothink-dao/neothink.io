#!/bin/bash

# Create necessary directories if they don't exist
mkdir -p docs/architecture
mkdir -p docs/development
mkdir -p docs/database
mkdir -p docs/deployment
mkdir -p docs/security
mkdir -p docs/analytics
mkdir -p docs/components
mkdir -p docs/api
mkdir -p docs/guides
mkdir -p docs/getting-started
mkdir -p docs/templates
mkdir -p docs/standards
mkdir -p docs/gamification
mkdir -p docs/reference
mkdir -p docs/platforms
mkdir -p docs/admin
mkdir -p docs/contributing
mkdir -p docs/authentication
mkdir -p docs/troubleshooting
mkdir -p docs/email

# Move files to their correct locations
# Architecture
mv docs/WHY-MODERN-STACK.md docs/architecture/
mv docs/platform-bridge.md docs/architecture/
mv docs/ai-integration.md docs/architecture/
mv docs/UNIFIED-PLATFORM.md docs/architecture/
mv docs/cross-platform-navigation.md docs/architecture/
mv docs/MONOREPO.md docs/architecture/

# Development
mv docs/development-environment.md docs/development/
mv docs/TEST_PLAN.md docs/development/

# Security
mv docs/RBAC-IMPLEMENTATION.md docs/security/
mv docs/security.md docs/security/

# Components
mv docs/component-library.md docs/components/
mv docs/sacred-geometry-design-system.md docs/components/

# API
mv docs/api-documentation.md docs/api/

# Guides
mv docs/user-guide.md docs/guides/
mv docs/user-journeys.md docs/guides/

# Getting Started
mv docs/INDEX.md docs/getting-started/
mv docs/core-concepts.md docs/getting-started/
mv docs/quick-start.md docs/getting-started/

# Specialized Directories
# Create placeholder files for specialized directories
touch docs/gamification/REWARDS.md
touch docs/gamification/ACHIEVEMENTS.md
touch docs/gamification/LEADERBOARDS.md

touch docs/reference/API-REFERENCE.md
touch docs/reference/CONFIGURATION.md
touch docs/reference/TROUBLESHOOTING.md

touch docs/platforms/WEB.md
touch docs/platforms/MOBILE.md
touch docs/platforms/DESKTOP.md

touch docs/admin/DASHBOARD.md
touch docs/admin/USER-MANAGEMENT.md
touch docs/admin/SETTINGS.md

touch docs/contributing/CONTRIBUTING.md
touch docs/contributing/CODE-OF-CONDUCT.md
touch docs/contributing/PULL-REQUESTS.md

touch docs/authentication/AUTH-FLOW.md
touch docs/authentication/OAuth.md
touch docs/authentication/SSO.md

touch docs/troubleshooting/COMMON-ISSUES.md
touch docs/troubleshooting/DEBUGGING.md
touch docs/troubleshooting/SUPPORT.md

touch docs/email/TEMPLATES.md
touch docs/email/DELIVERY.md
touch docs/email/TRACKING.md

echo "Documentation reorganization complete!"
echo "Please review the specialized directories and move any existing content to the appropriate files." 