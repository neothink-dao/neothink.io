#!/usr/bin/env node

/**
 * Platform Deployment Script for Neothink
 * 
 * This script handles deployment of each platform to Vercel
 * It's designed to work with our monorepo structure
 * 
 * Usage:
 *   node scripts/deploy-platforms.js <platform> [environment]
 * 
 * Examples:
 *   node scripts/deploy-platforms.js hub
 *   node scripts/deploy-platforms.js ascenders production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Platform configurations
const PLATFORMS = {
  hub: {
    dir: 'go.neothink.io',
    name: 'Hub',
    slug: 'hub',
    domain: 'go.neothink.io',
    color: '#3b82f6',
    darkColor: '#1e40af',
    tenantId: '2074cd50-6cf1-467d-b520-e5c6fc7a89f2',
    projectName: 'neothink-hub'
  },
  ascenders: {
    dir: 'joinascenders',
    name: 'Ascenders',
    slug: 'ascenders',
    domain: 'joinascenders.org',
    color: '#10b981',
    darkColor: '#047857',
    tenantId: 'ce2cb142-075f-40cc-ad55-652ec6ea954d',
    projectName: 'neothink-ascenders'
  },
  neothinkers: {
    dir: 'joinneothinkers',
    name: 'Neothinkers',
    slug: 'neothinkers',
    domain: 'joinneothinkers.org',
    color: '#8b5cf6',
    darkColor: '#6d28d9',
    tenantId: 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d',
    projectName: 'neothink-neothinkers'
  },
  immortals: {
    dir: 'joinimmortals',
    name: 'Immortals',
    slug: 'immortals',
    domain: 'joinimmortals.org',
    color: '#f97316',
    darkColor: '#c2410c',
    tenantId: '013bbaf8-8d72-495c-9024-71fb945b0277',
    projectName: 'neothink-immortals'
  }
};

// Get command line arguments
const [platform, environment = 'production'] = process.argv.slice(2);

// Show help if no platform specified
if (!platform) {
  console.log('\nNeothink Platform Deployment Tool\n');
  console.log('Usage:');
  console.log('  node scripts/deploy-platforms.js <platform> [environment]\n');
  console.log('Available platforms:');
  Object.keys(PLATFORMS).forEach(p => {
    console.log(`  - ${p} (${PLATFORMS[p].name})`);
  });
  console.log('\nEnvironments: development, preview, production\n');
  process.exit(0);
}

// Validate platform
if (!PLATFORMS[platform]) {
  console.error(`Error: Unknown platform "${platform}"`);
  console.error('Available platforms: hub, ascenders, neothinkers, immortals');
  process.exit(1);
}

// Get platform config
const platformConfig = PLATFORMS[platform];
const platformDir = path.join(__dirname, '..', platformConfig.dir);

// Check if platform directory exists
if (!fs.existsSync(platformDir)) {
  console.error(`Error: Platform directory not found: ${platformDir}`);
  process.exit(1);
}

// Start deployment
console.log(`\n=== Deploying ${platformConfig.name} (${environment}) ===\n`);

// Create .env.local file in platform directory
const envPath = path.join(platformDir, '.env.local');
const envVars = {
  NEXT_PUBLIC_PLATFORM_NAME: platformConfig.name,
  NEXT_PUBLIC_PLATFORM_SLUG: platformConfig.slug,
  NEXT_PUBLIC_PRIMARY_COLOR: platformConfig.color,
  NEXT_PUBLIC_DARK_COLOR: platformConfig.darkColor,
  NEXT_PUBLIC_TENANT_ID: platformConfig.tenantId,
  NEXT_PUBLIC_VERCEL_ENV: environment,
};

// Include Supabase config from root .env if available
const rootEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  const rootEnv = fs.readFileSync(rootEnvPath, 'utf8');
  const supabaseUrl = rootEnv.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1];
  const supabaseAnonKey = rootEnv.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1];
  
  if (supabaseUrl) envVars.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
  if (supabaseAnonKey) envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;
}

// Write environment variables to .env.local
const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(envPath, envContent);
console.log(`✅ Created environment configuration at ${envPath}`);

// Execute deployment 
try {
  // Check for Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (e) {
    console.log('Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }
  
  // Deploy the platform
  console.log(`\nDeploying platform ${platformConfig.name} to Vercel...`);
  
  // Change to platform directory
  process.chdir(platformDir);
  
  // Run Vercel deploy command
  const deployCommand = environment === 'production'
    ? 'vercel --prod'
    : `vercel --env NEXT_PUBLIC_VERCEL_ENV=${environment}`;
    
  console.log(`Executing: ${deployCommand}`);
  execSync(deployCommand, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VERCEL_PROJECT_NAME: platformConfig.projectName
    }
  });
  
  console.log(`\n✅ Deployment completed for ${platformConfig.name}`);
  console.log(`   Visit: https://${platformConfig.domain}`);
} catch (error) {
  console.error(`\n❌ Deployment failed: ${error.message}`);
  process.exit(1);
} 