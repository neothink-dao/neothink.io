import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponent, PlatformSlug } from '../../supabase/auth-client';
import LoadingSpinner from '../LoadingSpinner';

interface AdminDashboardProps {
  platformSlug: PlatformSlug;
  className?: string;
}

interface DashboardMetrics {
  totalUsers: number;
  newUsersThisWeek: number;
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
}

export default function AdminDashboard({
  platformSlug,
  className = ''
}: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    newUsersThisWeek: 0,
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalViews: 0
  });
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const supabase = createClientComponent(platformSlug);
        
        // Get user metrics
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: totalUsers, error: userCountError } = await supabase
          .from('platform_access')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_slug', platformSlug);
        
        if (userCountError) {
          setError('Error loading user metrics');
          console.error('User count error:', userCountError);
          return;
        }
        
        const { count: newUsers, error: newUserError } = await supabase
          .from('platform_access')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_slug', platformSlug)
          .gte('created_at', oneWeekAgo.toISOString());
        
        if (newUserError) {
          console.error('New user count error:', newUserError);
        }
        
        // Get content metrics
        const { data: contentData, error: contentError } = await supabase
          .from('shared_content')
          .select('id, is_published')
          .eq('tenant_slug', platformSlug)
          .eq('is_deleted', false);
        
        if (contentError) {
          setError('Error loading content metrics');
          console.error('Content error:', contentError);
          return;
        }
        
        const publishedContent = contentData?.filter(item => item.is_published).length || 0;
        
        // Get view metrics
        const { count: totalViews, error: viewsError } = await supabase
          .from('content_views')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_slug', platformSlug);
        
        if (viewsError) {
          console.error('Views error:', viewsError);
        }
        
        setMetrics({
          totalUsers: totalUsers || 0,
          newUsersThisWeek: newUsers || 0,
          totalContent: contentData?.length || 0,
          publishedContent,
          draftContent: (contentData?.length || 0) - publishedContent,
          totalViews: totalViews || 0
        });
      } catch (err) {
        setError('Unexpected error loading dashboard metrics');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadMetrics();
  }, [platformSlug]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-semibold">Error Loading Dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  const adminMenuItems = [
    {
      title: 'Content Management',
      description: 'Create, edit, and manage content',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: '/admin/content'
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: '/admin/users'
    },
    {
      title: 'Analytics',
      description: 'View platform usage statistics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/admin/analytics'
    },
    {
      title: 'Settings',
      description: 'Configure platform settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: '/admin/settings'
    }
  ];
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-blue-800 font-semibold mb-2">Users</h3>
          <p className="text-3xl font-bold text-blue-900">{metrics.totalUsers}</p>
          <p className="text-blue-600 text-sm mt-1">
            +{metrics.newUsersThisWeek} new this week
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h3 className="text-green-800 font-semibold mb-2">Content</h3>
          <p className="text-3xl font-bold text-green-900">{metrics.totalContent}</p>
          <p className="text-green-600 text-sm mt-1">
            {metrics.publishedContent} published, {metrics.draftContent} drafts
          </p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <h3 className="text-purple-800 font-semibold mb-2">Content Views</h3>
          <p className="text-3xl font-bold text-purple-900">{metrics.totalViews}</p>
          <p className="text-purple-600 text-sm mt-1">
            Lifetime total views
          </p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminMenuItems.map((item) => (
          <Link
            key={item.title}
            href={item.link}
            className="flex items-start p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex-shrink-0 mr-4 text-gray-500">
              {item.icon}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 