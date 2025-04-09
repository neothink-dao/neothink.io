#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js'
import { Database } from '../packages/types/src/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Validates the database schema to ensure it meets all requirements for
 * multi-platform access with proper RLS policies
 */
async function validateSchema() {
  console.log('Validating database schema...')
  
  // Check that all required tables exist
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
  
  if (tablesError) {
    console.error('Error fetching tables:', tablesError)
    process.exit(1)
  }
  
  const tableNames = tables.map(t => t.table_name)
  const requiredTables = [
    'profiles',
    'platform_access',
    'analytics_events',
    'hub_profiles',
    'ascenders_profiles',
    'neothinkers_profiles',
    'immortals_profiles',
    'content'
  ]
  
  const missingTables = requiredTables.filter(t => !tableNames.includes(t))
  if (missingTables.length > 0) {
    console.error('Missing required tables:', missingTables)
    process.exit(1)
  }
  
  console.log('✅ All required tables exist')
  
  // Check RLS is enabled for all tables
  const { data: rlsTables, error: rlsError } = await supabase
    .from('pg_tables')
    .select('tablename, rowsecurity')
    .eq('schemaname', 'public')
    .in('tablename', requiredTables)
  
  if (rlsError) {
    console.error('Error fetching RLS status:', rlsError)
    process.exit(1)
  }
  
  const tablesWithoutRLS = rlsTables.filter(t => !t.rowsecurity).map(t => t.tablename)
  if (tablesWithoutRLS.length > 0) {
    console.error('Tables without RLS enabled:', tablesWithoutRLS)
    process.exit(1)
  }
  
  console.log('✅ RLS is enabled for all required tables')
  
  // Check RLS policies exist for each table
  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('tablename, policyname')
    .eq('schemaname', 'public')
    .in('tablename', requiredTables)
  
  if (policiesError) {
    console.error('Error fetching policies:', policiesError)
    process.exit(1)
  }
  
  // Group policies by table
  const policiesByTable = policies.reduce((acc, policy) => {
    if (!acc[policy.tablename]) {
      acc[policy.tablename] = []
    }
    acc[policy.tablename].push(policy.policyname)
    return acc
  }, {} as Record<string, string[]>)
  
  // Check each table has at least one policy
  const tablesWithoutPolicies = requiredTables.filter(t => !policiesByTable[t] || policiesByTable[t].length === 0)
  if (tablesWithoutPolicies.length > 0) {
    console.error('Tables without RLS policies:', tablesWithoutPolicies)
    process.exit(1)
  }
  
  console.log('✅ RLS policies exist for all tables')
  
  // Check platform-specific tables have the correct structure
  for (const platformTable of ['hub_profiles', 'ascenders_profiles', 'neothinkers_profiles', 'immortals_profiles']) {
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', platformTable)
    
    if (columnsError) {
      console.error(`Error fetching columns for ${platformTable}:`, columnsError)
      process.exit(1)
    }
    
    const columnNames = columns.map(c => c.column_name)
    const requiredColumns = ['user_id', 'id', 'created_at', 'updated_at']
    
    const missingColumns = requiredColumns.filter(c => !columnNames.includes(c))
    if (missingColumns.length > 0) {
      console.error(`Missing required columns in ${platformTable}:`, missingColumns)
      process.exit(1)
    }
  }
  
  console.log('✅ Platform-specific tables have the correct structure')
  
  // Check the has_platform_access function exists
  const { data: functions, error: functionsError } = await supabase
    .from('information_schema.routines')
    .select('routine_name')
    .eq('routine_schema', 'public')
    .eq('routine_name', 'has_platform_access')
  
  if (functionsError) {
    console.error('Error fetching functions:', functionsError)
    process.exit(1)
  }
  
  if (!functions || functions.length === 0) {
    console.error('Missing has_platform_access function')
    process.exit(1)
  }
  
  console.log('✅ has_platform_access function exists')
  
  // All checks passed
  console.log('✅ Database schema is valid and meets all requirements!')
  
  // Testing schema with sample query
  console.log('\nTesting platform access with sample query...')
  
  // Use raw SQL for group by since the types don't properly support it in the builder
  const { data: platformAccess, error: accessError } = await supabase
    .rpc('exec_sql', { 
      sql: 'SELECT platform_slug, COUNT(*) FROM platform_access GROUP BY platform_slug'
    })
  
  if (accessError) {
    console.error('Error querying platform_access:', accessError)
  } else {
    console.log('Platform access distribution:')
    console.table(platformAccess)
  }
  
  process.exit(0)
}

// Run the validation
validateSchema().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
}) 