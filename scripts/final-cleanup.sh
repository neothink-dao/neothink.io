#!/bin/bash

set -e # Exit on error
set -o pipefail # Exit on pipe error

echo "Starting final cleanup and organization..."

# 1. Backup current state
echo "Creating backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p .backup/$timestamp
cp -r . .backup/$timestamp/

# 2. Clean up temporary and build files
echo "Cleaning up temporary files..."
find . -type f -name "*.log" -delete
find . -type f -name "*.tmp" -delete
find . -type f -name "*.swp" -delete
find . -type d -name "dist" -exec rm -rf {} +
find . -type d -name "build" -exec rm -rf {} +
find . -type d -name ".next" -exec rm -rf {} +
find . -type d -name "node_modules" -not -path "*/node_modules/*" -exec rm -rf {} +

# 3. Standardize documentation
echo "Standardizing documentation..."
find docs -type f -name "*.md" -exec sh -c '
  file="$1"
  # Ensure consistent headers
  sed -i "" "s/^#\{1,6\} .*$/#&/" "$file"
  # Remove trailing whitespace
  sed -i "" "s/[[:space:]]*$//" "$file"
  # Ensure consistent line endings
  dos2unix "$file" 2>/dev/null || true
' sh {} \;

# 4. Clean up package.json files
echo "Cleaning up package.json files..."
find . -name "package.json" -exec sh -c '
  file="$1"
  # Remove unused dependencies
  jq "del(.dependencies[\"@neothink/database-types\"])" "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
  # Sort dependencies
  jq ".dependencies |= (to_entries | sort_by(.key) | from_entries)" "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
' sh {} \;

# 5. Clean up TypeScript configuration
echo "Cleaning up TypeScript configuration..."
find . -name "tsconfig.json" -exec sh -c '
  file="$1"
  # Remove unused paths
  jq "del(.compilerOptions.paths[\"@neothink/database-types/*\"])" "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
' sh {} \;

# 6. Clean up environment files
echo "Cleaning up environment files..."
find . -name ".env*" -exec sh -c '
  file="$1"
  # Remove commented lines
  sed -i "" "/^#/d" "$file"
  # Remove empty lines
  sed -i "" "/^$/d" "$file"
  # Sort variables
  sort -u "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
' sh {} \;

# 7. Clean up imports
echo "Cleaning up imports..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c '
  file="$1"
  # Remove unused imports
  npx ts-prune "$file" | while read -r line; do
    if [[ $line == *"is defined but never used"* ]]; then
      import=$(echo "$line" | cut -d"'" -f2)
      sed -i "" "/import.*$import/d" "$file"
    fi
  done
' sh {} \;

# 8. Clean up Git history
echo "Cleaning up Git history..."
git gc --aggressive
git prune

# 9. Update documentation structure
echo "Updating documentation structure..."
mkdir -p docs/{architecture,development,database,deployment,security,analytics,standards}
find docs -type f -name "*.md" -exec sh -c '
  file="$1"
  # Add frontmatter if missing
  if ! grep -q "^---" "$file"; then
    echo "---" > "$file.tmp"
    echo "title: $(basename "$file" .md | tr "-" " " | tr "_" " ")" >> "$file.tmp"
    echo "description: " >> "$file.tmp"
    echo "---" >> "$file.tmp"
    cat "$file" >> "$file.tmp"
    mv "$file.tmp" "$file"
  fi
' sh {} \;

# 10. Run final checks
echo "Running final checks..."
pnpm install
pnpm lint
pnpm test
pnpm build

# 11. Create cleanup report
echo "Creating cleanup report..."
{
  echo "Cleanup Report - $(date)"
  echo "====================="
  echo ""
  echo "Files removed:"
  find . -type f -name "*.log" -o -name "*.tmp" -o -name "*.swp" | wc -l
  echo ""
  echo "Directories cleaned:"
  find . -type d -name "dist" -o -name "build" -o -name ".next" | wc -l
  echo ""
  echo "Documentation files standardized:"
  find docs -type f -name "*.md" | wc -l
  echo ""
  echo "Package.json files cleaned:"
  find . -name "package.json" | wc -l
} > cleanup-report.md

echo "Final cleanup complete! See cleanup-report.md for details." 