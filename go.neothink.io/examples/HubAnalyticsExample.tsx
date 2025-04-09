'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@neothink/core/auth/hooks';
import { supabase } from '@neothink/core/database/client';
import { 
  usePageView, 
  useContentView, 
  useProgressTracker 
} from '@neothink/analytics/hooks';

type Content = {
  id: string;
  title: string;
  description: string;
  platform: string;
};

export default function HubAnalyticsExample() {
  const { user } = useAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track page view with analytics
  usePageView('hub');
  
  // Set up content tracking
  const trackContent = useContentView();
  
  // Set up progress tracking
  const trackProgress = useProgressTracker();

  // Fetch content items
  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('platform', 'hub')
          .limit(5);
        
        if (error) {
          throw error;
        }
        
        setContent(data || []);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  // Handle content view tracking
  function handleContentView(contentItem: Content) {
    trackContent('hub', {
      content_id: contentItem.id,
      content_title: contentItem.title,
      content_type: 'article',
    });
    
    // Also track progress (simulating user progress)
    trackProgress('hub', {
      content_id: contentItem.id,
      progress_percentage: 100,
      completed: true,
    });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Neothink+ Hub Content</h1>
      
      {!user ? (
        <div>Please log in to view content</div>
      ) : (
        <div className="space-y-4">
          {content.length === 0 ? (
            <div>No content available</div>
          ) : (
            content.map((item) => (
              <div 
                key={item.id} 
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleContentView(item)}
              >
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="mt-2 text-xs text-blue-500">
                  Click to track view and progress
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 