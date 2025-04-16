import { LoadingState } from '@neothink/ui'
import { Suspense } from 'react'

function DiscoverContent() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Discover Your Journey
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Neothinkers</h2>
          <p className="text-gray-600 mb-4">
            Begin your journey with revolutionary thinking and personal growth.
          </p>
          <a
            href="https://neothinkers.neothink.com"
            className="text-black hover:text-gray-800 font-medium"
          >
            Learn more →
          </a>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Ascenders</h2>
          <p className="text-gray-600 mb-4">
            Take your next step in mastering advanced concepts and leadership.
          </p>
          <a
            href="https://ascenders.neothink.com"
            className="text-black hover:text-gray-800 font-medium"
          >
            Learn more →
          </a>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Immortals</h2>
          <p className="text-gray-600 mb-4">
            Join the highest level of achievement and legacy creation.
          </p>
          <a
            href="https://immortals.neothink.com"
            className="text-black hover:text-gray-800 font-medium"
          >
            Learn more →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading discover page..." />}>
      <DiscoverContent />
    </Suspense>
  )
} 