import { Suspense } from 'react';
import { UserProfile } from '@/lib/components/profile';
import { ContentList } from '@/lib/components/content';
import { CrossPlatformNav } from '@/lib/components/navigation';
import { PlatformSlug } from '@/lib/supabase/auth-client';
import ProtectedRoute from '@/lib/components/ProtectedRoute';
import LoadingSpinner from '@/lib/components/LoadingSpinner';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <ProtectedRoute requiredPlatform={platformSlug}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-purple-800">Neothink Hub</h1>
              <div className="flex items-center space-x-4">
                <CrossPlatformNav currentPlatform={platformSlug} />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Section */}
            <div className="col-span-1">
              <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
              <Suspense fallback={<LoadingSpinner />}>
                <UserProfile platformSlug={platformSlug} />
              </Suspense>
            </div>
            
            {/* Content Section */}
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Featured Content</h2>
                <Suspense fallback={<LoadingSpinner />}>
                  <ContentList 
                    platformSlug={platformSlug} 
                    featured={true}
                    limit={3}
                  />
                </Suspense>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Platform Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['ascenders', 'neothinkers', 'immortals'].map((platform) => (
                    <div 
                      key={platform}
                      className="bg-white rounded-lg shadow p-6"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {platform === 'ascenders' && 'Prosperity and wealth creation'}
                        {platform === 'neothinkers' && 'Happiness and integrated thinking'}
                        {platform === 'immortals' && 'Health and longevity'}
                      </p>
                      <a 
                        href={`https://join${platform}.org`}
                        className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        Visit Platform
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 