#!/bin/bash

echo "Starting comprehensive cleanup..."

# 1. Clean up documentation
echo "Cleaning up documentation..."
find docs -type f -name "*.md" -exec sed -i '' -e 's/README-AI-ENHANCEMENTS/AI-ENHANCEMENTS/g' {} \;
find docs -type f -name "*.md" -exec sed -i '' -e 's/IMPLEMENTATION-PLAN/ARCHITECTURE-PLAN/g' {} \;

# 2. Clean up package references
echo "Cleaning up package references..."
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -exec sed -i '' -e 's/@neothink\/database-types/@neothink\/database/g' {} \;
find . -type f -name "*.json" -exec sed -i '' -e 's/"@neothink\/database-types"/"@neothink\/database"/g' {} \;

# 3. Clean up environment variables
echo "Cleaning up environment variables..."
sed -i '' -e '/NEXT_PUBLIC_HUB_URL/d' .env.example
sed -i '' -e '/NEXT_PUBLIC_ENABLE_HUB/d' .env.example
sed -i '' -e '/NEXT_PUBLIC_PLATFORM_NAME=Hub/d' .env.example
sed -i '' -e '/NEXT_PUBLIC_PLATFORM_SLUG=hub/d' .env.example

# 4. Clean up GitHub templates
echo "Cleaning up GitHub templates..."
find .github -type f -name "*.md" -exec sed -i '' -e 's/\[Hub\/Ascenders\/Immortals\/Neothinkers\]/\[Ascenders\/Immortals\/Neothinkers\]/g' {} \;
find .github -type f -name "*.md" -exec sed -i '' -e '/- \[ \] Hub/d' {} \;

# 5. Clean up test files
echo "Cleaning up test files..."
find . -type f -name "*.test.ts" -exec sed -i '' -e 's/hub.neothink.com/ascenders.neothink.com/g' {} \;
find . -type f -name "*.test.ts" -exec sed -i '' -e 's/expect(getPlatformFromHost.*hub.*/expect(getPlatformFromHost("ascenders.neothink.com")).toBe("ascenders");/g' {} \;

# 6. Clean up auth references
echo "Cleaning up auth references..."
find packages/auth -type f -name "*.ts" -exec sed -i '' -e 's/if (platformSlug === "hub") return true;/if (platformSlug === "ascenders") return true;/g' {} \;
find packages/auth -type f -name "*.ts" -exec sed -i '' -e 's/variant={platformSlug === "hub" ? "primary" : platformSlug}/variant={platformSlug}/g' {} \;
find packages/auth -type f -name "*.ts" -exec sed -i '' -e 's/const supabase = createClient("hub");/const supabase = createClient("ascenders");/g' {} \;

# 7. Remove old files
echo "Removing old files..."
[ -f "README-AI-ENHANCEMENTS.md" ] && rm README-AI-ENHANCEMENTS.md
[ -f "IMPLEMENTATION-PLAN.md" ] && rm IMPLEMENTATION-PLAN.md
[ -d "packages/database-types" ] && rm -rf packages/database-types
[ -d "packages/hub" ] && rm -rf packages/hub

# 8. Update README
echo "Updating README..."
sed -i '' -e '/- \*\*Hub\*\* (`apps\/hub`): The main platform and entry point/d' README.md
sed -i '' -e '/│   ├── hub\/                # Main platform/d' README.md
sed -i '' -e '/pnpm dev:hub/d' README.md

# 9. Clean up empty directories
echo "Cleaning up empty directories..."
find . -type d -empty -delete

# 10. Run linting and formatting
echo "Running linting and formatting..."
pnpm lint
pnpm format

echo "Cleanup complete!" 