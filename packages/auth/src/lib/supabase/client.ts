// Use createClient from @neothink/database for platform-aware clients
import { createClient } from '@neothink/database';

// Helper to get Supabase URL and Key from env
function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return { url, key };
}

// Platform-aware client factory (no extra options, as SupabaseClientOptions does not accept platformSlug)
export function createPlatformClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key);
}

// Default export for backward compatibility (if needed)
export { createClient };