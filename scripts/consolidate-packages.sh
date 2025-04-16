#!/bin/bash

# Function to consolidate database packages
consolidate_database() {
  echo "Consolidating database packages..."
  
  # Merge database-types into database
  cp -r packages/database-types/src/* packages/database/src/types/
  
  # Update database package.json
  cat > packages/database/package.json << EOL
{
  "name": "@neothink/database",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "tsup": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
EOL

  # Create database index.ts
  cat > packages/database/src/index.ts << EOL
export * from './types';
export * from './client';
export * from './queries';
export * from './mutations';
EOL

  # Remove database-types package
  rm -rf packages/database-types
}

# Function to set up core package
setup_core() {
  echo "Setting up core package..."
  
  # Update core package.json
  cat > packages/core/package.json << EOL
{
  "name": "@neothink/core",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@neothink/database": "workspace:*",
    "@neothink/ui": "workspace:*",
    "@neothink/config": "workspace:*",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "tsup": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
EOL

  # Create core index.ts
  cat > packages/core/src/index.ts << EOL
export * from './lib';
export * from './types';
export * from './services';
export * from './security';
EOL
}

# Function to set up UI package
setup_ui() {
  echo "Setting up UI package..."
  
  # Update UI package.json
  cat > packages/ui/package.json << EOL
{
  "name": "@neothink/ui",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tsup": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
EOL

  # Create UI index.ts
  cat > packages/ui/src/index.ts << EOL
export * from './components';
export * from './hooks';
export * from './styles';
export * from './utils';
EOL
}

# Function to set up config package
setup_config() {
  echo "Setting up config package..."
  
  # Update config package.json
  cat > packages/config/package.json << EOL
{
  "name": "@neothink/config",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "tsup": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
EOL

  # Create config index.ts
  cat > packages/config/src/index.ts << EOL
export * from './env';
export * from './constants';
export * from './types';
EOL
}

# Execute all setup functions
consolidate_database
setup_core
setup_ui
setup_config

echo "Package consolidation complete!" 