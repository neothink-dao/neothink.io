#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log divider for easier log reading
const divider = '='.repeat(80);
console.log(divider);
console.log('VERCEL BUILD SCRIPT - NEOTHINK MONOREPO');
console.log(divider);

// Log environment
console.log('Environment Information:');
console.log('- Working directory:', process.cwd());
console.log('- Node version:', process.version);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- VERCEL_ENV:', process.env.VERCEL_ENV);
console.log(divider);

try {
  // Get the app to build based on Vercel project environment variable
  const appName = process.env.PROJECT_NAME || 'hub';
  console.log(`Building application: ${appName}`);
  
  // List directories to verify structure
  console.log('\nVerifying repository structure:');
  const dirs = fs.readdirSync('.', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  console.log('Root directories:', dirs.join(', '));
  
  if (dirs.includes('apps')) {
    const appDirs = fs.readdirSync('./apps', { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    console.log('Apps directories:', appDirs.join(', '));
    
    if (!appDirs.includes(appName)) {
      console.error(`ERROR: App "${appName}" not found in apps directory!`);
      process.exit(1);
    }
  } else {
    console.error('ERROR: "apps" directory not found!');
    process.exit(1);
  }
  
  console.log('\nChecking package.json:');
  const pkgJson = require('./package.json');
  console.log('- Name:', pkgJson.name);
  console.log('- Package Manager:', pkgJson.packageManager);
  console.log('- Workspaces:', JSON.stringify(pkgJson.workspaces));
  
  // Install dependencies
  console.log(divider);
  console.log('Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });
  
  // Build the specific app
  console.log(divider);
  console.log(`Building ${appName}...`);
  execSync(`pnpm turbo run build --filter=${appName}...`, { stdio: 'inherit' });
  
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