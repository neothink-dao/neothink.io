// TODO: Refactor to use Shadcn/ui Dialog primitives. FeedbackDialog has been removed.

export default function ImmortalsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to Immortals</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your journey to transcendence begins here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Your Protocols</h2>
          <p className="mt-2 text-sm text-gray-600">
            Track your personalized longevity protocols.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Analytics</h2>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your biometric data and progress.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Immortals Network</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect with fellow seekers of transcendence.
          </p>
        </div>
      </div>

      {/* Feedback Button for Continuous Improvement */}
      <div className="flex justify-end mt-8">
      </div>
    </div>
  )
} 