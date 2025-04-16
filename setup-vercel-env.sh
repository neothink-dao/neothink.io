#!/bin/bash

# Exit immediately if any command fails
set -e

# Output one-line summaries for each step (more production-friendly than set -x)
set -o pipefail

echo "============== ENVIRONMENT SETUP STARTED =============="

# Create clean directories for pnpm
echo "Creating clean directories for pnpm..."
rm -rf ~/.pnpm-store || true
rm -rf ~/.local/share/pnpm || true
mkdir -p ~/.pnpm-store
mkdir -p ~/.local/share/pnpm

# First try corepack (modern approach)
echo "Attempting to use corepack for pnpm installation..."
if command -v corepack >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@8.15.7 --activate
fi

# Fallback to npm global install
echo "Installing pnpm globally to ensure availability..."
npm install -g pnpm@8.15.7 --force

# Create consistent .npmrc file
echo "Creating .npmrc files..."
cat > ./.npmrc << EOL
legacy-peer-deps=true
engine-strict=false
use-pnpm=true
auto-install-peers=true
strict-peer-dependencies=false
node-linker=hoisted
shamefully-hoist=true
registry=https://registry.npmjs.org/
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-timeout=300000
EOL

# Copy to home directory for redundancy
cp ./.npmrc ~/.npmrc

# Set up execution environment
echo "Setting up execution environment..."
export NODE_PATH="$(npm root -g):$NODE_PATH"
export PATH="$(npm root -g)/pnpm/bin:$(npm root -g)/.bin:$(npm bin -g):$HOME/.local/share/pnpm:$PATH"

# Verify versions
echo "Node.js version: $(node --version)"
echo "pnpm version: $(pnpm --version)"

# Create a local override script to ensure correct pnpm is always called
echo "Creating pnpm-exec wrapper script..."
cat > ./pnpm-exec << EOL
#!/bin/bash
export PATH="$(npm root -g)/pnpm/bin:$(npm root -g)/.bin:$(npm bin -g):$HOME/.local/share/pnpm:$PATH"
PNPM_HOME="$(npm root -g)/pnpm" pnpm "\$@"
EOL
chmod +x ./pnpm-exec

echo "Environment setup completed successfully ✅" 