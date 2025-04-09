import { Suspense } from 'react';
import { getContent } from '../../../lib/content';
import { getUserProgress } from '../../../lib/progress';
import { createServerComponent } from '../../../lib/supabase/auth-server';
import { isFeatureEnabled } from '../../../lib/feature-flags';
import { getEvents } from '../../../lib/events';
import { getForumTopics } from '../../../lib/community';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponent('hub');
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Neothink Hub Dashboard</h1>
      
      {userId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div>Loading content...</div>}>
            <DashboardContent userId={userId} />
          </Suspense>
          
          <Suspense fallback={<div>Loading progress...</div>}>
            <UserProgressSection userId={userId} />
          </Suspense>
          
          <Suspense fallback={<div>Loading events...</div>}>
            <EventsSection userId={userId} />
          </Suspense>
          
          <Suspense fallback={<div>Loading topics...</div>}>
            <TopicsSection userId={userId} />
          </Suspense>
        </div>
      ) : (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded shadow-sm">
          <p>Please sign in to view your personalized dashboard.</p>
        </div>
      )}
    </div>
  );
}

async function DashboardContent({ userId }: { userId: string }) {
  const content = await getContent('hub', 'dashboard');
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Latest Content</h2>
      {content.length > 0 ? (
        <div className="space-y-4">
          {content.map((item) => (
            <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {item.content.substring(0, 150)}...
              </p>
              <div className="mt-2">
                <a 
                  href={`/content/${item.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No content available.</p>
      )}
    </div>
  );
}

async function UserProgressSection({ userId }: { userId: string }) {
  const progress = await getUserProgress(userId, 'hub', 'dashboard');
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>
      {progress ? (
        <div>
          <div className="mb-2">
            <span className="text-gray-600 dark:text-gray-300">Last accessed:</span>
            <span className="ml-2 font-medium">
              {new Date(progress.last_accessed).toLocaleDateString()}
            </span>
          </div>
          {/* Visualize progress based on progress.progress data */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress.progress.percent || 0}%` }}
              ></div>
            </div>
            <div className="text-right mt-1 text-sm text-gray-500 dark:text-gray-400">
              {progress.progress.percent || 0}% Complete
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No progress data available.</p>
      )}
    </div>
  );
}

async function EventsSection({ userId }: { userId: string }) {
  // Only show if events are enabled
  if (!isFeatureEnabled('hub', 'events_enabled')) {
    return null;
  }
  
  const events = await getEvents('hub', 'dashboard');
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
              </p>
              <div className="mt-2">
                <a 
                  href={`/events/${event.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  View details
                </a>
              </div>
            </div>
          ))}
          {events.length > 3 && (
            <div className="mt-2 text-center">
              <a 
                href="/events"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all {events.length} events
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No upcoming events.</p>
      )}
    </div>
  );
}

async function TopicsSection({ userId }: { userId: string }) {
  // Only show if forums are enabled
  if (!isFeatureEnabled('hub', 'community_forums_enabled')) {
    return null;
  }
  
  const topics = await getForumTopics('hub', 'dashboard');
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Community Topics</h2>
      {topics.length > 0 ? (
        <div className="space-y-4">
          {topics.slice(0, 3).map((topic) => (
            <div key={topic.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <h3 className="text-lg font-semibold">{topic.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm line-clamp-2">
                {topic.description}
              </p>
              <div className="mt-2">
                <a 
                  href={`/community/topics/${topic.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Join discussion
                </a>
              </div>
            </div>
          ))}
          {topics.length > 3 && (
            <div className="mt-2 text-center">
              <a 
                href="/community"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all {topics.length} topics
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No community topics.</p>
      )}
    </div>
  );
} 