#!/bin/bash

# Function to create deployment config for an app
setup_app_deployment() {
  local app_name=$1
  local app_dir="apps/$app_name"
  
  echo "Setting up deployment config for $app_name..."
  
  # Create Vercel config
  cat > "$app_dir/vercel.json" << EOL
{
  "version": 2,
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_NAME": "$app_name",
    "NEXT_PUBLIC_APP_URL": "https://$app_name.neothink.com"
  }
}
EOL

  # Create GitHub Actions workflow
  mkdir -p "$app_dir/.github/workflows"
  cat > "$app_dir/.github/workflows/deploy.yml" << EOL
name: Deploy $app_name
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/$app_name
          vercel-args: '--prod'
EOL

  # Create environment validation script
  cat > "$app_dir/scripts/validate-env.ts" << EOL
import { z } from 'zod';
import { config } from '@neothink/config';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log('Environment variables validated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(\`- \${err.path.join('.')}: \${err.message}\`);
      });
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  validateEnv();
}
EOL

  # Create deployment check script
  cat > "$app_dir/scripts/check-deployment.ts" << EOL
import { execSync } from 'child_process';
import { config } from '@neothink/config';

function checkDeployment() {
  try {
    // Check if all required environment variables are set
    config.validateEnv();
    
    // Check if build succeeds
    execSync('pnpm build', { stdio: 'inherit' });
    
    // Check if tests pass
    execSync('pnpm test', { stdio: 'inherit' });
    
    console.log('Deployment check passed successfully');
  } catch (error) {
    console.error('Deployment check failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkDeployment();
}
EOL
}

# Setup deployment for all apps
setup_app_deployment "hub"
setup_app_deployment "ascenders"
setup_app_deployment "neothinkers"
setup_app_deployment "immortals"

echo "Deployment configurations set up successfully!" 