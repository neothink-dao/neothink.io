#!/usr/bin/env ts-node
/**
 * Apply Single Migration Script
 *
 * This script applies a single database migration to the Supabase instance.
 *
 * Usage:
 *   ts-node scripts/apply-single-migration.ts <migration-file>
 *
 * Example:
 *   ts-node scripts/apply-single-migration.ts 20240406_01_analytics_tables.sql
 */
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Extract environment variables
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
    process.exit(1);
}
// Check if migration file is provided
if (process.argv.length < 3) {
    console.error('Error: Migration file must be provided');
    console.error('Usage: ts-node scripts/apply-single-migration.ts <migration-file>');
    process.exit(1);
}
// Get migration file name from command-line argument
const migrationFileName = process.argv[2];
// Create Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// Path to migrations
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const migrationPath = path.join(migrationsDir, migrationFileName);
// Apply the migration
async function applyMigration() {
    try {
        // Check if file exists
        if (!fs.existsSync(migrationPath)) {
            console.error(`Error: Migration file not found: ${migrationPath}`);
            process.exit(1);
        }
        // Read the migration file
        console.log(`Reading migration: ${migrationFileName}`);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        console.log('Applying migration...');
        const { error } = await supabase.rpc('mcp_supabase_apply_migration', {
            name: migrationFileName.replace('.sql', ''),
            query: sql
        });
        if (error) {
            console.error('Error applying migration:', error);
            process.exit(1);
        }
        console.log(`Successfully applied migration: ${migrationFileName}`);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
// Run the migration
applyMigration()
    .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=apply-single-migration.js.map