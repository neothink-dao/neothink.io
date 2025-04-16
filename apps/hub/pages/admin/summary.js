'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { FeedbackDashboard } from 'packages/ui/src/FeedbackDashboard';
import { useFeedbackSubscription } from '../../lib/supabase/feedback-subscription';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

// Import chart components with dynamic loading for better performance
const DynamicBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" /> }
);

const DynamicBar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const DynamicXAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const DynamicYAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const DynamicCartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const DynamicTooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const DynamicLegend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const DynamicResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

// Icons for dashboard
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const SentimentIcon = ({ type }) => {
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

// Main dashboard component
export default function AdminSummaryPage() {
  const [appFilter, setAppFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [period, setPeriod] = useState('week');
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackTrends, setFeedbackTrends] = useState([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();

  // Check if user is admin or family_admin
  const [userRole, setUserRole] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Get user metadata to check role
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          const role = data.user.app_metadata?.role || 
                      data.user.user_metadata?.role || 
                      'user';
          setUserRole(role);
          setIsAuthorized(['admin', 'family_admin'].includes(role));
        }
      });
    }
  }, [user, supabase]);

  // Use real-time subscription for feedback
  const { feedbackItems, isLoading: isLoadingFeedback, updateFeedbackStatus } = useFeedbackSubscription({
    appName: appFilter !== 'all' ? appFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    onStatusChange: (feedback) => {
      // We could add notifications here
      console.log(`Feedback ${feedback.id} status changed to ${feedback.status}`);
    },
    onNewFeedback: () => {
      // Refresh summary and trends on new feedback
      fetchSummary();
      fetchFeedbackTrends();
    }
  });

  // Filter feedback by sentiment as well
  const filteredFeedback = feedbackItems.filter(item => {
    if (sentimentFilter === 'all') return true;
    if (sentimentFilter === 'undefined' && !item.sentiment) return true;
    return item.sentiment === sentimentFilter;
  });

  // Fetch analytics summary from Edge Function
  const fetchSummary = async () => {
    setIsLoadingSummary(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('summarize', {
        body: {
          appName: appFilter !== 'all' ? appFilter : undefined,
          period
        }
      });
      
      if (error) throw error;
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.message || 'Failed to fetch summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };
  
  // Fetch feedback trends from the feedback_trends view
  const fetchFeedbackTrends = async () => {
    if (!isAuthorized) return;
    
    setIsLoadingTrends(true);
    try {
      let query = supabase
        .from('feedback_trends')
        .select('*')
        .order('feedback_date', { ascending: false });
      
      // Apply app filter if not 'all'
      if (appFilter !== 'all') {
        query = query.eq('app_name', appFilter);
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
      
      query = query.gte('feedback_date', dateLimit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      setFeedbackTrends(data || []);
    } catch (err) {
      console.error('Error fetching feedback trends:', err);
      setError(err.message || 'Failed to fetch feedback trends');
    } finally {
      setIsLoadingTrends(false);
    }
  };

  // Fetch summary and trends on initial load and when filters change
  useEffect(() => {
    if (isAuthorized) {
      fetchSummary();
      fetchFeedbackTrends();
    }
  }, [isAuthorized, appFilter, period]);

  // Change feedback status
  const handleStatusChange = async (id, newStatus) => {
    await updateFeedbackStatus(id, newStatus);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Admin Access Required
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Please sign in to access the admin dashboard.
          </p>
          <div className="flex justify-center">
            <a 
              href="/login" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
            Unauthorized Access
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            You do not have permission to access the admin dashboard.
            Only admin and family_admin roles can view this page.
          </p>
          <div className="flex justify-center">
            <a 
              href="/" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Display limited view for family_admin role if applicable
  const isFamilyAdmin = userRole === 'family_admin';

  const [trends, setTrends] = useState([]);
  const [selectedApp, setSelectedApp] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  // Check if user has admin access
  const checkAdminAccess = async () => {
    if (!user) return false;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error checking admin access:', error);
      return false;
    }

    return ['admin', 'family_admin'].includes(profile?.role);
  };

  // Load feedback trends
  const loadTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const { data, error } = await supabase
        .from('feedback_trends')
        .select('*')
        .order('feedback_date', { ascending: false });

      if (error) throw error;

      setTrends(data || []);
      toast({
        title: 'Dashboard updated',
        description: 'Latest feedback trends loaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error loading trends',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const isAdmin = await checkAdminAccess();
      if (!isAdmin) {
        toast({
          title: 'Access denied',
          description: 'You need admin privileges to view this dashboard.',
          variant: 'destructive',
        });
        return;
      }
      loadTrends();
    };

    init();
  }, [user]);

  // Filter trends based on selected options
  const filteredTrends = trends.filter(trend => {
    const appMatch = selectedApp === 'all' || trend.app_name === selectedApp;
    const roleMatch = selectedRole === 'all' || trend.user_role === selectedRole;
    return appMatch && roleMatch;
  });

  // Calculate statistics
  const stats = {
    total: filteredTrends.reduce((sum, t) => sum + t.feedback_count, 0),
    apps: [...new Set(trends.map(t => t.app_name))],
    roles: [...new Set(trends.map(t => t.user_role))],
  };

  // Calculate engagement score (0-100)
  const getEngagementScore = (count) => {
    const max = Math.max(...filteredTrends.map(t => t.feedback_count));
    return max === 0 ? 0 : Math.round((count / max) * 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-500/5 to-indigo-600/5">
        <CardHeader>
          <CardTitle className="text-2xl">Feedback Dashboard</CardTitle>
          <CardDescription>
            Track user engagement and feedback trends across applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedApp} onValueChange={setSelectedApp}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select app" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                {stats.apps.map(app => (
                  <SelectItem key={app} value={app}>
                    {app.charAt(0).toUpperCase() + app.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {stats.roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={loadTrends}
              disabled={isLoadingTrends}
              className="ml-auto"
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoadingTrends ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Feedback Count</TableHead>
                  <TableHead>Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrends.map((trend) => (
                  <TableRow
                    key={`${trend.app_name}-${trend.user_role}-${trend.feedback_date}`}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      {new Date(trend.feedback_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {trend.app_name}
                    </TableCell>
                    <TableCell>{trend.user_role}</TableCell>
                    <TableCell>{trend.feedback_count}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={getEngagementScore(trend.feedback_count)}
                          className="h-2"
                        />
                        <span className="text-sm text-gray-500">
                          {getEngagementScore(trend.feedback_count)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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

      {/* Chat Analytics */}
      {summary && summary.chat_summaries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Chat Analytics</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Messages/Conv.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Tokens
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.chat_summaries.map((chatSummary) => (
                  <tr key={chatSummary.app_name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {chatSummary.app_name.charAt(0).toUpperCase() + chatSummary.app_name.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chatSummary.total_messages}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chatSummary.unique_users}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chatSummary.total_conversations}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chatSummary.average_messages_per_conversation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chatSummary.total_tokens_used.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Feedback List
            {isLoadingFeedback && <span className="ml-2 inline-block animate-pulse">Loading...</span>}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {filteredFeedback.length} items matching your filters
          </p>
        </div>
        
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
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
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