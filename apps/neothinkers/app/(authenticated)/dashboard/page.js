import { FeedbackDialog } from '@neothink/ui/components/feedback/FeedbackDialog';
export default function NeothinkersDashboard() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to Neothinkers</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your journey of intellectual exploration begins here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Your Library</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your curated collection of knowledge.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Active Discussions</h2>
          <p className="mt-2 text-sm text-gray-600">
            Engage in intellectual discourse.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Research Projects</h2>
          <p className="mt-2 text-sm text-gray-600">
            Track your ongoing investigations.
          </p>
        </div>
      </div>

      {/* Feedback Button for Continuous Improvement */}
      <div className="flex justify-end mt-8">
        <FeedbackDialog />
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map