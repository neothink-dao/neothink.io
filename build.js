#!/usr/bin/env node

const { execSync } = require('child_process');

// Log divider for easier log reading
const divider = '='.repeat(80);
console.log(divider);
console.log('LOCAL BUILD SCRIPT - NEOTHINK MONOREPO');
console.log(divider);

// Log environment
console.log('Environment Information:');
console.log('- Working directory:', process.cwd());
console.log('- Node version:', process.version);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log(divider);

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build the monorepo
  console.log(divider);
  console.log('Building all apps...');
  execSync('pnpm turbo run build', { stdio: 'inherit' });

  console.log(divider);
  console.log('✅ Build completed successfully!');
  console.log(divider);
} catch (error) {
  console.error(divider);
  console.error('❌ BUILD FAILED:');
  console.error(error.toString());
  console.error(divider);
  process.exit(1);
} 