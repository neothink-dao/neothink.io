'use client';

import { useEffect, useState } from 'react';
import { getContent } from '@/../lib/content';
import { Content } from '@/../lib/types';

export default function EndgamePage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEndgameContent() {
      try {
        const platform = 'hub';
        const route = 'endgame';
        const contentData = await getContent(platform, route);
        setContent(contentData);
      } catch (error) {
        console.error('Error fetching endgame content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEndgameContent();
  }, []);

  if (loading) {
    return <div className="p-4">Loading endgame content...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Endgame</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Journey to Mastery</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-3">The Ultimate Vision</h3>
              <p className="text-gray-700 mb-4">
                The Neothink Endgame represents the culmination of your journey across all platforms,
                bringing together the knowledge and skills you've acquired from Ascenders, Neothinkers,
                and Immortals to achieve full-spectrum success.
              </p>
              <p className="text-gray-700">
                This is where prosperity, happiness, and longevity merge into a unified strategy for
                achieving your highest potential.
              </p>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-3">Your Path Forward</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">1</div>
                  <p>Master Prosperity Principles (Ascenders)</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white mr-3">2</div>
                  <p>Develop Integrated Thinking (Neothinkers)</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white mr-3">3</div>
                  <p>Optimize Health & Longevity (Immortals)</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">4</div>
                  <p>Synthesize for Complete Integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {content.length > 0 ? (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Endgame Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Access Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Your Endgame Journey Awaits</h2>
          <p className="mb-6">
            Continue your progress through the Ascenders, Neothinkers, and Immortals platforms to unlock your personalized endgame strategy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/ascenders" 
              className="p-4 bg-orange-100 border border-orange-200 rounded-lg text-center hover:bg-orange-200 transition"
            >
              <h3 className="font-medium mb-2">Ascenders</h3>
              <p className="text-sm">Master prosperity principles</p>
            </a>
            <a 
              href="/neothinkers" 
              className="p-4 bg-amber-100 border border-amber-200 rounded-lg text-center hover:bg-amber-200 transition"
            >
              <h3 className="font-medium mb-2">Neothinkers</h3>
              <p className="text-sm">Develop integrated thinking</p>
            </a>
            <a 
              href="/immortals" 
              className="p-4 bg-red-100 border border-red-200 rounded-lg text-center hover:bg-red-200 transition"
            >
              <h3 className="font-medium mb-2">Immortals</h3>
              <p className="text-sm">Optimize health & longevity</p>
            </a>
          </div>
        </section>
      )}
    </div>
  );
} 