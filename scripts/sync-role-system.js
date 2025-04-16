#!/usr/bin/env node

/**
 * Role-Based Access Control Sync Script
 * 
 * This script synchronizes the RBAC components across all platforms
 * to ensure consistent behavior and up-to-date implementations
 * 
 * Usage:
 *   node scripts/sync-role-system.js
 */

const fs = require('fs');
const path = require('path');

// Platform directories
const PLATFORMS = [
  'go.neothink.io',
  'joinascenders',
  'joinneothinkers',
  'joinimmortals'
];

// Root directory
const ROOT_DIR = path.join(__dirname, '..');

// Set of files to synchronize
const FILES_TO_SYNC = [
  // Types
  {
    src: 'lib/types/roles.ts',
    dest: 'lib/types/roles.ts'
  },
  // Context
  {
    src: 'lib/context/role-context.tsx',
    dest: 'lib/context/role-context.tsx'
  },
  // Components
  {
    src: 'lib/components/role/role-gate.tsx',
    dest: 'lib/components/role/role-gate.tsx'
  },
  {
    src: 'lib/components/role/MultiPlatformGate.tsx',
    dest: 'lib/components/role/MultiPlatformGate.tsx'
  },
  // Utilities
  {
    src: 'lib/supabase/role-utils.ts',
    dest: 'lib/supabase/role-utils.ts'
  },
  {
    src: 'lib/utils/platform-utils.ts',
    dest: 'lib/utils/platform-utils.ts'
  },
  // Documentation
  {
    src: 'docs/database/ROLE_UTILS.md',
    dest: 'docs/database/ROLE_UTILS.md'
  }
];

// Create directory if not exists
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Copy file with directory creation
function copyFileWithDirs(source, destination) {
  ensureDirectoryExists(path.dirname(destination));
  fs.copyFileSync(source, destination);
}

// Start synchronization
console.log('=== Synchronizing RBAC Components Across Platforms ===\n');

// Process each platform
for (const platform of PLATFORMS) {
  const platformDir = path.join(ROOT_DIR, platform);
  
  if (!fs.existsSync(platformDir)) {
    console.log(`❌ Platform directory not found: ${platform}`);
    continue;
  }
  
  console.log(`📂 Updating ${platform}...`);
  
  // Copy each file
  for (const file of FILES_TO_SYNC) {
    const sourcePath = path.join(ROOT_DIR, file.src);
    const destPath = path.join(platformDir, file.dest);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⚠️ Source file not found: ${file.src}`);
      continue;
    }
    
    try {
      copyFileWithDirs(sourcePath, destPath);
      console.log(`  ✅ ${file.dest}`);
    } catch (error) {
      console.log(`  ❌ Error copying ${file.src}: ${error.message}`);
    }
  }
}

console.log('\n=== RBAC Synchronization Complete ===');
console.log('The following components have been synchronized:');
console.log('- Role TypeScript types');
console.log('- Role React context');
console.log('- RoleGate component');
console.log('- MultiPlatformGate component');
console.log('- Role utility functions');
console.log('- Platform utility functions');
console.log('- Role system documentation');
console.log('\nRemember to commit these changes in each platform repository.'); 