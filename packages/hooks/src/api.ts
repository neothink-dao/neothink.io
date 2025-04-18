import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@neothink/database";

/**
 * Fetches the current authenticated user using Supabase's server component helpers.
 * Returns null if no user is authenticated.
 */
export async function getUser() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
