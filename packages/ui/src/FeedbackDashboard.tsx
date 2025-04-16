import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from 'database-types';

interface FeedbackItem {
  id: string;
  app_name: string;
  content: string;
  user_id: string | null;
  created_at: string;
  sentiment: string | null;
  user_email?: string | null;
}

interface FeedbackSummary {
  app_name: string;
  feedback_count: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
}

interface FeedbackDashboardProps {
  isAdmin: boolean;
  userId?: string;
  filterByApp?: string;
  showHeader?: boolean;
  showUsers?: boolean;
}

const SentimentIcon = ({ value }: { value: number }) => {
  if (value > 0.3) {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (value < -0.3) {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

const StatusBadge = ({ status }: { status: FeedbackItem['sentiment'] }) => {
  const colors = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  isAdmin,
  userId,
  filterByApp,
  showHeader = true,
  showUsers = true,
}) => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [summary, setSummary] = useState<FeedbackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const supabase = useSupabaseClient<Database>();

  // App name display formatting
  const formatAppName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // App-specific colors
  const getAppColor = (appName: string) => {
    switch (appName) {
      case 'hub':
        return 'indigo';
      case 'ascenders':
        return 'green';
      case 'immortals':
        return 'blue';
      case 'neothinkers':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('feedback')
          .select('*, auth.users(email)')
          .order('created_at', { ascending: false });
        
        // Apply filters
        if (!isAdmin && userId) {
          query = query.eq('user_id', userId);
        }
        
        if (filterByApp) {
          query = query.eq('app_name', filterByApp);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Format data
        const formattedData = data.map(item => ({
          id: item.id,
          app_name: item.app_name,
          content: item.content,
          user_id: item.user_id,
          created_at: item.created_at,
          sentiment: item.sentiment,
          user_email: item.users?.email,
        }));
        
        setFeedbackItems(formattedData);
        
        // Generate summary if admin
        if (isAdmin) {
          // Group by app
          const appGroups: Record<string, FeedbackSummary> = {};
          
          data.forEach(item => {
            if (!appGroups[item.app_name]) {
              appGroups[item.app_name] = {
                app_name: item.app_name,
                feedback_count: 0,
                positive_count: 0,
                negative_count: 0,
                neutral_count: 0,
              };
            }
            
            appGroups[item.app_name].feedback_count++;
            
            if (item.sentiment === 'positive') {
              appGroups[item.app_name].positive_count++;
            } else if (item.sentiment === 'negative') {
              appGroups[item.app_name].negative_count++;
            } else {
              appGroups[item.app_name].neutral_count++;
            }
          });
          
          setSummary(Object.values(appGroups));
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
    
    // Set up real-time listener for new feedback
    const subscription = supabase
      .channel('feedback_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feedback',
      }, fetchFeedback)
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, isAdmin, userId, filterByApp]);

  // Filter feedback by sentiment
  const filteredFeedback = feedbackItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.sentiment === activeTab;
  });

  if (!isAdmin && !userId) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        You do not have permission to view feedback data.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {showHeader && (
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isAdmin ? 'Feedback Dashboard' : 'Your Feedback'}
          </h2>
        </div>
      )}
      
      {isAdmin && summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          {summary.map(item => (
            <div 
              key={item.app_name} 
              className={`bg-${getAppColor(item.app_name)}-50 border border-${getAppColor(item.app_name)}-200 p-4 rounded-md`}
            >
              <h3 className="font-medium text-gray-800">{formatAppName(item.app_name)}</h3>
              <div className="mt-2 text-sm">
                <div className="flex justify-between mb-1">
                  <span>Total:</span>
                  <span className="font-medium">{item.feedback_count}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-green-600">Positive:</span>
                  <span className="font-medium">{item.positive_count}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-red-600">Negative:</span>
                  <span className="font-medium">{item.negative_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Neutral:</span>
                  <span className="font-medium">{item.neutral_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm ${
                activeTab === 'positive'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('positive')}
            >
              Positive
            </button>
            <button
              className={`mr-4 py-2 px-1 font-medium text-sm ${
                activeTab === 'negative'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('negative')}
            >
              Negative
            </button>
            <button
              className={`py-2 px-1 font-medium text-sm ${
                activeTab === 'neutral'
                  ? 'border-b-2 border-gray-500 text-gray-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('neutral')}
            >
              Neutral
            </button>
          </nav>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-4 text-center text-gray-600">
            No feedback available.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map(item => (
              <div 
                key={item.id} 
                className={`border border-${getAppColor(item.app_name)}-200 rounded-md overflow-hidden`}
              >
                <div className={`bg-${getAppColor(item.app_name)}-50 px-4 py-2 flex justify-between items-center`}>
                  <div className="font-medium text-gray-800">
                    {formatAppName(item.app_name)}
                    {item.sentiment && (
                      <span 
                        className={`ml-2 text-xs px-2 py-1 rounded ${
                          item.sentiment === 'positive' 
                            ? 'bg-green-100 text-green-800' 
                            : item.sentiment === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="px-4 py-3 bg-white">
                  <p className="text-gray-800">{item.content}</p>
                </div>
                {showUsers && item.user_email && (
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500 border-t border-gray-200">
                    From: {item.user_email}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 