import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import client-side components with dynamic loading
const DynamicFeedbackDashboard = dynamic(
  () => import('../../components/FeedbackDashboard'),
  { ssr: false, loading: () => <div className="p-6 animate-pulse bg-gray-100 rounded-lg">Loading dashboard...</div> }
);

// Dynamically import Chart components to reduce initial load time
const DynamicTrendsChart = dynamic(
  () => import('../../components/TrendsChart'),
  { ssr: false }
);

// Server component for faster initial load
export default async function AdminPage() {
  // Get supabase server client
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated and has appropriate role
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login?returnTo=/admin');
  }
  
  // Get user role
  const { data: userData } = await supabase.auth.getUser();
  const userRole = userData?.user?.app_metadata?.role || 
                   userData?.user?.user_metadata?.role || 
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
  } catch (error) {
    console.error('Error fetching summary:', error);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {userRole === 'family_admin' ? 'Family Admin Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'family_admin' 
            ? 'Review feedback and AI interaction analytics for your family members'
            : 'Review feedback and AI interaction analytics across all Neothink platforms'
          }
        </p>
        
        {userRole === 'family_admin' && (
          <div className="mt-2 px-3 py-2 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm">
            Note: As a Family Admin, you can only view data from members of your family group.
          </div>
        )}
      </header>
      
      {/* Client-side components wrapped in Suspense */}
      
      {/* Feedback Trends Chart */}
      <Suspense fallback={<div className="h-80 bg-gray-100 rounded-lg animate-pulse mb-8" />}>
        <DynamicTrendsChart initialData={feedbackTrends || []} userRole={userRole} />
      </Suspense>
      
      {/* Feedback Dashboard */}
      <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
        <DynamicFeedbackDashboard 
          initialSummary={feedbackSummary} 
          userRole={userRole} 
        />
      </Suspense>
    </div>
  );
} 