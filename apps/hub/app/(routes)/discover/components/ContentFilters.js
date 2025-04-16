'use client';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
const contentTypes = [
    { id: 'all', label: 'All' },
    { id: 'articles', label: 'Articles' },
    { id: 'videos', label: 'Videos' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'courses', label: 'Courses' }
];
const sources = [
    { id: 'all', label: 'All Platforms' },
    { id: 'neothinkers', label: 'Neothinkers' },
    { id: 'ascenders', label: 'Ascenders' },
    { id: 'immortals', label: 'Immortals' }
];
const sortOptions = [
    { id: 'newest', label: 'Newest' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'trending', label: 'Trending' },
    { id: 'relevant', label: 'Most Relevant' }
];
export function ContentFilters() {
    const [selectedContentType, setSelectedContentType] = useState('all');
    const [selectedSource, setSelectedSource] = useState('all');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    return (<div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {contentTypes.map(type => (<button key={type.id} onClick={() => setSelectedContentType(type.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedContentType === type.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              {type.label}
            </button>))}
        </div>
        
        <button onClick={() => setShowMoreFilters(!showMoreFilters)} className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600">
          <SlidersHorizontal size={16}/>
          <span>Filters</span>
        </button>
      </div>
      
      {showMoreFilters && (<div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <div className="flex flex-wrap gap-2">
              {sources.map(source => (<button key={source.id} onClick={() => setSelectedSource(source.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedSource === source.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {source.label}
                </button>))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (<button key={option.id} onClick={() => setSelectedSort(option.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedSort === option.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {option.label}
                </button>))}
            </div>
          </div>
        </div>)}
    </div>);
}
//# sourceMappingURL=ContentFilters.js.map