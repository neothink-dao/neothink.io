'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function TrendsChart({ initialData, userRole = 'admin' }) {
    const [feedbackTrends, setFeedbackTrends] = useState(initialData);
    const [appFilter, setAppFilter] = useState('all');
    const [period, setPeriod] = useState('week');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Function to fetch feedback trends data
    const fetchFeedbackTrends = async () => {
        setIsLoading(true);
        setError(null);
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
            // For family_admin, only show data from their family members
            if (userRole === 'family_admin') {
                // This query assumes RLS policies are in place to filter data correctly
                // No additional where clauses needed as RLS will handle the filtering
            }
            const { data, error: fetchError } = await query;
            if (fetchError)
                throw fetchError;
            setFeedbackTrends(data || []);
        }
        catch (err) {
            console.error('Error fetching feedback trends:', err);
            setError(err.message || 'Failed to fetch feedback trends');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Fetch data when filters change
    useEffect(() => {
        fetchFeedbackTrends();
    }, [appFilter, period]);
    // Set up real-time subscription for live updates
    useEffect(() => {
        const channel = supabase
            .channel('feedback_trends_changes')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'feedback'
        }, () => {
            // When any change happens to feedback table, refresh trends
            fetchFeedbackTrends();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [appFilter, period]);
    return (<div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Feedback Trends</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="all">All Platforms</option>
                <option value="hub">Hub</option>
                <option value="ascenders">Ascenders</option>
                <option value="immortals">Immortals</option>
                <option value="neothinkers">Neothinkers</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="day">Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            
            <div className="ml-auto self-end">
              <button onClick={() => fetchFeedbackTrends()} disabled={isLoading} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center">
                {isLoading ? (<>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>) : (<>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                    Refresh
                  </>)}
              </button>
            </div>
          </div>
        </div>
        
        {error && (<div className="p-4 bg-red-50 text-red-700 text-center">
            {error}
          </div>)}
        
        {feedbackTrends.length === 0 ? (<div className="p-8 text-center text-gray-500">
            No feedback data available for the selected period
          </div>) : (<div className="p-4">
            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedbackTrends} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 70,
            }}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="feedback_date" angle={-45} textAnchor="end" height={70} tickFormatter={(date) => {
                return new Date(date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                });
            }}/>
                  <YAxis allowDecimals={false} label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft' }}/>
                  <Tooltip formatter={(value, name, props) => {
                if (name === 'feedback_date') {
                    return [
                        new Date(value).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }),
                        'Date'
                    ];
                }
                return [value, name === 'feedback_count' ? 'Feedback Count' : name];
            }} labelFormatter={(label) => {
                return '';
            }}/>
                  <Legend />
                  <Bar name="Feedback Count" dataKey="feedback_count" fill="#6366f1" // Indigo for hub
         animationDuration={500}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Roles breakdown */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from(new Set(feedbackTrends.map(item => item.user_role))).map(role => (<div key={role} className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 capitalize">{role} feedback</h3>
                  <p className="text-xl font-semibold mt-1">
                    {feedbackTrends.filter(item => item.user_role === role)
                    .reduce((sum, item) => sum + item.feedback_count, 0)}
                  </p>
                </div>))}
            </div>
          </div>)}
      </div>
    </div>);
}
//# sourceMappingURL=TrendsChart.js.map