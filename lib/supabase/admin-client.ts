import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase admin credentials. Please check your environment variables.');
}

// Create and export the admin client with service role privileges
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Helper function to execute SQL with admin privileges
 * For use in server components and API routes only!
 */
export async function executeSQL(sql: string, params?: any[]) {
  try {
    const { data, error } = await supabaseAdmin.rpc('execute_sql', { 
      query: sql,
      params: params || [] 
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('SQL execution error:', error);
    return { data: null, error };
  }
}

/**
 * Helper function to execute migrations with admin privileges
 * For use in deployment scripts only!
 */
export async function applyMigration(name: string, sqlContent: string) {
  try {
    const { data, error } = await supabaseAdmin.rpc('apply_migration', {
      name,
      sql: sqlContent
    });
    
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, data: null, error };
  }
} 