import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { TokenBalance, TokenHistory, GamificationStats } from '@neothink/ui';
// TODO: Import or create a GamificationStats component
// import { GamificationStats } from '@neothink/ui';

export const dynamic = 'force-dynamic';

// Placeholder for GamificationStats component props
type GamificationStatsProps = {
  points: number;
  role: string;
  streak: number;
  lastActive: string | null;
};

// Placeholder component
const GamificationStatsPlaceholder = ({ stats }: { stats: GamificationStatsProps | null }) => {
  if (!stats) return <p>Loading gamification stats...</p>;
  return (
    <div className="bg-zinc-100 p-4 rounded-lg shadow">
      <p><strong>Points:</strong> {stats.points}</p>
      <p><strong>Role:</strong> {stats.role}</p>
      <p><strong>Streak:</strong> {stats.streak} days</p>
      {stats.lastActive && <p><strong>Last Active:</strong> {new Date(stats.lastActive).toLocaleDateString()}</p>}
    </div>
  );
};

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

  // Fetch gamification stats
  const { data: gamificationStats, error: gamificationError } = await supabase
    .from('user_gamification_stats')
    .select('points, role, streak, last_active')
    .eq('user_id', session.user.id)
    .single();

  if (gamificationError) {
    console.error("Error fetching gamification stats:", gamificationError.message);
    // Handle error appropriately, maybe show a message to the user
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Progress</h1>
      
      {/* Gamification Stats Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Stats</h2>
        <GamificationStats 
           stats={gamificationStats} 
           isLoading={!gamificationStats && !gamificationError}
           error={gamificationError?.message}
        />
      </div>

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