'use client';

import { useEffect, useState } from 'react';
import { getAllUserProgress } from '@/../lib/progress';
import { Progress } from '@/../lib/types';

interface PlatformProgress {
  platform: string;
  count: number;
  completedCount: number;
  lastAccessed?: string;
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [platformProgress, setPlatformProgress] = useState<PlatformProgress[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const userId = 'current-user-id'; // This should be retrieved from auth context
        const progress = await getAllUserProgress(userId);
        setProgressData(progress);

        // Calculate platform-specific progress
        const platformMap: Record<string, PlatformProgress> = {};
        
        progress.forEach(item => {
          if (!platformMap[item.platform]) {
            platformMap[item.platform] = {
              platform: item.platform,
              count: 0,
              completedCount: 0,
              lastAccessed: item.last_accessed
            };
          }
          
          platformMap[item.platform].count++;
          
          if (item.progress && item.progress.completed) {
            platformMap[item.platform].completedCount++;
          }
          
          // Update last accessed if more recent
          if (platformMap[item.platform].lastAccessed && item.last_accessed &&
              new Date(item.last_accessed) > new Date(platformMap[item.platform].lastAccessed as string)) {
            platformMap[item.platform].lastAccessed = item.last_accessed;
          }
        });
        
        setPlatformProgress(Object.values(platformMap));
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  if (loading) {
    return <div className="p-4">Loading progress data...</div>;
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'ascenders':
        return 'bg-orange-500';
      case 'neothinkers':
        return 'bg-amber-500';
      case 'immortals':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case 'hub':
        return 'Neothink+ Hub';
      case 'ascenders':
        return 'Ascenders';
      case 'neothinkers':
        return 'Neothinkers';
      case 'immortals':
        return 'Immortals';
      default:
        return platform;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
      
      {platformProgress.length > 0 ? (
        <div className="space-y-8">
          {/* Platform Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platformProgress.map((platform) => (
              <div key={platform.platform} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {getPlatformDisplayName(platform.platform)}
                </h2>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getPlatformColor(platform.platform)}`}
                      style={{ width: `${platform.count > 0 ? (platform.completedCount / platform.count) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {platform.completedCount} of {platform.count} completed
                    ({platform.count > 0 
                      ? Math.round((platform.completedCount / platform.count) * 100) 
                      : 0}%)
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Last activity: {platform.lastAccessed ? new Date(platform.lastAccessed).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {progressData.length > 0 ? (
              <div className="space-y-4">
                {progressData
                  .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.route} {item.subroute ? `/ ${item.subroute}` : ''}</p>
                          <p className="text-sm text-gray-600">{getPlatformDisplayName(item.platform)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{new Date(item.last_accessed).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{new Date(item.last_accessed).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${getPlatformColor(item.platform)}`}
                            style={{ width: `${item.progress?.progress_percent || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p>No recent activity found.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Progress Yet</h2>
          <p className="mb-4">You haven't started your journey yet. Explore the platforms to begin tracking your progress.</p>
          <div className="flex justify-center space-x-4">
            <a href="/discover" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Discover
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 