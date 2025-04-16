import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = 'https://dlmpxgzxdtqxyzsmpaxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbXB4Z3p4ZHRxeHl6c21wYXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTQ0MDYsImV4cCI6MjA1NjA5MDQwNn0.DqhDna6twnaz0XboqUcW23hbvmZ0UCaomsFaBIGkts8'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function applyDatabaseChanges() {
  try {
    // First, create the SQL executor function
    const executorSql = readFileSync(join(process.cwd(), 'scripts', 'create-sql-executor.sql'), 'utf-8')
    const { error: executorError } = await supabase.rpc('execute_sql', { sql: executorSql })
    
    if (executorError) {
      throw executorError
    }
    console.log('SQL executor function created successfully!')

    // Then apply the database enhancements
    const sqlPath = join(process.cwd(), 'scripts', 'database-enhancements.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    const { error: enhancementsError } = await supabase.rpc('execute_sql', { sql })
    
    if (enhancementsError) {
      throw enhancementsError
    }

    console.log('Database changes applied successfully!')
  } catch (error) {
    console.error('Error applying database changes:', error)
    process.exit(1)
  }
}

applyDatabaseChanges() 