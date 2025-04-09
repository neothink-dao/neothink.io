const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');
console.log('Working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);

try {
  // Get the app to build based on the Vercel project name or environment variable
  const appName = process.env.PROJECT_NAME || 'hub';
  console.log(`Building app: ${appName}`);

  // Install dependencies if needed
  console.log('Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build the specific app
  console.log(`Building ${appName}...`);
  execSync(`pnpm turbo run build --filter=${appName}...`, { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 