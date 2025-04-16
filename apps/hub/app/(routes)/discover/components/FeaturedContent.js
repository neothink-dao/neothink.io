import Link from 'next/link';
export async function FeaturedContent() {
    // In a real implementation, this would fetch data from an API
    const featuredItems = [
        {
            id: '1',
            title: 'The Path to Neo-Thinking: Core Principles',
            description: 'Discover the fundamental concepts that drive personal transformation through Neo-Thinking.',
            image: '/images/featured-neothinking.jpg',
            category: 'Neo-Think',
            source: 'Neothinkers',
            url: '/neothinkers/articles/neo-thinking-principles'
        },
        {
            id: '2',
            title: 'Ascension Progress: Major Milestones',
            description: 'Learn about the key milestones on your ascension journey and how to recognize them.',
            image: '/images/featured-ascension.jpg',
            category: 'Ascension',
            source: 'Ascenders',
            url: '/ascenders/guides/ascension-milestones'
        },
        {
            id: '3',
            title: 'Project Life: Integration with Daily Routines',
            description: 'Practical ways to integrate Project Life principles into your everyday activities.',
            image: '/images/featured-projectlife.jpg',
            category: 'Immortality',
            source: 'Immortals',
            url: '/immortals/practices/daily-integration'
        }
    ];
    return (<div className="space-y-6">
      <h2 className="text-2xl font-bold">Featured Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredItems.map(item => (<Link key={item.id} href={item.url} className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>
              {/* Uncomment when you have actual images
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
            */}
            </div>
            <div className="p-4">
              <div className="flex items-center text-sm mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{item.category}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{item.source}</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="mt-2 text-gray-600 line-clamp-2">{item.description}</p>
            </div>
          </Link>))}
      </div>
    </div>);
}
//# sourceMappingURL=FeaturedContent.js.map