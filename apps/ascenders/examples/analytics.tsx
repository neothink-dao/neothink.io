import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from '@neothink/core';

/**
 * Example component demonstrating how to fetch analytics data for Ascenders platform
 * Respects Row Level Security policies:
 * - Only authenticated Ascenders users can view this data
 * - Admin users (guardians) can view all analytics data
 * 
 * Supabase Launch Week 14 features used:
 * - Read replica routing: Analytics queries are automatically routed to read replicas
 *   for better performance without code changes
 * - Connection pooling: Handles multiple concurrent users efficiently
 */
export default function AscendersAnalytics() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client using the core package
  const supabase = createClient();

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true);
        
        // Fetch analytics events for Ascenders platform only
        // RLS automatically applies - users can only see events they have access to
        const { data, error } = await supabase
          .from('analytics_events')
          .select('*')
          .eq('platform', 'ascenders')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setEvents(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, []);

  const recordAnalyticsEvent = async () => {
    try {
      // Insert a new analytics event
      // RLS ensures users can only insert events where user_id matches their auth.uid
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_name: 'example_event',
          platform: 'ascenders',
          properties: { source: 'example_component', action: 'button_click' }
        });
        
      if (error) throw error;
      
      // Refresh the list
      const { data, error: fetchError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('platform', 'ascenders')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (fetchError) throw fetchError;
      
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error recording event:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ascenders Analytics</h2>
      
      <Button onClick={recordAnalyticsEvent}>
        Record New Analytics Event
      </Button>
      
      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading analytics data...</p>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Analytics Events</h3>
          
          {events.length === 0 ? (
            <p>No analytics events found.</p>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <p><strong>Event:</strong> {event.event_name}</p>
                  <p><strong>Time:</strong> {new Date(event.created_at).toLocaleString()}</p>
                  <p><strong>Properties:</strong> {JSON.stringify(event.properties)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 