'use client';

import React from 'react';
import { useUserProgress } from '@neothink/hooks';
import { analytics } from '@neothink/analytics';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '@neothink/ui/components/ErrorBoundary';

/**
 * Progress page for the Hub platform
 * This page is initially hidden (not accessible or visible in navigation) until week 3
 * 
 * See DEVELOPMENT.md for details on the user progress system
 */
export default function ProgressPage() {
  const router = useRouter();
  const { checkFeatureStatus, weekNumber } = useUserProgress('hub');
  const progressStatus = checkFeatureStatus('progress');
  
  // Track the page view
  React.useEffect(() => {
    analytics.page('hub', '/progress');
    
    // If the feature is hidden, redirect to 404
    if (progressStatus === 'hidden') {
      router.push('/not-found');
    }
  }, [progressStatus, router]);

  // Return null during the redirect to prevent flash of content
  if (progressStatus === 'hidden') {
    return null;
  }

  return (
    <ErrorBoundary fallbackText="There was an error loading your progress data">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Your Progress</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Track Your Journey</h2>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Current Week</span>
                <span className="text-indigo-600 font-bold">Week {weekNumber}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min((weekNumber / 4) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ProgressCard 
                title="Core Concepts"
                completedItems={3}
                totalItems={5}
                onClick={() => analytics.trackContentInteraction('hub', 'progress-concepts', 'click')}
              />
              
              <ProgressCard 
                title="Practical Applications"
                completedItems={2}
                totalItems={7}
                onClick={() => analytics.trackContentInteraction('hub', 'progress-applications', 'click')}
              />
              
              <ProgressCard 
                title="Community Engagement"
                completedItems={1}
                totalItems={3}
                onClick={() => analytics.trackContentInteraction('hub', 'progress-community', 'click')}
              />
              
              <ProgressCard 
                title="Personal Growth"
                completedItems={4}
                totalItems={10}
                onClick={() => analytics.trackContentInteraction('hub', 'progress-growth', 'click')}
              />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Recent Achievements</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 mt-0.5 mr-3"></div>
                  <div>
                    <p className="font-medium">Completed Core Concept Module 3</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 mt-0.5 mr-3"></div>
                  <div>
                    <p className="font-medium">First Community Discussion</p>
                    <p className="text-sm text-gray-500">5 days ago</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 mt-0.5 mr-3"></div>
                  <div>
                    <p className="font-medium">Completed Personal Assessment</p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

function ProgressCard({ 
  title, 
  completedItems, 
  totalItems, 
  onClick 
}: { 
  title: string; 
  completedItems: number; 
  totalItems: number;
  onClick?: () => void;
}) {
  const percentage = Math.round((completedItems / totalItems) * 100);
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-semibold mb-3">{title}</h3>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{completedItems} of {totalItems} complete</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
} 