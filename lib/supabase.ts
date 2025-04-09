import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export function createClient<T = Database>() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createSupabaseClient<T>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
    },
  });
} 