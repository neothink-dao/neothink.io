import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { TokenBalance, TokenHistory } from '@neothink/ui';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Progress</h1>
        <p>Please sign in to view your progress.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Progress</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Balances</h2>
        <TokenBalance
          userId={session.user.id}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Token History</h2>
        <TokenHistory
          userId={session.user.id}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
        />
      </div>
    </div>
  );
} 