#!/bin/bash

# Create directory structure
mkdir -p apps/{hub,ascenders,neothinkers,immortals}/{src,public}
mkdir -p packages/{core,ui,database,config}/src/{lib,hooks,components,types,styles,themes,migrations,seeds,env,constants}
mkdir -p supabase/{migrations,seeds,functions}
mkdir -p scripts docs .github

# Initialize package.json files
cat > package.json << EOL
{
  "name": "neothink-platform",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "deploy": "turbo run deploy"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
EOL

# Create workspace configuration
cat > pnpm-workspace.yaml << EOL
packages:
  - 'apps/*'
  - 'packages/*'
EOL

# Create Turborepo configuration
cat > turbo.json << EOL
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"],
      "outputs": []
    }
  }
}
EOL

# Create base .gitignore
cat > .gitignore << EOL
# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
.next
out

# Environment variables
.env
.env.local
.env.*.local

# Debug logs
npm-debug.log
yarn-debug.log
yarn-error.log

# IDE
.idea
.vscode
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOL

# Create README
cat > README.md << EOL
# Neothink Platform

A monorepo containing 4 Vercel projects (Hub, Ascenders, Neothinkers, Immortals) with a shared Supabase backend.

## Structure

- \`apps/\`: Individual Vercel projects
- \`packages/\`: Shared packages
- \`supabase/\`: Supabase configuration
- \`docs/\`: Documentation

## Getting Started

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Start development:
   \`\`\`bash
   pnpm dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   pnpm build
   \`\`\`

## Documentation

See [docs/](docs/) for detailed documentation.
EOL

# Create base ESLint configuration
cat > .eslintrc.json << EOL
{
  "extends": [
    "next/core-web-vitals",
    "turbo",
    "prettier"
  ],
  "rules": {
    "@next/next/no-html-link-for-pages": "off"
  }
}
EOL

# Create base Prettier configuration
cat > .prettierrc << EOL
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOL

# Create base TypeScript configuration
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./apps/*/src/*"],
      "@core/*": ["./packages/core/src/*"],
      "@ui/*": ["./packages/ui/src/*"],
      "@database/*": ["./packages/database/src/*"],
      "@config/*": ["./packages/config/src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOL

echo "Monorepo structure created successfully!"
echo "Please review the generated files and customize as needed." 