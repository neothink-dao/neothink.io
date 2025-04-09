#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m"
};

// Configuration
const apps = ['hub', 'ascenders', 'neothinkers', 'immortals'];
const requiredFiles = [
  'turbo.json',
  '.env',
  'pnpm-workspace.yaml',
];

console.log(colors.blue + '🚀 Neothink Launch Preparation Checklist 🚀' + colors.reset);
console.log(colors.blue + '==========================================' + colors.reset);

let errors = 0;

// Check required files
console.log(colors.yellow + '\n📁 Checking required files...' + colors.reset);
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(colors.green + `✅ ${file} exists` + colors.reset);
  } else {
    console.log(colors.red + `❌ ${file} missing` + colors.reset);
    errors++;
  }
});

// Check app configurations
console.log(colors.yellow + '\n🔧 Checking app configurations...' + colors.reset);
apps.forEach(app => {
  const appDir = path.join(process.cwd(), 'apps', app);
  const vercelConfig = path.join(appDir, 'vercel.json');
  const ignoreBuildScript = path.join(appDir, '.vercel', 'ignore-build.sh');
  
  if (fs.existsSync(vercelConfig)) {
    console.log(colors.green + `✅ ${app}/vercel.json exists` + colors.reset);
  } else {
    console.log(colors.red + `❌ ${app}/vercel.json missing` + colors.reset);
    errors++;
  }
  
  if (fs.existsSync(ignoreBuildScript)) {
    const executable = fs.statSync(ignoreBuildScript).mode & 0o111;
    if (executable) {
      console.log(colors.green + `✅ ${app}/.vercel/ignore-build.sh is executable` + colors.reset);
    } else {
      console.log(colors.red + `❌ ${app}/.vercel/ignore-build.sh not executable` + colors.reset);
      errors++;
    }
  } else {
    console.log(colors.red + `❌ ${app}/.vercel/ignore-build.sh missing` + colors.reset);
    errors++;
  }
});

// Check environment variables
console.log(colors.yellow + '\n🔐 Checking environment variables...' + colors.reset);
try {
  const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  const envVars = envExample.match(/^[A-Z_]+=.*/gm).map(line => line.split('=')[0]);
  
  const envFile = path.join(process.cwd(), '.env');
  if (fs.existsSync(envFile)) {
    const env = fs.readFileSync(envFile, 'utf8');
    const missingVars = envVars.filter(v => !env.includes(`${v}=`));
    
    if (missingVars.length === 0) {
      console.log(colors.green + '✅ All environment variables are defined' + colors.reset);
    } else {
      console.log(colors.red + `❌ Missing environment variables: ${missingVars.join(', ')}` + colors.reset);
      errors++;
    }
  } else {
    console.log(colors.red + '❌ .env file not found' + colors.reset);
    errors++;
  }
} catch (error) {
  console.log(colors.red + `❌ Error checking environment variables: ${error.message}` + colors.reset);
  errors++;
}

// Check dependencies
console.log(colors.yellow + '\n📦 Checking dependencies...' + colors.reset);
try {
  console.log('Running pnpm check...');
  execSync('pnpm --version', { stdio: 'ignore' });
  console.log(colors.green + '✅ pnpm is installed' + colors.reset);
} catch (error) {
  console.log(colors.red + '❌ pnpm not installed' + colors.reset);
  errors++;
}

// Check Node.js version
console.log(colors.yellow + '\n🔄 Checking Node.js version...' + colors.reset);
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  
  if (majorVersion >= 18) {
    console.log(colors.green + `✅ Node.js version ${nodeVersion} is compatible` + colors.reset);
  } else {
    console.log(colors.red + `❌ Node.js version ${nodeVersion} is too old. Need v18 or newer` + colors.reset);
    errors++;
  }
} catch (error) {
  console.log(colors.red + `❌ Error checking Node.js version: ${error.message}` + colors.reset);
  errors++;
}

// Summary
console.log(colors.yellow + '\n📋 Launch readiness summary:' + colors.reset);
if (errors === 0) {
  console.log(colors.green + '✅ All checks passed! You are ready to launch!' + colors.reset);
  console.log(colors.blue + '\nNext steps:' + colors.reset);
  console.log(colors.blue + '1. Push your changes to GitHub: git add . && git commit -m "Launch preparation" && git push' + colors.reset);
  console.log(colors.blue + '2. Verify Vercel deployments for all apps' + colors.reset);
  console.log(colors.blue + '3. Test all apps with real users' + colors.reset);
} else {
  console.log(colors.red + `❌ ${errors} issues found. Please address them before launching.` + colors.reset);
} 