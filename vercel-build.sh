#!/bin/bash

# Exit immediately if any command fails
set -e
set -o pipefail

# Function for robust execution with fallbacks
robust_exec() {
  local cmd="$1"
  local fallback_cmd="$2"
  local emergency_cmd="$3"
  local step_name="$4"
  
  echo "🔄 Executing: $step_name"
  
  if eval "$cmd"; then
    echo "✅ $step_name completed successfully"
    return 0
  fi
  
  echo "⚠️ Primary method failed, trying fallback for: $step_name"
  if eval "$fallback_cmd"; then
    echo "✅ $step_name completed successfully (via fallback)"
    return 0
  fi
  
  if [ -n "$emergency_cmd" ]; then
    echo "🚨 Emergency fallback for: $step_name"
    if eval "$emergency_cmd"; then
      echo "✅ $step_name completed (via emergency fallback)"
      return 0
    fi
  fi
  
  if [ "$5" = "critical" ]; then
    echo "❌ Critical step failed: $step_name"
    return 1
  else
    echo "⚠️ Step failed but continuing: $step_name"
    return 0
  fi
}

echo "============== BUILD PROCESS STARTED =============="

# Get the app name from the first argument
APP_NAME=$1
if [ -z "$APP_NAME" ]; then
  echo "❌ Error: App name is required"
  exit 1
fi

# Determine the app directory
if [[ "$APP_NAME" == /* ]]; then
  APP_DIR="$APP_NAME"
else
  APP_DIR="apps/$APP_NAME"
fi

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "❌ Error: App directory $APP_DIR does not exist"
  exit 1
fi

# Make sure our environment setup script is executable
chmod +x ./setup-vercel-env.sh

# Run environment setup
echo "🔄 Setting up build environment..."
./setup-vercel-env.sh

# Build workspace dependencies
robust_exec \
  "./pnpm-exec build:workspace" \
  "export PATH=\"$(npm root -g)/pnpm/bin:$(npm bin -g):$PATH\" && pnpm build:workspace" \
  "npm run build --workspace=@neothink/tsconfig && npm run build --workspace=@neothink/eslint-config && npm run build --workspace=@neothink/prettier-config && npm run build --workspace=@neothink/ai-integration" \
  "Building workspace dependencies"

# Generate Supabase types
robust_exec \
  "./pnpm-exec db:generate" \
  "export PATH=\"$(npm root -g)/pnpm/bin:$(npm bin -g):$PATH\" && pnpm db:generate" \
  "" \
  "Generating Supabase types"

# Build the app
cd "$APP_DIR" || exit 1
robust_exec \
  "../../pnpm-exec build" \
  "export PATH=\"$(npm root -g)/pnpm/bin:$(npm bin -g):$PATH\" && pnpm build" \
  "npm run build" \
  "Building $APP_NAME app" \
  "critical"

echo "✅ BUILD COMPLETED SUCCESSFULLY FOR $APP_NAME" 