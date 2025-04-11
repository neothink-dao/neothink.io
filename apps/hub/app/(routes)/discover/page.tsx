import { Suspense } from 'react';
import { FeaturedContent } from './components/FeaturedContent';
import { ContentFeed } from './components/ContentFeed';
import { Recommendations } from './components/Recommendations';
import { ContentFilters } from './components/ContentFilters';
import { SearchBar } from '@/components/SearchBar';
import { Loading } from '@/components/Loading';

export default async function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold">Discover</h1>
          <p className="text-xl text-gray-600">
            Explore insights, breakthroughs, and wisdom from all platforms
          </p>
          <SearchBar className="w-full max-w-2xl" />
        </div>

        <ContentFilters />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Suspense fallback={<Loading />}>
              <FeaturedContent />
            </Suspense>

            <div className="mt-8">
              <Suspense fallback={<Loading />}>
                <ContentFeed />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-4">
            <Suspense fallback={<Loading />}>
              <Recommendations />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 