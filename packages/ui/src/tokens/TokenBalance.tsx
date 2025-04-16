import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface TokenBalanceProps {
  userId: string;
  supabaseUrl: string;
  supabaseKey: string;
}

interface TokenBalances {
  luck_balance: number;
  live_balance: number;
  love_balance: number;
  life_balance: number;
  total_earned: number;
  last_updated: string;
}

export function TokenBalance({ userId, supabaseUrl, supabaseKey }: TokenBalanceProps) {
  const [balances, setBalances] = useState<TokenBalances | null>(null);
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    const fetchBalances = async () => {
      const { data, error } = await supabase
        .rpc('get_token_balances', { p_user_id: userId });
      
      if (error) {
        console.error('Error fetching token balances:', error);
        return;
      }

      setBalances(data);
    };

    fetchBalances();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('token_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_transactions',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchBalances();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, supabase]);

  if (!balances) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">LUCK</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances.luck_balance}</div>
          <Progress value={(balances.luck_balance / balances.total_earned) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">LIVE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances.live_balance}</div>
          <Progress value={(balances.live_balance / balances.total_earned) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">LOVE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances.love_balance}</div>
          <Progress value={(balances.love_balance / balances.total_earned) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">LIFE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances.life_balance}</div>
          <Progress value={(balances.life_balance / balances.total_earned) * 100} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
} 