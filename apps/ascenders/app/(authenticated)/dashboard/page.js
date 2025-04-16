import { FeedbackDialog } from '@neothink/ui/components/feedback/FeedbackDialog';
export default function AscendersDashboard() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to Ascenders</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your journey to higher consciousness begins here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Your Progress</h2>
          <p className="mt-2 text-sm text-gray-600">
            Track your ascension journey and milestones.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Latest Courses</h2>
          <p className="mt-2 text-sm text-gray-600">
            Continue your learning path.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Community</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect with fellow Ascenders.
          </p>
        </div>
      </div>

      {/* Feedback Button for Continuous Improvement */}
      <div className="flex justify-end mt-8">
        {/* @ts-expect-error Async Server Component import workaround */}
        <FeedbackDialog />
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map