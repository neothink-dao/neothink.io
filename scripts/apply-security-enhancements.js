#!/usr/bin/env node

/**
 * Security Enhancement Script
 * 
 * This script applies security enhancements to the Neothink platform ecosystem:
 * 1. Applies the security migration to the database
 * 2. Updates environment variables with security settings
 * 3. Verifies security headers and middleware
 * 4. Runs security audits on dependencies
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Security warning banner
console.log(`
${colors.yellow}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  ${colors.red}NEOTHINK SECURITY ENHANCEMENT SCRIPT${colors.yellow}                     ║
║                                                              ║
║  This script will apply security enhancements to the         ║
║  Neothink platform ecosystem. It requires:                   ║
║    • Supabase credentials                                    ║
║    • Admin access to the database                            ║
║    • Write access to configuration files                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);

// Ask for confirmation
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`${colors.yellow}Do you want to proceed? (y/n)${colors.reset} `, (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log(`${colors.red}Aborted by user.${colors.reset}`);
    readline.close();
    process.exit(0);
  }
  
  readline.close();
  applySecurityEnhancements();
});

/**
 * Main function to apply security enhancements
 */
async function applySecurityEnhancements() {
  try {
    // Step 1: Apply security migration
    console.log(`\n${colors.cyan}Step 1/4: Applying security database migration...${colors.reset}`);
    applySecurityMigration();
    
    // Step 2: Update environment variables
    console.log(`\n${colors.cyan}Step 2/4: Updating security environment variables...${colors.reset}`);
    updateEnvironmentVariables();
    
    // Step 3: Verify security headers and middleware
    console.log(`\n${colors.cyan}Step 3/4: Verifying security configurations...${colors.reset}`);
    verifySecurityConfigurations();
    
    // Step 4: Run security audit
    console.log(`\n${colors.cyan}Step 4/4: Running security audit...${colors.reset}`);
    runSecurityAudit();
    
    // Final success message
    console.log(`\n${colors.green}✓ Security enhancements have been successfully applied.${colors.reset}`);
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log(`  1. Review the security audit results and fix any vulnerabilities`);
    console.log(`  2. Update your deployment with the latest changes`);
    console.log(`  3. Verify security headers using a tool like https://securityheaders.com`);
    
  } catch (error) {
    console.error(`\n${colors.red}Error applying security enhancements:${colors.reset}`, error);
    process.exit(1);
  }
}

/**
 * Apply the security migration to the database
 */
