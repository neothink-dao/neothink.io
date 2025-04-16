import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
export function TokenHistory({ userId, supabaseUrl, supabaseKey, tokenType, limit = 20, offset = 0 }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient(supabaseUrl, supabaseKey);
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .rpc('get_token_history', {
                p_user_id: userId,
                p_token_type: tokenType,
                p_limit: limit,
                p_offset: offset
            });
            if (error) {
                console.error('Error fetching token history:', error);
                return;
            }
            setTransactions(data);
            setLoading(false);
        };
        fetchHistory();
        // Subscribe to real-time updates
        const channel = supabase
            .channel('token_history')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'token_transactions',
            filter: `user_id=eq.${userId}`
        }, () => {
            fetchHistory();
        })
            .subscribe();
        return () => {
            channel.unsubscribe();
        };
    }, [userId, tokenType, limit, offset, supabase]);
    if (loading) {
        return <div>Loading...</div>;
    }
    return (<div className="space-y-4">
      {transactions.map((transaction, index) => (<div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="font-medium">{transaction.token_type}</span>
              <span className="text-sm text-muted-foreground">
                {transaction.description}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">
              +{transaction.amount}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(transaction.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>))}
    </div>);
}
//# sourceMappingURL=TokenHistory.js.map