import React from 'react';
import { platformColors } from '@neothink/ui'; // For accent color
import { Card, CardHeader, CardTitle, CardContent } from '@neothink/ui';
import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
// Import client-side components with dynamic loading
const DynamicFeedbackDashboard = dynamic(() => import('@neothink/ui/src/FeedbackDashboard').then(mod => ({ default: mod.FeedbackDashboard })), { ssr: false });
// Dynamically import Chart components to reduce initial load time
const DynamicTrendsChart = dynamic(() => import('../../components/TrendsChart'), { ssr: false });
// Dynamically import EventStream for client-side real-time updates
const DynamicEventStream = dynamic(() => import('./EventStream'), { ssr: false });
// Dynamically import Leaderboard for client-side live leaderboard
const DynamicLeaderboard = dynamic(() => import('./Leaderboard'), { ssr: false });
// Dynamically import CensusTrends for client-side census analytics
const DynamicCensusTrends = dynamic(() => import('./CensusTrends'), { ssr: false });
// Dynamically import UserSearch for client-side user lookup and drilldown
const DynamicUserSearch = dynamic(() => import('./UserSearch'), { ssr: false });
// Dynamically import ExportButton for client-side export
const DynamicExportButton = dynamic(() => import('./ExportButton'), { ssr: false });
// Define colors for admin layout
const adminBgColor = '#fafafa'; // Zinc lightest
const adminAccentColor = platformColors.luck; // Yellow #eab308
// Server component for faster initial load
export default async function AdminDashboardPage() {
    var _a, _b, _c, _d;
    // Get supabase server client
    const supabase = createServerComponentClient({ cookies });
    // Check if user is authenticated and has appropriate role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect('/login?returnTo=/admin');
    }
    // Get user role
    const { data: userData } = await supabase.auth.getUser();
    const userRole = ((_b = (_a = userData === null || userData === void 0 ? void 0 : userData.user) === null || _a === void 0 ? void 0 : _a.app_metadata) === null || _b === void 0 ? void 0 : _b.role) ||
        ((_d = (_c = userData === null || userData === void 0 ? void 0 : userData.user) === null || _c === void 0 ? void 0 : _c.user_metadata) === null || _d === void 0 ? void 0 : _d.role) ||
        'user';
    // Check if user is authorized (admin or family_admin)
    const isAuthorized = ['admin', 'family_admin'].includes(userRole);
    if (!isAuthorized) {
        redirect('/unauthorized');
    }
    // Fetch initial feedback trends data (server-side)
    const { data: feedbackTrends } = await supabase
        .from('feedback_trends')
        .select('*')
        .order('feedback_date', { ascending: false })
        .limit(20);
    // Get initial feedback summary
    let feedbackSummary;
    try {
        const { data } = await supabase.functions.invoke('summarize', {
            body: { period: 'week' }
        });
        feedbackSummary = data;
    }
    catch (error) {
        console.error('Error fetching summary:', error);
    }
    return (<div className="min-h-screen p-8" style={{ backgroundColor: adminBgColor }}>
      <h1 className="text-4xl font-bold mb-8 text-center text-zinc-800">
        Admin Dashboard
        <span style={{ color: adminAccentColor }}>.</span> {/* Accent */}
      </h1>

      {/* TODO: Implement Sacred Geometry Layout - This requires more complex CSS/components */}
      {/* Placeholder Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Points Overview */}
        <Card style={{ borderColor: adminAccentColor }}>
           <CardHeader>
             <CardTitle style={{ color: adminAccentColor }}>Points Overview</CardTitle>
           </CardHeader>
           <CardContent>
             <p>Total Points in System: 1,234,567</p>
             <p>Points Minted Today: 5,432</p>
             {/* Add charts or more details */}
           </CardContent>
        </Card>

        {/* Team Management */}
        <Card style={{ borderColor: adminAccentColor }}>
           <CardHeader>
             <CardTitle style={{ color: adminAccentColor }}>Teams</CardTitle>
           </CardHeader>
           <CardContent>
             <p>Active Teams: 25</p>
             <p>Total Members: 150</p>
             {/* Add team list or management tools */}
           </CardContent>
        </Card>

        {/* Governance */}
         <Card style={{ borderColor: adminAccentColor }}>
           <CardHeader>
             <CardTitle style={{ color: adminAccentColor }}>Governance</CardTitle>
           </CardHeader>
           <CardContent>
             <p>Pending Proposals: 5</p>
             <p>Total Staked: 10,000 Points</p>
             {/* Add proposal list or voting tools */}
           </CardContent>
        </Card>

         {/* Add more cards for User Management, Event Management, Token Pools etc. */}

      </div>

      {/* Real-time Gamification Event Stream */}
      <Suspense fallback={<div>Loading live events...</div>}>
        <DynamicEventStream />
      </Suspense>

      {/* Leaderboard */}
      <Suspense fallback={<div>Loading leaderboard...</div>}>
        <DynamicLeaderboard />
      </Suspense>

      {/* Census Trends */}
      <Suspense fallback={<div>Loading census trends...</div>}>
        <DynamicCensusTrends />
      </Suspense>

      {/* User Search */}
      <Suspense fallback={<div>Loading user search...</div>}>
        <DynamicUserSearch />
      </Suspense>

      {/* Export Button */}
      <Suspense fallback={<div>Loading export button...</div>}>
        <DynamicExportButton />
      </Suspense>
    </div>);
}
//# sourceMappingURL=page.js.map