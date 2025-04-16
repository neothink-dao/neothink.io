#!/usr/bin/env node

/**
 * Deployment helper script for Neothink platforms
 * This script helps configure and deploy the different platforms to Vercel
 * 
 * Usage:
 *   node scripts/deploy.js <platform> [environment]
 * 
 * Examples:
 *   node scripts/deploy.js hub
 *   node scripts/deploy.js ascenders production
 *   node scripts/deploy.js neothinkers staging
 *   node scripts/deploy.js immortals development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Platform configurations
const PLATFORMS = {
  hub: {
    name: 'Hub',
    slug: 'hub',
    domain: 'go.neothink.io',
    color: '#3b82f6',
    darkColor: '#1e40af',
    description: 'Your gateway to the Neothink ecosystem',
    projectName: 'neothink-hub'
  },
  ascenders: {
    name: 'Ascenders',
    slug: 'ascenders',
    domain: 'joinascenders.org',
    color: '#10b981',
    darkColor: '#047857',
    description: 'Your path to greater prosperity',
    projectName: 'neothink-ascenders'
  },
  neothinkers: {
    name: 'Neothinkers',
    slug: 'neothinkers',
    domain: 'joinneothinkers.org',
    color: '#8b5cf6',
    darkColor: '#6d28d9',
    description: 'Your journey to integrated thinking',
    projectName: 'neothink-neothinkers'
  },
  immortals: {
    name: 'Immortals',
    slug: 'immortals',
    domain: 'joinimmortals.org',
    color: '#f97316',
    darkColor: '#c2410c',
    description: 'Your path to optimal health and longevity',
    projectName: 'neothink-immortals'
  }
};

// Check arguments
const [platform, environment = 'production'] = process.argv.slice(2);

if (!platform) {
  console.error('Please specify a platform: hub, ascenders, neothinkers, or immortals');
  process.exit(1);
}

if (!PLATFORMS[platform]) {
  console.error(`Unknown platform: ${platform}`);
  console.error('Available platforms: hub, ascenders, neothinkers, immortals');
  process.exit(1);
}

// Load environment variables from .env file
require('dotenv').config();

const platformConfig = PLATFORMS[platform];

console.log(`=== Deploying ${platformConfig.name} (${environment}) ===`);

// Create a temporary .env file for deployment
const envPath = path.join(__dirname, '..', '.vercel', '.env');
const envDir = path.dirname(envPath);

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Basic env vars
const envVars = {
  NEXT_PUBLIC_PLATFORM_NAME: platformConfig.name,
  NEXT_PUBLIC_PLATFORM_SLUG: platformConfig.slug,
  NEXT_PUBLIC_PRIMARY_COLOR: platformConfig.color,
  NEXT_PUBLIC_DARK_COLOR: platformConfig.darkColor,
  NEXT_PUBLIC_PLATFORM_DESCRIPTION: platformConfig.description,
  NEXT_PUBLIC_VERCEL_ENV: environment,
  // Add Supabase vars if available
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
};

// Write env vars to file
const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(envPath, envContent);

// Determine the Vercel project name
const projectName = platformConfig.projectName;

// Run deployment command
try {
  // Install vercel CLI if needed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (e) {
    console.log('Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Deploy to Vercel
  const deployCommand = environment === 'production'
    ? `vercel --prod --env NEXT_PUBLIC_PLATFORM_SLUG=${platform}`
    : `vercel --env NEXT_PUBLIC_PLATFORM_SLUG=${platform}`;

  console.log(`Executing: ${deployCommand}`);
  execSync(deployCommand, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VERCEL_PROJECT_NAME: projectName
    }
  });

  console.log(`\n✅ Deployment of ${platformConfig.name} (${environment}) completed successfully!`);
  console.log(`   Visit: https://${platformConfig.domain}`);
} catch (error) {
  console.error(`\n❌ Deployment failed: ${error.message}`);
  process.exit(1);
} finally {
  // Clean up
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
} 