import Link from 'next/link';
import { TrendingUpIcon, StarIcon, LightbulbIcon } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  type: 'trending' | 'recommended' | 'insight';
  source: string;
  url: string;
}

export async function Recommendations() {
  // In a real implementation, this would fetch data from an API
  const recommendedItems: Recommendation[] = [
    {
      id: '1',
      title: 'The New Evolution: Transcending Human Limitations',
      type: 'trending',
      source: 'Immortals',
      url: '/immortals/articles/new-evolution'
    },
    {
      id: '2',
      title: 'Unlocking Your Inner Genius Through Neothinking',
      type: 'recommended',
      source: 'Neothinkers',
      url: '/neothinkers/courses/inner-genius'
    },
    {
      id: '3',
      title: 'Ascension: Breaking Through to Higher Consciousness',
      type: 'insight',
      source: 'Ascenders',
      url: '/ascenders/insights/higher-consciousness'
    },
    {
      id: '4',
      title: 'The Immortality Mindset: Daily Practices',
      type: 'trending',
      source: 'Immortals',
      url: '/immortals/practices/daily-mindset'
    },
    {
      id: '5',
      title: 'Mark Hamilton\'s Vision for Global Transformation',
      type: 'recommended',
      source: 'Neothinkers',
      url: '/neothinkers/articles/hamilton-global-vision'
    },
    {
      id: '6',
      title: 'Flow State: The Gateway to Accelerated Growth',
      type: 'insight',
      source: 'Ascenders',
      url: '/ascenders/videos/flow-state-gateway'
    },
    {
      id: '7',
      title: 'Project Life: Scientific Breakthroughs',
      type: 'trending',
      source: 'Immortals',
      url: '/immortals/research/scientific-breakthroughs'
    }
  ];

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUpIcon size={16} className="text-red-500" />;
      case 'recommended':
        return <StarIcon size={16} className="text-yellow-500" />;
      case 'insight':
        return <LightbulbIcon size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">For You</h2>
      <div className="bg-gray-50 rounded-lg p-5 space-y-5">
        {recommendedItems.map(item => (
          <Link 
            key={item.id}
            href={item.url}
            className="block bg-white p-4 rounded border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getTypeIcon(item.type)}
              </div>
              <div>
                <h3 className="font-medium hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.source}</p>
              </div>
            </div>
          </Link>
        ))}
        
        <Link 
          href="/discover/recommendations" 
          className="block text-center text-blue-600 hover:text-blue-800 font-medium"
        >
          See all recommendations
        </Link>
      </div>
    </div>
  );
} 