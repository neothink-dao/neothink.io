#!/bin/bash

echo "Fixing project structure..."

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p packages/ui/src/components
mkdir -p packages/core/src/lib
mkdir -p packages/database/src/supabase
mkdir -p packages/core/src/hooks
mkdir -p packages/monitoring/src/analytics
mkdir -p docs/standards
mkdir -p docs/architecture

# Move root level directories to appropriate packages
echo "Moving root level directories..."
[ -d "components" ] && mv components/* packages/ui/src/components/ 2>/dev/null || true
[ -d "lib" ] && mv lib/* packages/core/src/lib/ 2>/dev/null || true
[ -d "supabase" ] && mv supabase/* packages/database/src/supabase/ 2>/dev/null || true

# Move documentation files
echo "Moving documentation files..."
[ -f "README-AI-ENHANCEMENTS.md" ] && mv README-AI-ENHANCEMENTS.md docs/standards/AI-ENHANCEMENTS.md
[ -f "IMPLEMENTATION-PLAN.md" ] && mv IMPLEMENTATION-PLAN.md docs/architecture/IMPLEMENTATION-PLAN.md

# Clean up packages directory
echo "Cleaning up packages directory..."
[ -d "packages/hub" ] && rm -rf packages/hub
[ -d "packages/database-types" ] && rm -rf packages/database-types
[ -d "packages/hooks" ] && mv packages/hooks/* packages/core/src/hooks/ 2>/dev/null || true
[ -d "packages/analytics" ] && mv packages/analytics/* packages/monitoring/src/analytics/ 2>/dev/null || true

# Remove empty directories
echo "Removing empty directories..."
[ -d "components" ] && rm -rf components
[ -d "lib" ] && rm -rf lib
[ -d "supabase" ] && rm -rf supabase
[ -d "packages/hooks" ] && rm -rf packages/hooks
[ -d "packages/analytics" ] && rm -rf packages/analytics

# Make consolidation script executable and run it
echo "Running package consolidation..."
chmod +x scripts/consolidate-packages.sh
./scripts/consolidate-packages.sh

echo "Structure fix complete!" 