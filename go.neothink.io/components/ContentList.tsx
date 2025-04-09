'use client';

import { useState } from 'react';
import { useContentView, useProgressTracker } from '@neothink/analytics';
import { Button } from '@neothink/ui/components/Button';

/**
 * Content item type from the database
 */
type Content = {
  id: string;
  title: string;
  description: string;
  platform: string;
  image_url?: string;
  created_at: string;
};

interface ContentListProps {
  items: Content[];
  platform: string;
}

/**
 * Component for displaying a list of content items with tracking
 * 
 * @see SUPABASE.md - Analytics tracking implementation
 */
export function ContentList({ items, platform }: ContentListProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Set up content tracking
  const trackContent = useContentView();
  
  // Set up progress tracking
  const trackProgress = useProgressTracker();

  // Handle content view tracking
  function handleContentView(contentItem: Content) {
    // Track the content view
    trackContent(platform, {
      content_id: contentItem.id,
      content_title: contentItem.title,
      content_type: 'article',
    });
    
    // Update expanded item state
    setExpandedItem(expandedItem === contentItem.id ? null : contentItem.id);
  }

  // Handle marking content as complete
  function handleMarkComplete(contentItem: Content) {
    trackProgress(platform, {
      content_id: contentItem.id,
      progress_percentage: 100,
      completed: true,
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No content available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => handleContentView(item)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <span className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          
          {expandedItem === item.id && (
            <div className="p-4 border-t border-gray-100">
              <p className="text-sm mb-4">
                This is the expanded content for {item.title}. In a production app, this would contain the full content or additional details.
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExpandedItem(null)}
                >
                  Close
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleMarkComplete(item)}
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 