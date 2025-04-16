import Link from 'next/link';
import { CalendarIcon, ClockIcon, BookmarkIcon, ThumbsUpIcon } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  summary: string;
  type: 'article' | 'video' | 'podcast' | 'course';
  source: string;
  date: string;
  readTime?: string;
  watchTime?: string;
  listenTime?: string;
  duration?: string;
  url: string;
  likes: number;
  saves: number;
}

export async function ContentFeed() {
  // In a real implementation, this would fetch data from an API
  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Expanding Your Mental Horizon Through Neothinking',
      summary: 'Learn how to break free from conventional thinking patterns and expand your mental capabilities.',
      type: 'article',
      source: 'Neothinkers',
      date: '2023-06-15',
      readTime: '8 min',
      url: '/neothinkers/articles/expanding-mental-horizons',
      likes: 342,
      saves: 156
    },
    {
      id: '2',
      title: 'The Ascension Process: Key Stepping Stones',
      summary: 'A comprehensive guide to understanding and navigating the essential stepping stones in your ascension journey.',
      type: 'video',
      source: 'Ascenders',
      date: '2023-07-22',
      watchTime: '24 min',
      url: '/ascenders/videos/ascension-stepping-stones',
      likes: 521,
      saves: 289
    },
    {
      id: '3',
      title: 'Project Life: Biological Integration Techniques',
      summary: 'Practical techniques for integrating Project Life principles into your biological systems.',
      type: 'podcast',
      source: 'Immortals',
      date: '2023-08-05',
      listenTime: '45 min',
      url: '/immortals/podcasts/biological-integration',
      likes: 198,
      saves: 132
    },
    {
      id: '4',
      title: 'Flow State: Accessing Peak Consciousness',
      summary: 'Discover techniques to regularly enter flow states and enhance your cognitive performance.',
      type: 'article',
      source: 'Ascenders',
      date: '2023-09-10',
      readTime: '12 min',
      url: '/ascenders/articles/flow-state-techniques',
      likes: 429,
      saves: 253
    },
    {
      id: '5',
      title: 'Mark Hamilton\'s Approach to Self-Leadership',
      summary: 'A deep dive into Mark Hamilton\'s principles of self-leadership and personal autonomy.',
      type: 'course',
      source: 'Neothinkers',
      date: '2023-05-28',
      duration: '5 modules',
      url: '/neothinkers/courses/hamilton-self-leadership',
      likes: 673,
      saves: 412
    }
  ];

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'article':
        return <span className="text-blue-500 font-medium">Article</span>;
      case 'video':
        return <span className="text-red-500 font-medium">Video</span>;
      case 'podcast':
        return <span className="text-purple-500 font-medium">Podcast</span>;
      case 'course':
        return <span className="text-green-500 font-medium">Course</span>;
      default:
        return null;
    }
  };

  const getTimeInfo = (item: ContentItem) => {
    if (item.readTime) return item.readTime;
    if (item.watchTime) return item.watchTime;
    if (item.listenTime) return item.listenTime;
    if (item.duration) return item.duration;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest Content</h2>
        <Link href="/discover/all" className="text-blue-600 hover:text-blue-800">
          View all
        </Link>
      </div>
      
      <div className="space-y-6">
        {contentItems.map(item => (
          <Link 
            key={item.id}
            href={item.url}
            className="block p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getTypeIcon(item.type)}
                <span className="text-gray-400">•</span>
                <span>{item.source}</span>
              </div>
              
              <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">{item.title}</h3>
              
              <p className="text-gray-600">{item.summary}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 pt-2">
                <div className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                
                {getTimeInfo(item) && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center">
                      <ClockIcon size={16} className="mr-1" />
                      <span>{getTimeInfo(item)}</span>
                    </div>
                  </>
                )}
                
                <span className="text-gray-400">•</span>
                
                <div className="flex items-center">
                  <ThumbsUpIcon size={16} className="mr-1" />
                  <span>{item.likes}</span>
                </div>
                
                <div className="flex items-center">
                  <BookmarkIcon size={16} className="mr-1" />
                  <span>{item.saves}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 