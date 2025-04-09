'use client';

import { useEffect, useState } from 'react';
import { getContent } from '@/../lib/content';
import { getUserProgress } from '@/../lib/progress';
import { getEvents } from '@/../lib/events';
import { Content, Event, Progress } from '@/../lib/types';

export default function DashboardPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = 'current-user-id'; // This should be retrieved from auth context
        const platform = 'hub';
        const route = 'dashboard';

        const [contentData, progressData, eventsData] = await Promise.all([
          getContent(platform, route),
          getUserProgress(userId, platform, route),
          getEvents(platform, route)
        ]);

        setContent(contentData);
        setProgress(progressData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        {progress ? (
          <div className="bg-white rounded-lg shadow p-4">
            <p>Progress: {JSON.stringify(progress.progress)}</p>
            <p>Last accessed: {new Date(progress.last_accessed).toLocaleString()}</p>
          </div>
        ) : (
          <p>No progress data available.</p>
        )}
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Content</h2>
        {content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No content available.</p>
        )}
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="mt-2 text-sm">
                  <p>Date: {new Date(event.start_time).toLocaleDateString()}</p>
                  <p>Time: {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>
    </div>
  );
} 