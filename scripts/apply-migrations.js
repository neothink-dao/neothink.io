#!/usr/bin/env node

/**
 * Supabase Migration Script
 * 
 * This script applies the database migrations to the Supabase instance.
 * It reads the SQL files in the migrations directory and applies them
 * in the order specified by their filenames.
 * 
 * Usage:
 *   node scripts/apply-migrations.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Extract environment variables
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
} = process.env;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Path to migrations
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// Get list of migration files
async function getMigrationFiles() {
  try {
    const files = await fs.promises.readdir(migrationsDir);
    
    // Filter for SQL files
    const sqlFiles = files.filter(file => path.extname(file) === '.sql');
    
    // Sort files by name to apply in order
    return sqlFiles.sort();
  } catch (error) {
    console.error('Error reading migrations directory:', error);
    return [];
  }
}

// Apply a single migration
async function applyMigration(fileName) {
  const filePath = path.join(migrationsDir, fileName);
  
  try {
    console.log(`Reading migration file: ${fileName}`);
    const sql = await fs.promises.readFile(filePath, 'utf8');
    
    console.log(`Applying migration: ${fileName}`);
    const { error } = await supabase.rpc('mcp_supabase_apply_migration', {
      name: fileName.replace('.sql', ''),
      query: sql
    });
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully applied migration: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`Error applying migration ${fileName}:`, error);
    return false;
  }
}

// Apply all migrations
async function applyMigrations() {
  const files = await getMigrationFiles();
  
  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }
  
  console.log(`Found ${files.length} migration files to apply`);
  
  let successCount = 0;
  
  for (const file of files) {
    const success = await applyMigration(file);
    if (success) {
      successCount++;
    }
  }
  
  console.log(`Applied ${successCount} of ${files.length} migrations successfully`);
}

// Execute main function
applyMigrations().catch(error => {
  console.error('Error applying migrations:', error);
  process.exit(1);
}); 