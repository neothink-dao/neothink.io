#!/bin/bash

# Move gamification content
mv docs/gamification/strategy.md docs/gamification/GAMIFICATION-STRATEGY.md

# Move reference content
mv docs/reference/tech-stack.md docs/architecture/TECH-STACK.md
mv docs/reference/SUBSCRIPTION-REFERENCE.md docs/api/SUBSCRIPTION-API.md
mv docs/reference/CROSS-PLATFORM-FEATURES.md docs/architecture/CROSS-PLATFORM-FEATURES.md
mv docs/reference/ARCHITECTURE-GUIDE.md docs/architecture/ARCHITECTURE-GUIDE.md

# Move platforms content
mv docs/platforms/ascenders.md docs/platforms/ASCENDERS.md
mv docs/platforms/hub.md docs/platforms/HUB.md
mv docs/platforms/SUPERACHIEVER.md docs/platforms/SUPERACHIEVER.md
mv docs/platforms/immortals.md docs/platforms/IMMORTALS.md
mv docs/platforms/neothinkers.md docs/platforms/NEOTHINKERS.md
mv docs/platforms/README.md docs/platforms/PLATFORMS-OVERVIEW.md

# Move admin content
mv docs/admin/README.md docs/admin/ADMIN-OVERVIEW.md

# Move contributing content
mv docs/contributing/index.md docs/contributing/CONTRIBUTING.md
mv docs/contributing/README.md docs/contributing/CONTRIBUTING-GUIDE.md

# Move authentication content
# No additional files to move

# Move troubleshooting content
mv docs/troubleshooting/README.md docs/troubleshooting/TROUBLESHOOTING-GUIDE.md

# Move email content
mv docs/email/README.md docs/email/EMAIL-OVERVIEW.md

# Update cross-references in files
find docs -type f -name "*.md" -exec sed -i '' \
  -e 's/\[tech-stack\]/\[TECH-STACK\]/g' \
  -e 's/\[SUBSCRIPTION-REFERENCE\]/\[SUBSCRIPTION-API\]/g' \
  -e 's/\[CROSS-PLATFORM-FEATURES\]/\[CROSS-PLATFORM-FEATURES\]/g' \
  -e 's/\[ARCHITECTURE-GUIDE\]/\[ARCHITECTURE-GUIDE\]/g' \
  -e 's/\[ascenders\]/\[ASCENDERS\]/g' \
  -e 's/\[hub\]/\[HUB\]/g' \
  -e 's/\[SUPERACHIEVER\]/\[SUPERACHIEVER\]/g' \
  -e 's/\[immortals\]/\[IMMORTALS\]/g' \
  -e 's/\[neothinkers\]/\[NEOTHINKERS\]/g' \
  -e 's/\[strategy\]/\[GAMIFICATION-STRATEGY\]/g' \
  {} \;

echo "Specialized content reorganization complete!"
echo "Please review the moved files and update any remaining cross-references manually." 