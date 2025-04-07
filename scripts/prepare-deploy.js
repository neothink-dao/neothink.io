#!/usr/bin/env node

/**
 * Neothink Platforms - Deployment Preparation Script
 * 
 * This script performs all necessary steps to prepare the platforms
 * for deployment, including:
 * 
 * 1. Synchronizing RBAC components across platforms
 * 2. Running necessary database migrations
 * 3. Generating TypeScript types
 * 4. Preparing environment configurations
 * 
 * Usage: node scripts/prepare-deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Banner
console.log('\n==============================================');
console.log('  NEOTHINK PLATFORMS - DEPLOYMENT PREPARATION  ');
console.log('==============================================\n');

// Track success/failure of steps
const steps = {
  sync: false,
  migrations: false,
  types: false,
  env: false
};

// Step 1: Synchronize RBAC components
console.log('📋 Step 1: Synchronizing RBAC components across platforms...');
try {
  execSync('npm run sync:roles', { stdio: 'inherit' });
  steps.sync = true;
  console.log('✅ RBAC components synchronized successfully\n');
} catch (error) {
  console.error('❌ Error synchronizing RBAC components:', error.message);
  console.log('');
}

// Step 2: Run database migrations
console.log('📋 Step 2: Applying database migrations...');
try {
  execSync('npm run migrate:all', { stdio: 'inherit' });
  steps.migrations = true;
  console.log('✅ Database migrations applied successfully\n');
} catch (error) {
  console.error('❌ Error applying migrations:', error.message);
  console.log('');
}

// Step 3: Generate TypeScript types
console.log('📋 Step 3: Generating TypeScript types from database schema...');
try {
  execSync('npm run gen:types', { stdio: 'inherit' });
  steps.types = true;
  console.log('✅ TypeScript types generated successfully\n');
} catch (error) {
  console.error('❌ Error generating types:', error.message);
  console.log('');
}

// Step 4: Verify environment configuration
console.log('📋 Step 4: Verifying environment configuration...');

// Check for root .env file
const rootEnvPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(rootEnvPath)) {
  console.log('⚠️ Root .env file not found, creating template...');
  
  // Create template .env file
  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Role System Configuration
NEXT_PUBLIC_DEFAULT_ROLE=subscriber
`;
  
  fs.writeFileSync(rootEnvPath, envTemplate);
  console.log('✅ Created .env template - please fill in values before deployment');
} else {
  console.log('✅ Root .env file found');
  
  // Check for required variables
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');
  const missingVars = [];
  
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (missingVars.length > 0) {
    console.log(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
  } else {
    console.log('✅ All required environment variables found');
  }
}

steps.env = true;
console.log('');

// Final summary
console.log('==============================================');
console.log('         DEPLOYMENT PREPARATION SUMMARY       ');
console.log('==============================================');
console.log(`RBAC Sync:          ${steps.sync ? '✅ Done' : '❌ Failed'}`);
console.log(`Database Migrations: ${steps.migrations ? '✅ Done' : '❌ Failed'}`);
console.log(`TypeScript Types:    ${steps.types ? '✅ Done' : '❌ Failed'}`);
console.log(`Environment Config:  ${steps.env ? '✅ Done' : '❌ Failed'}`);
console.log('==============================================');

// Show deployment instructions
console.log('\n📣 Next Steps:');
console.log('1. Confirm all preparation steps are successful');
console.log('2. Run deployment commands for each platform:');
console.log('   - npm run deploy:hub');
console.log('   - npm run deploy:ascenders');
console.log('   - npm run deploy:neothinkers');
console.log('   - npm run deploy:immortals');
console.log('   - (or run "npm run deploy:all" to deploy all platforms)');
console.log('\n3. Verify deployments are working correctly');
console.log('4. Test role-based access on each platform');
console.log('\nFor detailed deployment instructions, see docs/DEPLOYMENT.md\n');

// Exit with appropriate code
if (Object.values(steps).every(step => step)) {
  console.log('✅ All preparation steps completed successfully');
  process.exit(0);
} else {
  console.log('⚠️ Some preparation steps failed - review logs above');
  process.exit(1);
} 