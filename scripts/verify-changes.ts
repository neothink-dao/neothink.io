import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyChanges() {
  try {
    console.log('Verifying database changes...')

    // Check if valid_platform enum exists
    const { data: enumCheck, error: enumError } = await supabase.rpc('check_enum_exists', {
      enum_name: 'valid_platform'
    })
    if (enumError) throw enumError
    console.log('Valid platform enum exists:', enumCheck)

    // Check if indexes exist
    const { data: indexCheck, error: indexError } = await supabase.rpc('check_indexes_exist', {
      index_names: [
        'idx_profiles_platform',
        'idx_courses_platform',
        'idx_forum_posts_platform',
        'idx_progress_user_lesson'
      ]
    })
    if (indexError) throw indexError
    console.log('Performance indexes:', indexCheck)

    // Check if audit_logs table exists
    const { data: tableCheck, error: tableError } = await supabase.rpc('check_table_exists', {
      table_name: 'audit_logs'
    })
    if (tableError) throw tableError
    console.log('Audit logs table exists:', tableCheck)

    // Check if triggers exist
    const { data: triggerCheck, error: triggerError } = await supabase.rpc('check_triggers_exist', {
      trigger_names: [
        'audit_profiles_trigger',
        'audit_courses_trigger',
        'audit_lessons_trigger',
        'audit_forum_posts_trigger'
      ]
    })
    if (triggerError) throw triggerError
    console.log('Audit triggers:', triggerCheck)

    // Check if policies exist
    const { data: policyCheck, error: policyError } = await supabase.rpc('check_policies_exist', {
      policy_names: [
        'Rate limit sign-in attempts',
        'Platform-specific content access',
        'Admin access'
      ]
    })
    if (policyError) throw policyError
    console.log('RLS policies:', policyCheck)

    console.log('Verification complete!')
  } catch (error) {
    console.error('Error verifying changes:', error)
    process.exit(1)
  }
}

verifyChanges() 