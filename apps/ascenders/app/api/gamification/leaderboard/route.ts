import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@neothink/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'ascender';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const supabase = await getSupabaseServerClient();
    const xpField = `${role}_xp`;
    const levelField = `${role}_level`;
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, ' + xpField + ', ' + levelField)
      .order(xpField, { ascending: false })
      .limit(limit);
    if (error) throw error;
    return new Response(
      JSON.stringify({ leaderboard: data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
