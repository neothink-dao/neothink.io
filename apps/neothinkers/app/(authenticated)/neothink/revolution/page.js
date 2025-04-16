import { createClient } from '@neothink/auth';
export default async function RevolutionPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return (<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Revolutionary Thinking
        </h1>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="prose max-w-none">
            <h2>Understanding the Revolution</h2>
            <p>
              Welcome {user === null || user === void 0 ? void 0 : user.email} to your revolutionary thinking journey. Explore the fundamental concepts that will transform your perspective.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Phase 1: Understanding</h3>
                <p className="text-gray-600">Master the foundational concepts</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Phase 2: Application</h3>
                <p className="text-gray-600">Apply concepts in real scenarios</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Phase 3: Mastery</h3>
                <p className="text-gray-600">Achieve breakthrough results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map