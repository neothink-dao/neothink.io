import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from '@neothink/core';

/**
 * Example component demonstrating how to fetch Neothinkers-specific content
 * Respects Row Level Security policies:
 * - Only users with Neothinkers platform access can view this content
 * - Admin users (guardians) can view all content across platforms
 * 
 * Supabase Launch Week 14 features used:
 * - Connection pooling: Automatically manages database connections efficiently
 * - Read Replica Routing: Queries are sent to read replicas for better performance
 */
export default function NeothinkersContent() {
  const [content, setContent] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client using the core package
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch content specific to the Neothinkers platform
        // RLS will automatically restrict access based on platform access
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('platform', 'neothinkers')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (contentError) throw contentError;
        
        setContent(contentData || []);
        
        // Get the current user's Neothinkers profile
        // This will only work if the user has access to the platform
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('neothinkers_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" - this is fine, user might not have a profile
            throw profileError;
          }
          
          setProfileData(profileData || null);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Log an analytics event when content is viewed
  async function logContentView(contentId: string) {
    try {
      // Insert analytics event - platform access check happens automatically via RLS
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_name: 'content_viewed',
          platform: 'neothinkers',
          properties: { content_id: contentId, source: 'content_example' }
        });
        
      if (error) throw error;
      
      alert('Analytics event logged successfully!');
    } catch (err: any) {
      setError(err.message);
      console.error('Error logging analytics event:', err);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Neothinkers Content</h2>
      
      {profileData && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold">Your Neothinkers Profile</h3>
            <p><strong>Display Name:</strong> {profileData.display_name || 'Not set'}</p>
            <p><strong>Level:</strong> {profileData.level || 1}</p>
            <p><strong>Bio:</strong> {profileData.bio || 'No bio provided'}</p>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading Neothinkers content...</p>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Neothinkers Content</h3>
          
          {content.length === 0 ? (
            <p>No content found. You may not have access to Neothinkers content.</p>
          ) : (
            content.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <h4 className="text-lg font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-2">{item.content || 'No content available'}</p>
                  
                  <Button 
                    className="mt-4" 
                    variant="outline" 
                    onClick={() => logContentView(item.id)}
                  >
                    Log View
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 