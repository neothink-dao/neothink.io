'use client';

import { useEffect, useState } from 'react';
import { getContent } from '@/../lib/content';
import { Content } from '@/../lib/types';

export default function DiscoverPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const platform = 'hub';
        const route = 'discover';
        const contentData = await getContent(platform, route);
        setContent(contentData);
      } catch (error) {
        console.error('Error fetching discover content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) {
    return <div className="p-4">Loading discover content...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.length > 0 ? (
          content.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600">{item.content}</p>
                
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <p>No discover content available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
} 