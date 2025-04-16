#!/bin/bash

# Function to configure an app
configure_app() {
  local app_name=$1
  local app_dir="apps/$app_name"
  
  echo "Configuring $app_name..."
  
  # Create next.config.js
  cat > "$app_dir/next.config.js" << EOL
const { nextConfig } = require('../../templates/app-config');
module.exports = nextConfig;
EOL

  # Create tsconfig.json
  cat > "$app_dir/tsconfig.json" << EOL
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["../../packages/core/src/*"],
      "@ui/*": ["../../packages/ui/src/*"],
      "@database/*": ["../../packages/database/src/*"],
      "@config/*": ["../../packages/config/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOL

  # Create vercel.json
  cat > "$app_dir/vercel.json" << EOL
{
  "version": 2,
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://$app_name.vercel.app",
    "NEXT_PUBLIC_API_URL": "https://api.$app_name.vercel.app"
  },
  "regions": ["iad1"],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
EOL

  # Create .env.example
  cat > "$app_dir/.env.example" << EOL
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App specific
NEXT_PUBLIC_APP_URL=https://$app_name.vercel.app
NEXT_PUBLIC_APP_NAME=$app_name

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_AI=false

# API endpoints
NEXT_PUBLIC_API_URL=https://api.$app_name.vercel.app

# Authentication
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://$app_name.vercel.app/auth/callback
EOL

  echo "Configuration complete for $app_name"
}

# Configure each app
configure_app "hub"
configure_app "ascenders"
configure_app "neothinkers"
configure_app "immortals"

echo "All apps configured successfully!" 