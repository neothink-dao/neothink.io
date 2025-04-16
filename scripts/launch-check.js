#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const chalk = require('chalk');

console.log(chalk.bold.blue('🚀 Neothink Platform Launch Checker'));
console.log(chalk.gray('Running pre-launch verification checks...\n'));

// Track pass/fail status
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * Run a check and report results
 */
async function runCheck(name, checkFn) {
  process.stdout.write(`${chalk.yellow('⏳')} ${name}... `);
  
  try {
    const { status, message, details } = await checkFn();
    
    if (status === 'pass') {
      results.passed++;
      console.log(`${chalk.green('✓')} ${chalk.green('PASS')}`);
    } else if (status === 'warn') {
      results.warnings++;
      console.log(`${chalk.yellow('⚠️')} ${chalk.yellow('WARNING')}`);
      if (message) console.log(`   ${chalk.yellow('→')} ${message}`);
    } else {
      results.failed++;
      console.log(`${chalk.red('✗')} ${chalk.red('FAIL')}`);
      if (message) console.log(`   ${chalk.red('→')} ${message}`);
    }
    
    if (details && (status === 'fail' || status === 'warn')) {
      console.log(`   ${chalk.gray(details)}`);
    }
  } catch (error) {
    results.failed++;
    console.log(`${chalk.red('✗')} ${chalk.red('ERROR')}`);
    console.log(`   ${chalk.red('→')} ${error.message}`);
  }
}

// Check 1: Verify all apps have a vercel.json file
async function checkVercelConfig() {
  const apps = ['hub', 'ascenders', 'immortals', 'neothinkers'];
  const missingConfig = [];
  
  for (const app of apps) {
    const configPath = path.join(process.cwd(), 'apps', app, 'vercel.json');
    if (!fs.existsSync(configPath)) {
      missingConfig.push(app);
    }
  }
  
  if (missingConfig.length > 0) {
    return {
      status: 'fail',
      message: `Missing vercel.json in: ${missingConfig.join(', ')}`,
      details: 'Each app needs a vercel.json file with proper configuration',
    };
  }
  
  return { status: 'pass' };
}

// Check 2: Verify environment variables
async function checkEnvVars() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    return {
      status: 'fail',
      message: `Missing environment variables: ${missingVars.join(', ')}`,
      details: 'Make sure .env file exists and all required variables are set',
    };
  }
  
  return { status: 'pass' };
}

// Check 3: Verify Supabase connection
async function checkSupabaseConnection() {
  // Try to require Supabase
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        status: 'fail',
        message: 'Missing Supabase environment variables',
        details: 'Make sure .env file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
      };
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Try a simple query
    const { data, error } = await supabase.from('platform_status').select('*').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          status: 'warn',
          message: 'Could not connect to platform_status table',
          details: 'Make sure to run the latest migrations',
        };
      }
      
      return {
        status: 'fail',
        message: `Supabase query error: ${error.message}`,
        details: error.details || '',
      };
    }
    
    return { status: 'pass' };
  } catch (error) {
    return {
      status: 'fail',
      message: `Failed to connect to Supabase: ${error.message}`,
      details: 'Make sure Supabase project is running and credentials are correct',
    };
  }
}

// Check 3.5: Validate Supabase schema
async function checkSchemaValidation() {
  try {
    // Run the validate-schema.ts script using ts-node
    const result = execSync('npx ts-node scripts/validate-schema.ts', { stdio: 'pipe' });
    return { status: 'pass', message: 'Supabase schema is valid.' };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Supabase schema validation failed',
      details: error.stdout ? error.stdout.toString() : error.message,
    };
  }
}

// Check 4: Verify git status
async function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain').toString();
    
    if (status.trim() !== '') {
      return {
        status: 'warn',
        message: 'There are uncommitted changes in the repository',
        details: 'Consider committing changes before deploying',
      };
    }
    
    return { status: 'pass' };
  } catch (error) {
    return {
      status: 'warn',
      message: 'Could not check git status',
      details: error.message,
    };
  }
}

// Check 5: Verify all dependencies
async function checkDependencies() {
  try {
    execSync('pnpm install --no-frozen-lockfile', { stdio: 'pipe' });
    return { status: 'pass' };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Dependency installation failed',
      details: error.message,
    };
  }
}

// Check 6: Verify builds
async function checkBuilds() {
  try {
    // We'll just try to build one app as a test
    execSync('pnpm turbo run build --filter=@neothink/hub...', { stdio: 'pipe' });
    return { status: 'pass' };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Build process failed',
      details: error.message,
    };
  }
}

// Check 7: Verify migrations
async function checkMigrations() {
  const migrationDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  try {
    const files = fs.readdirSync(migrationDir);
    const sqlFiles = files.filter(file => file.endsWith('.sql'));
    
    if (sqlFiles.length === 0) {
      return {
        status: 'warn',
        message: 'No migration files found',
        details: 'Make sure migrations are in supabase/migrations',
      };
    }
    
    // Try to find health check migration
    const healthCheck = sqlFiles.find(file => file.includes('health_monitoring'));
    
    if (!healthCheck) {
      return {
        status: 'warn',
        message: 'Health monitoring migration not found',
        details: 'Make sure to apply the 20250416_health_monitoring.sql migration',
      };
    }
    
    return { status: 'pass' };
  } catch (error) {
    return {
      status: 'warn',
      message: 'Could not check migrations',
      details: error.message,
    };
  }
}

// Run all checks
async function runAllChecks() {
  // Check environment
  if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
    console.log(chalk.red('❌ .env file not found - please create one based on .env.example'));
    process.exit(1);
  }
  
  require('dotenv').config();
  
  // Run all checks
  await runCheck('Checking Vercel configuration', checkVercelConfig);
  await runCheck('Checking environment variables', checkEnvVars);
  await runCheck('Checking Supabase connection', checkSupabaseConnection);
  await runCheck('Validating Supabase schema', checkSchemaValidation);
  await runCheck('Checking Git status', checkGitStatus);
  await runCheck('Checking dependencies', checkDependencies);
  await runCheck('Checking builds', checkBuilds);
  await runCheck('Checking migrations', checkMigrations);
  
  // Print summary
  console.log('\n' + chalk.bold('📊 Summary:'));
  console.log(`${chalk.green('✓')} ${results.passed} checks passed`);
  console.log(`${chalk.yellow('⚠️')} ${results.warnings} warnings`);
  console.log(`${chalk.red('✗')} ${results.failed} failures`);
  
  // Final result
  if (results.failed > 0) {
    console.log('\n' + chalk.bold.red('❌ Pre-launch check failed'));
    console.log(chalk.red('Please fix the issues above before deploying'));
    process.exit(1);
  } else if (results.warnings > 0) {
    console.log('\n' + chalk.bold.yellow('⚠️ Pre-launch check completed with warnings'));
    console.log(chalk.yellow('Review warnings before proceeding with deployment'));
  } else {
    console.log('\n' + chalk.bold.green('✅ All pre-launch checks passed!'));
    console.log(chalk.green('You are ready to deploy'));
  }
}

// Start the checks
runAllChecks().catch(error => {
  console.error(chalk.red(`Error running checks: ${error.message}`));
  process.exit(1);
}); 