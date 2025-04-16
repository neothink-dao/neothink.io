import fetch from 'node-fetch';

const SUPABASE_URL = 'https://dlmpxgzxdtqxyzsmpaxx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbXB4Z3p4ZHRxeHl6c21wYXh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDUxNDQwNiwiZXhwIjoyMDU2MDkwNDA2fQ.Qg2MKrcQFkUYngMnTtZbj_cIYS1o1qd5FAdf9qDn6SQ';

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

interface EnumCheck {
  enum_exists: boolean;
}

interface IndexInfo {
  tablename: string;
  indexname: string;
  indexdef: string;
}

interface TableCheck {
  table_exists: boolean;
}

interface TriggerInfo {
  trigger_name: string;
  table_name: string;
}

interface FunctionCheck {
  function_exists: boolean;
}

interface PolicyInfo {
  schemaname: string;
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string;
}

async function verifySchema() {
  try {
    // Check if valid_platform enum exists
    const enumCheck = await fetch(`${SUPABASE_URL}/rest/v1/pg/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          SELECT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'valid_platform'
          ) as enum_exists;
        `
      })
    });

    const enumResult = await enumCheck.json() as EnumCheck[];
    console.log('Valid platform enum exists:', enumResult?.[0]?.enum_exists ?? false);

    // Check indexes
    const indexCheck = await fetch(`${SUPABASE_URL}/rest/v1/pg/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          SELECT 
            tablename,
            indexname,
            indexdef
          FROM pg_indexes
          WHERE indexname IN (
            'idx_profiles_platform',
            'idx_courses_platform',
            'idx_forum_posts_platform',
            'idx_progress_user_lesson'
          );
        `
      })
    });

    const indexResult = await indexCheck.json() as IndexInfo[];
    console.log('\nPerformance indexes:');
    if (Array.isArray(indexResult) && indexResult.length > 0) {
      indexResult.forEach((row) => {
        console.log(`- ${row.indexname} on ${row.tablename}`);
      });
    } else {
      console.log('No performance indexes found');
    }

    // Check audit logs table
    const auditCheck = await fetch(`${SUPABASE_URL}/rest/v1/pg/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'audit_logs'
          ) as table_exists;
        `
      })
    });

    const auditResult = await auditCheck.json() as TableCheck[];
    console.log('\nAudit logs table exists:', auditResult?.[0]?.table_exists ?? false);

    // Check triggers
    const triggerCheck = await fetch(`${SUPABASE_URL}/rest/v1/pg/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          SELECT 
            tgname as trigger_name,
            relname as table_name
          FROM pg_trigger t
          JOIN pg_class c ON t.tgrelid = c.oid
          WHERE tgname LIKE 'audit_%_trigger';
        `
      })
    });

    const triggerResult = await triggerCheck.json() as TriggerInfo[];
    console.log('\nAudit triggers:');
    if (Array.isArray(triggerResult) && triggerResult.length > 0) {
      triggerResult.forEach((row) => {
        console.log(`- ${row.trigger_name} on ${row.table_name}`);
      });
    } else {
      console.log('No audit triggers found');
    }

    // Check rate limiting function
    const functionCheck = await fetch(`${SUPABASE_URL}/rest/v1/pg/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          SELECT EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname = 'check_rate_limit'
          ) as function_exists;
        `
      })
    });

    const functionResult = await functionCheck.json() as FunctionCheck[];
    console.log('\nRate limiting function exists:', functionResult?.[0]?.function_exists ?? false);

    // Check RLS policies
    const policyCheck = await fetch(`${SUPABASE_URL}/rest/v1/pg/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
          FROM pg_policies
          WHERE policyname IN (
            'Rate limit sign-in attempts',
            'Platform-specific content access',
            'Admin access'
          );
        `
      })
    });

    const policyResult = await policyCheck.json() as PolicyInfo[];
    console.log('\nRLS policies:');
    if (Array.isArray(policyResult) && policyResult.length > 0) {
      policyResult.forEach((row) => {
        console.log(`- ${row.policyname} on ${row.tablename}`);
      });
    } else {
      console.log('No RLS policies found');
    }

  } catch (error) {
    console.error('Error verifying schema:', error);
  }
}

verifySchema(); 