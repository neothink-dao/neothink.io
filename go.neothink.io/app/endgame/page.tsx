'use client';

import React from 'react';
import { useUserProgress } from '@neothink/hooks';
import { analytics } from '@neothink/analytics';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '@neothink/ui/components/ErrorBoundary';

/**
 * Endgame page for the Hub platform
 * This page is initially hidden (not accessible or visible in navigation) until week 4
 * 
 * See DEVELOPMENT.md for details on the user progress system
 */
export default function EndgamePage() {
  const router = useRouter();
  const { checkFeatureStatus, weekNumber } = useUserProgress('hub');
  const endgameStatus = checkFeatureStatus('endgame');
  
  // Track the page view
  React.useEffect(() => {
    analytics.page('hub', '/endgame');
    
    // If the feature is hidden, redirect to 404
    if (endgameStatus === 'hidden') {
      router.push('/not-found');
    }
  }, [endgameStatus, router]);

  // Return null during the redirect to prevent flash of content
  if (endgameStatus === 'hidden') {
    return null;
  }

  return (
    <ErrorBoundary fallbackText="There was an error loading the endgame content">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Endgame</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Mastery and Transformation</h2>
            
            <div className="prose max-w-none">
              <p>
                Congratulations on reaching Week {weekNumber} of your Neothink journey!
                You've now unlocked the Endgame section - the culmination of your
                hard work and dedication to personal growth.
              </p>
              
              <h3>What is the Endgame?</h3>
              <p>
                The Endgame represents the synthesis of everything you've learned
                throughout your journey. It's where theory meets practice, where concepts
                become deeply integrated into your way of being, and where true transformation
                occurs.
              </p>
              
              <div className="bg-indigo-50 p-6 rounded-lg my-6">
                <h4 className="font-semibold text-lg mb-2">Your Endgame Experience Includes:</h4>
                <ul>
                  <li>Advanced integration sessions with master mentors</li>
                  <li>Deep-dive workshops on specialized topics</li>
                  <li>Personal breakthrough experiences</li>
                  <li>Community leadership opportunities</li>
                  <li>Ongoing support for lifelong growth</li>
                </ul>
              </div>
              
              <h3>This Month's Focus Areas</h3>
              <p>
                During the Endgame phase, you'll work on integrating all aspects of
                the Neothink methodology into a cohesive whole. You'll also have the
                opportunity to specialize in areas that resonate most deeply with you.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div 
                  className="bg-indigo-100 p-6 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                  onClick={() => analytics.trackContentInteraction('hub', 'integration-workshops', 'click')}
                >
                  <h4 className="font-semibold mb-2">Integration Workshops</h4>
                  <p className="text-sm">Weekly sessions focused on synthesizing all aspects of your learning journey.</p>
                </div>
                
                <div 
                  className="bg-indigo-100 p-6 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                  onClick={() => analytics.trackContentInteraction('hub', 'mastery-path', 'click')}
                >
                  <h4 className="font-semibold mb-2">Mastery Path</h4>
                  <p className="text-sm">Specialized tracks for developing expertise in your chosen areas of focus.</p>
                </div>
                
                <div 
                  className="bg-indigo-100 p-6 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                  onClick={() => analytics.trackContentInteraction('hub', 'breakthrough-experiences', 'click')}
                >
                  <h4 className="font-semibold mb-2">Breakthrough Experiences</h4>
                  <p className="text-sm">Immersive experiences designed to create profound shifts in consciousness.</p>
                </div>
                
                <div 
                  className="bg-indigo-100 p-6 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                  onClick={() => analytics.trackContentInteraction('hub', 'leadership-council', 'click')}
                >
                  <h4 className="font-semibold mb-2">Leadership Council</h4>
                  <p className="text-sm">Opportunities to mentor others and contribute to the growth of the community.</p>
                </div>
              </div>
              
              <p>
                The Endgame is not truly an end, but rather a new beginning. It marks
                your transition from student to master, from seeker to guide. As you
                continue to grow and evolve, you'll discover that the journey never
                truly ends - it simply transforms into something even more profound.
              </p>
              
              <div 
                className="bg-gray-50 p-6 rounded-lg my-6 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => analytics.trackContentInteraction('hub', 'endgame-schedule', 'click')}
              >
                <h4 className="font-semibold text-lg mb-2">Ready to Begin Your Endgame Journey?</h4>
                <p className="mb-4">
                  Schedule your first Integration Session with a Master Mentor to create
                  your personalized Endgame plan.
                </p>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 