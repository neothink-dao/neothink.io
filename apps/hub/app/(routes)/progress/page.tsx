'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, TrendingUpIcon, ArrowRightIcon, RefreshCw } from 'lucide-react';

// Define token types and colors
const TOKEN_TYPES = ['LUCK', 'LIVE', 'LOVE', 'LIFE'] as const;
type TokenType = typeof TOKEN_TYPES[number];

// Define token UI settings with colors and icons
const TOKEN_SETTINGS = {
  LUCK: {
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: '🍀',
    description: 'Earned from valuable insights and lucky discoveries'
  },
  LIVE: {
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: '🌱',
    description: 'Earned through vitality practices and embodiment'
  },
  LOVE: {
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    icon: '❤️',
    description: 'Earned through connections and community participation'
  },
  LIFE: {
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: '✨',
    description: 'Earned through profound wisdom and life observations'
  }
};

// Subscription tiers with benefits
const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    color: 'bg-gray-100 text-gray-800',
    features: ['Basic token earnings', 'Public chat rooms', 'Limited content access']
  },
  premium: {
    name: 'Premium',
    color: 'bg-purple-100 text-purple-800',
    features: ['2x token earnings', 'Premium chat rooms', 'Full content access', 'Weekly token bonuses']
  },
  superachiever: {
    name: 'Superachiever',
    color: 'bg-indigo-100 text-indigo-800',
    features: ['3x token earnings', 'All premium benefits', 'Exclusive Superachiever rooms', 'Monthly one-on-one calls']
  }
};

// Types for token data
type TokenBalance = {
  token_type: TokenType;
  current_balance: number;
  total_earned: number;
};

type TokenTransaction = {
  id: string;
  token_type: TokenType;
  amount: number;
  source_type: string;
  description: string | null;
  created_at: string;
};

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: string | null;
  subscription_tier: string | null;
  subscription_period_start: string | null;
  subscription_period_end: string | null;
};

export default function ProgressPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [tokenTransactions, setTokenTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TokenType | 'all'>('all');
  const supabase = createClientComponentClient();

  // Calculate total tokens and subscription expiry
  const totalTokens = useMemo(() => 
    tokenBalances.reduce((sum, balance) => sum + balance.current_balance, 0),
    [tokenBalances]
  );

  const subscriptionDaysLeft = useMemo(() => {
    if (!userProfile?.subscription_period_end) return null;
    const endDate = new Date(userProfile.subscription_period_end);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [userProfile]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
    setupRealtimeSubscription();
  }, []);

  // Set up realtime token balance updates
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('token_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'token_transactions',
      }, (payload) => {
        // When new token transactions are detected, refresh data
        fetchTokenData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Fetch user profile, token balances and transactions
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      await fetchTokenData();

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch token balances and transactions
  const fetchTokenData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetch token summary
      const { data: tokenSummary, error: tokenError } = await supabase
        .rpc('get_user_token_summary', { user_uuid: user.id });

      if (tokenError) throw tokenError;
      setTokenBalances(tokenSummary);

      // Fetch token transactions
      const { data: transactions, error: txError } = await supabase
        .rpc('get_user_token_history', { 
          user_uuid: user.id,
          token_type_filter: activeTab !== 'all' ? activeTab : null,
          page_size: 20,
          page_number: 1
        });

      if (txError) throw txError;
      setTokenTransactions(transactions);

    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as TokenType | 'all');
    
    // If we're changing token type, filter transactions
    if (value !== activeTab) {
      supabase
        .rpc('get_user_token_history', { 
          user_uuid: userProfile?.id,
          token_type_filter: value !== 'all' ? value : null,
          page_size: 20,
          page_number: 1
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching filtered transactions:', error);
            return;
          }
          setTokenTransactions(data);
        });
    }
  };

  // Determine subscription tier display information
  const subscriptionTier = useMemo(() => {
    const tier = userProfile?.subscription_tier || 'free';
    return SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS] || SUBSCRIPTION_TIERS.free;
  }, [userProfile]);

  // Loading UI
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your token earnings and subscription benefits
        </p>
      </div>

      {/* Subscription Status Card */}
      <Card className="mb-8 overflow-hidden">
        <div className={`px-6 py-3 ${subscriptionTier.color}`}>
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="px-3 py-1">
              {subscriptionTier.name} Subscription
            </Badge>
            {subscriptionDaysLeft !== null && (
              <div className="text-xs font-medium flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" /> 
                {subscriptionDaysLeft > 0 
                  ? `${subscriptionDaysLeft} days remaining` 
                  : 'Expired'}
              </div>
            )}
          </div>
        </div>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-3">Your Benefits</h3>
          <ul className="space-y-2">
            {subscriptionTier.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <ArrowRightIcon className="h-4 w-4 mr-2 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          {userProfile?.subscription_tier !== 'superachiever' && (
            <Button className="mt-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              Upgrade Now
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Token Balances */}
      <h2 className="text-xl font-semibold mb-4">Token Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TOKEN_TYPES.map((tokenType) => {
          const balance = tokenBalances.find(b => b.token_type === tokenType);
          const settings = TOKEN_SETTINGS[tokenType];
          
          return (
            <Card 
              key={tokenType} 
              className={`border ${settings.borderColor} transition-all hover:shadow-md`}
            >
              <CardHeader className={`pb-2 ${settings.bgColor}`}>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>{settings.icon}</span> {tokenType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${settings.textColor} mb-1`}>
                  {balance?.current_balance || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {settings.description}
                </p>
                {balance && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Total Earned</span>
                      <span className="font-medium">{balance.total_earned}</span>
                    </div>
                    <Progress 
                      value={(balance.current_balance / balance.total_earned) * 100} 
                      className={`h-1.5 bg-gray-100 bg-gradient-to-r ${settings.color}`} 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Token Transactions */}
      <h2 className="text-xl font-semibold mb-4">
        <div className="flex justify-between items-center">
          <span>Token History</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTokenData}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </h2>
      <Card>
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <div className="border-b px-6 py-3">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {TOKEN_TYPES.map(type => (
                <TabsTrigger 
                  key={type} 
                  value={type}
                  className={TOKEN_SETTINGS[type].textColor}
                >
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <TransactionTable transactions={tokenTransactions} />
          </TabsContent>
          
          {TOKEN_TYPES.map(tokenType => (
            <TabsContent key={tokenType} value={tokenType}>
              <TransactionTable 
                transactions={tokenTransactions.filter(tx => tx.token_type === tokenType)} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}

// Transaction table component
function TransactionTable({ transactions }: { transactions: TokenTransaction[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getSourceLabel = (sourceType: string) => {
    const sourceLabels: Record<string, string> = {
      'post': 'Insight Post',
      'message': 'Chat Message',
      'zoom_attendance': 'Zoom Meeting',
      'weekly_bonus': 'Weekly Bonus',
      'admin_award': 'Admin Award'
    };
    
    return sourceLabels[sourceType] || sourceType;
  };
  
  return (
    <div className="p-4">
      {transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(transaction.created_at)}
                </TableCell>
                <TableCell>
                  <Badge className={`${TOKEN_SETTINGS[transaction.token_type].bgColor} ${TOKEN_SETTINGS[transaction.token_type].textColor} border-none`}>
                    {transaction.token_type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  +{transaction.amount}
                </TableCell>
                <TableCell>
                  {getSourceLabel(transaction.source_type)}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 