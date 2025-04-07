import { Suspense } from 'react';
import Link from 'next/link';
import { PlatformSlug } from '@/lib/supabase/auth-client';
import ProtectedRoute from '@/lib/components/ProtectedRoute';
import LoadingSpinner from '@/lib/components/LoadingSpinner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <ProtectedRoute requiredPlatform={platformSlug} requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto p-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="text-2xl font-bold text-purple-800">
                Neothink Hub
              </Link>
              <div className="text-lg font-semibold text-gray-600">
                Admin Portal
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Admin Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>
              <nav className="space-y-1">
                <Link 
                  href="/admin" 
                  className="block px-4 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/content" 
                  className="block px-4 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700"
                >
                  Content Management
                </Link>
                <Link 
                  href="/admin/users" 
                  className="block px-4 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700"
                >
                  User Management
                </Link>
                <Link 
                  href="/admin/settings" 
                  className="block px-4 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700"
                >
                  Settings
                </Link>
              </nav>
            </aside>
            
            {/* Main Content Area */}
            <main className="flex-1">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 