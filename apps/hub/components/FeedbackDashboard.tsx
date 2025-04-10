'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format } from 'date-fns';

// Icons
const SentimentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'positive':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
        </svg>
      );
    case 'negative':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.464 6.535a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
        </svg>
      );
    case 'neutral':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM7 13a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
};

interface FeedbackItem {
  id: string;
  user_id: string;
  app_name: string;
  content: string;
  created_at: string;
  status: 'pending' | 'processing' | 'processed' | 'archived';
  sentiment?: string;
}

interface FeedbackSummary {
  feedback_summaries: Array<{
    app_name: string;
    total_count: number;
    sentiment_breakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
    status_breakdown: {
      pending: number;
      processing: number;
      processed: number;
      archived: number;
    };
    recent_samples: {
      positive: Array<{content: string}>;
      negative: Array<{content: string}>;
    };
  }>;
  chat_summaries: Array<{
    app_name: string;
    total_messages: number;
    unique_users: number;
    total_conversations: number;
    average_messages_per_conversation: number;
    total_tokens_used: number;
  }>;
}

interface FeedbackDashboardProps {
  initialSummary?: FeedbackSummary;
  userRole?: string;
}

export default function FeedbackDashboard({ initialSummary, userRole = 'admin' }: FeedbackDashboardProps) {
  const [summary, setSummary] = useState<FeedbackSummary | null>(initialSummary || null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [appFilter, setAppFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [period, setPeriod] = useState('week');
  
  const supabase = useSupabaseClient();
  
  // Fetch feedback data
  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply app filter if not 'all'
      if (appFilter !== 'all') {
        query = query.eq('app_name', appFilter);
      }
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply date range based on period
      const now = new Date();
      let dateLimit;
      
      switch (period) {
        case 'day':
          dateLimit = new Date(now.setDate(now.getDate() - 1)).toISOString();
          break;
        case 'week':
          dateLimit = new Date(now.setDate(now.getDate() - 7)).toISOString();
          break;
        case 'month':
          dateLimit = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
          break;
        default:
          dateLimit = new Date(now.setDate(now.getDate() - 7)).toISOString();
      }
      
      query = query.gte('created_at', dateLimit);
      
      // For family_admin, RLS policies will filter data automatically
      // No additional query parameters needed
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      setFeedbackItems(data || []);
    } catch (err: any) {
      console.error('Error fetching feedback:', err);
      setError(err.message || 'Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch analytics summary
  const fetchSummary = async () => {
    setIsLoadingSummary(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('summarize', {
        body: {
          appName: appFilter !== 'all' ? appFilter : undefined,
          period
        }
      });
      
      if (fetchError) throw fetchError;
      setSummary(data);
    } catch (err: any) {
      console.error('Error fetching summary:', err);
      setError(err.message || 'Failed to fetch summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };
  
  // Change feedback status
  const updateFeedbackStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setFeedbackItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, status: newStatus as any } : item
        )
      );
      
      // Refresh summary
      fetchSummary();
    } catch (err: any) {
      console.error('Error updating feedback status:', err);
      setError(err.message || 'Failed to update status');
    }
  };
  
  // Fetch data when filters change
  useEffect(() => {
    fetchFeedback();
    fetchSummary();
  }, [appFilter, statusFilter, sentimentFilter, period]);
  
  // Set up real-time subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'feedback'
      }, () => {
        // When any change happens to feedback table, refresh data
        fetchFeedback();
        fetchSummary();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appFilter, statusFilter, sentimentFilter, period]);
  
  // Filter feedback by sentiment
  const filteredFeedback = feedbackItems.filter(item => {
    if (sentimentFilter === 'all') return true;
    if (sentimentFilter === 'undefined' && !item.sentiment) return true;
    return item.sentiment === sentimentFilter;
  });
  
  return (
    <div>
      {/* Analytics Summary */}
      {summary && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.feedback_summaries.map((appSummary) => (
            <div 
              key={appSummary.app_name}
              className="bg-white rounded-lg shadow p-4"
            >
              <h3 className="text-lg font-semibold mb-2 border-b pb-2">
                {appSummary.app_name.charAt(0).toUpperCase() + appSummary.app_name.slice(1)}
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Feedback:</span>
                  <span className="font-semibold">{appSummary.total_count}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center">
                    <SentimentIcon type="positive" />
                    <span className="ml-2 text-sm">
                      {appSummary.sentiment_breakdown.positive} positive 
                      ({Math.round(
                        (appSummary.sentiment_breakdown.positive / 
                        (appSummary.total_count || 1)) * 100
                      )}%)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <SentimentIcon type="negative" />
                    <span className="ml-2 text-sm">
                      {appSummary.sentiment_breakdown.negative} negative
                      ({Math.round(
                        (appSummary.sentiment_breakdown.negative / 
                        (appSummary.total_count || 1)) * 100
                      )}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                  {appSummary.total_count > 0 && (
                    <>
                      <div 
                        className="bg-yellow-400 h-full float-left"
                        style={{ width: `${(appSummary.status_breakdown.pending / appSummary.total_count) * 100}%` }} 
                        title={`Pending: ${appSummary.status_breakdown.pending}`}
                      />
                      <div 
                        className="bg-blue-400 h-full float-left"
                        style={{ width: `${(appSummary.status_breakdown.processing / appSummary.total_count) * 100}%` }} 
                        title={`Processing: ${appSummary.status_breakdown.processing}`}
                      />
                      <div 
                        className="bg-green-400 h-full float-left"
                        style={{ width: `${(appSummary.status_breakdown.processed / appSummary.total_count) * 100}%` }} 
                        title={`Processed: ${appSummary.status_breakdown.processed}`}
                      />
                      <div 
                        className="bg-gray-400 h-full float-left"
                        style={{ width: `${(appSummary.status_breakdown.archived / appSummary.total_count) * 100}%` }} 
                        title={`Archived: ${appSummary.status_breakdown.archived}`}
                      />
                    </>
                  )}
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-yellow-600">{appSummary.status_breakdown.pending} pending</span>
                  <span className="text-blue-600">{appSummary.status_breakdown.processing} processing</span>
                  <span className="text-green-600">{appSummary.status_breakdown.processed} done</span>
                </div>
              </div>

              {/* Recent Samples */}
              {appSummary.recent_samples.positive.length > 0 && (
                <div className="text-sm">
                  <div className="flex items-center mb-1">
                    <SentimentIcon type="positive" />
                    <span className="ml-1 font-medium">Recent positive</span>
                  </div>
                  <p className="text-gray-600 truncate">"{appSummary.recent_samples.positive[0].content}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Platform</label>
          <select 
            value={appFilter} 
            onChange={(e) => setAppFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Platforms</option>
            <option value="hub">Hub</option>
            <option value="ascenders">Ascenders</option>
            <option value="immortals">Immortals</option>
            <option value="neothinkers">Neothinkers</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Sentiment</label>
          <select 
            value={sentimentFilter} 
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
            <option value="undefined">Undefined</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="processed">Processed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Time Period</label>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
        
        <div className="flex flex-col ml-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 opacity-0">Refresh</label>
          <button 
            onClick={() => {
              fetchFeedback();
              fetchSummary();
            }}
            disabled={isLoading || isLoadingSummary}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
          >
            {isLoadingSummary || isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Feedback List
            {isLoading && <span className="ml-2 inline-block animate-pulse">Loading...</span>}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {filteredFeedback.length} items matching your filters
          </p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-center">
            {error}
          </div>
        )}
        
        {filteredFeedback.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No feedback matching your current filters
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SentimentIcon type={item.sentiment || 'undefined'} />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {item.app_name.charAt(0).toUpperCase() + item.app_name.slice(1)}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-800">{item.content}</p>
                
                {/* Action buttons */}
                <div className="mt-2 flex justify-end space-x-2">
                  <select
                    value={item.status}
                    onChange={(e) => updateFeedbackStatus(item.id, e.target.value)}
                    className="text-xs rounded border-gray-300 text-indigo-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="processed">Processed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 