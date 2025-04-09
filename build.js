#!/usr/bin/env node

const { execSync } = require('child_process');

// Log environment information for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('NODE VERSION:', process.version);
console.log('CWD:', process.cwd());

try {
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build the monorepo
  console.log('\n🏗️ Building monorepo...');
  execSync('pnpm turbo run build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
} 