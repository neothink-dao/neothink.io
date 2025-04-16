import Link from 'next/link';
import { createClient } from '../../../lib/supabase';
import { signOut } from '../../../app/auth/actions';
export default async function NeothinkerDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return (<div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user === null || user === void 0 ? void 0 : user.email}</h1>
          <form action={signOut}>
            <button type="submit" className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Neothink Section */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Neothink</h2>
            <p className="mt-2 text-gray-600">Access your knowledge journey</p>
            <div className="mt-4 space-y-2">
              <Link href="/neothink/revolution" className="block text-indigo-600 hover:underline">
                Revolution
              </Link>
              <Link href="/neothink/fellowship" className="block text-indigo-600 hover:underline">
                Fellowship
              </Link>
              <Link href="/neothink/movement" className="block text-indigo-600 hover:underline">
                Movement
              </Link>
              <Link href="/neothink/command" className="block text-indigo-600 hover:underline">
                Command
              </Link>
            </div>
          </div>

          {/* Mark Hamilton Section */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Mark Hamilton</h2>
            <p className="mt-2 text-gray-600">Explore teachings and insights</p>
            <div className="mt-4">
              <Link href="/mark-hamilton" className="text-indigo-600 hover:underline">
                View Resources
              </Link>
            </div>
          </div>

          {/* Community Section */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Neothinkers</h2>
            <p className="mt-2 text-gray-600">Connect with the community</p>
            <div className="mt-4">
              <Link href="/neothinkers" className="text-indigo-600 hover:underline">
                Join Discussion
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-1/3 rounded-full bg-indigo-600"></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              You're making great progress! Continue your journey to unlock more insights.
            </p>
          </div>
        </div>
      </main>
    </div>);
}
//# sourceMappingURL=page.js.map