function applySecurityMigration() {
  try {
    console.log(`${colors.yellow}Applying migration: 20240606_security_enhancements.sql${colors.reset}`);
    execSync('npm run migrate:security', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Security migration successfully applied${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Failed to apply security migration:${colors.reset}`, error.message);
    throw new Error('Migration failed');
  }
}

/**
 * Update environment variables with security settings
 */
function updateEnvironmentVariables() {
  const envFile = path.join(process.cwd(), '.env');
  const envExampleFile = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envFile)) {
    console.error(`${colors.red}Error: .env file not found${colors.reset}`);
    throw new Error('.env file not found');
  }
  
  // Read current env file
  const envContent = fs.readFileSync(envFile, 'utf8');
  let updatedContent = envContent;
  
  // Add security-related environment variables if not present
  const securityEnvVars = {
    'NEXT_PUBLIC_CSP_ENABLED': 'true',
    'SECURE_COOKIES': 'true',
    'API_RATE_LIMIT': '60',
    'AUTH_RATE_LIMIT': '5',
    'JWT_SECRET_ROTATION_DAYS': '30',
    'SECURITY_CONTACT_EMAIL': 'security@neothink.io',
  };
  
  let addedVars = [];
  for (const [key, value] of Object.entries(securityEnvVars)) {
    if (!envContent.includes(`${key}=`)) {
      updatedContent += `\n${key}=${value}`;
      addedVars.push(key);
    }
  }
  
  // Write updated env file
  fs.writeFileSync(envFile, updatedContent);
  
  // Also update .env.example file if it exists
  if (fs.existsSync(envExampleFile)) {
    let envExampleContent = fs.readFileSync(envExampleFile, 'utf8');
    for (const [key, value] of Object.entries(securityEnvVars)) {
      if (!envExampleContent.includes(`${key}=`)) {
        envExampleContent += `\n${key}=${value}`;
      }
    }
    fs.writeFileSync(envExampleFile, envExampleContent);
  }
  
  if (addedVars.length > 0) {
    console.log(`${colors.green}✓ Added security environment variables:${colors.reset} ${addedVars.join(', ')}`);
  } else {
    console.log(`${colors.green}✓ Security environment variables are already configured${colors.reset}`);
  }
}

/**
 * Verify security headers and middleware configuration
 */
function verifySecurityConfigurations() {
  // Check for middleware.ts files
  const platforms = ['go.neothink.io', 'joinascenders', 'joinneothinkers', 'joinimmortals'];
  const middlewareFile = path.join(process.cwd(), 'lib', 'middleware', 'unified-middleware.ts');
  
  if (!fs.existsSync(middlewareFile)) {
    console.error(`${colors.red}Error: Unified middleware file not found${colors.reset}`);
    console.log(`${colors.yellow}Expected location: ${middlewareFile}${colors.reset}`);
    throw new Error('Unified middleware file not found');
  }
  
  const middlewareContent = fs.readFileSync(middlewareFile, 'utf8');
  
  // Check for security headers
  const securityChecks = {
    'X-Content-Type-Options': middlewareContent.includes('X-Content-Type-Options'),
    'X-Frame-Options': middlewareContent.includes('X-Frame-Options'),
    'X-XSS-Protection': middlewareContent.includes('X-XSS-Protection'),
    'Referrer-Policy': middlewareContent.includes('Referrer-Policy'),
    'Content-Security-Policy': middlewareContent.includes('Content-Security-Policy'),
    'Rate limiting': middlewareContent.includes('applyRateLimit'),
  };
  
  let allChecksPass = true;
  console.log(`${colors.yellow}Security configuration check results:${colors.reset}`);
  
  for (const [check, passes] of Object.entries(securityChecks)) {
    if (passes) {
      console.log(`  ${colors.green}✓ ${check}${colors.reset}`);
    } else {
      console.log(`  ${colors.red}× ${check}${colors.reset}`);
      allChecksPass = false;
    }
  }
  
  if (!allChecksPass) {
    console.warn(`${colors.yellow}⚠ Some security configurations are missing.${colors.reset}`);
    console.log(`${colors.yellow}Please ensure the unified middleware includes all required security headers.${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ All security configurations are properly set up${colors.reset}`);
  }
  
  // Check platform middleware implementations
  let platformsWithMiddleware = 0;
  for (const platform of platforms) {
    const platformMiddleware = path.join(process.cwd(), platform, 'middleware.ts');
    if (fs.existsSync(platformMiddleware)) {
      platformsWithMiddleware++;
    }
  }
  
  console.log(`${colors.green}✓ ${platformsWithMiddleware}/${platforms.length} platforms have middleware implementations${colors.reset}`);
}

/**
 * Run security audit on dependencies
 */
function runSecurityAudit() {
  try {
    console.log(`${colors.yellow}Running npm audit...${colors.reset}`);
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    
    // Parse the JSON output
    const auditResult = JSON.parse(auditOutput);
    const vulnerabilities = auditResult.vulnerabilities || {};
    const metadata = auditResult.metadata || {};
    
    const totalVulnerabilities = metadata.vulnerabilities?.total || 0;
    
    if (totalVulnerabilities === 0) {
      console.log(`${colors.green}✓ No vulnerabilities found${colors.reset}`);
    } else {
      const criticalCount = metadata.vulnerabilities?.critical || 0;
      const highCount = metadata.vulnerabilities?.high || 0;
      const moderateCount = metadata.vulnerabilities?.moderate || 0;
      const lowCount = metadata.vulnerabilities?.low || 0;
      
      console.log(`${colors.red}Found ${totalVulnerabilities} vulnerabilities:${colors.reset}`);
      console.log(`  ${colors.red}Critical: ${criticalCount}${colors.reset}`);
      console.log(`  ${colors.magenta}High: ${highCount}${colors.reset}`);
      console.log(`  ${colors.yellow}Moderate: ${moderateCount}${colors.reset}`);
      console.log(`  ${colors.blue}Low: ${lowCount}${colors.reset}`);
      
      // List critical and high vulnerabilities
      if (criticalCount > 0 || highCount > 0) {
        console.log(`\n${colors.yellow}Critical and high severity vulnerabilities:${colors.reset}`);
        
        for (const [name, info] of Object.entries(vulnerabilities)) {
          if (info.severity === 'critical' || info.severity === 'high') {
            const color = info.severity === 'critical' ? colors.red : colors.magenta;
            console.log(`  ${color}${name}@${info.version} - ${info.severity}${colors.reset}`);
            console.log(`    ${colors.yellow}Via:${colors.reset} ${info.via.map(v => typeof v === 'string' ? v : v.name).join(', ')}`);
            console.log(`    ${colors.yellow}Fix:${colors.reset} ${info.fixAvailable ? (info.fixAvailable.name ? `Upgrade to ${info.fixAvailable.name}@${info.fixAvailable.version}` : 'Available') : 'Not available'}`);
          }
        }
      }
      
      console.log(`\n${colors.yellow}Run 'npm audit fix' to attempt automatic fixes${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Failed to run security audit:${colors.reset}`, error.message);
    console.log(`${colors.yellow}Please run 'npm audit' manually to check for vulnerabilities${colors.reset}`);
  }
} 