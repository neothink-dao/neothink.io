import { Suspense } from 'react';
import { getContent } from '../../../lib/content';
import { createServerComponent } from '../../../lib/supabase/auth-server';
import { updateUserProgress } from '../../../lib/progress';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  const supabase = createServerComponent('hub');
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  // If we have a logged in user, update their progress for this route
  if (userId) {
    await updateUserProgress(userId, 'hub', 'discover', { 
      visited: true, 
      percent: 10,
      last_visit: new Date().toISOString()
    });
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Neothink</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading content...</div>}>
            <DiscoverContent />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Platforms</h2>
            <div className="space-y-3">
              <PlatformCard 
                title="Ascenders" 
                description="Ascend to higher consciousness and capabilities"
                href="https://www.joinascenders.org"
                color="bg-emerald-100 dark:bg-emerald-900"
              />
              
              <PlatformCard 
                title="Neothinkers" 
                description="Explore the Neothink integrated thinking system"
                href="https://www.joinneothinkers.org"
                color="bg-blue-100 dark:bg-blue-900"
              />
              
              <PlatformCard 
                title="Immortals" 
                description="Join the movement toward biological immortality"
                href="https://www.joinimmortals.org"
                color="bg-purple-100 dark:bg-purple-900"
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/progress" className="text-blue-600 dark:text-blue-400 hover:underline">
                  My Progress
                </a>
              </li>
              <li>
                <a href="/onboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Onboarding
                </a>
              </li>
              <li>
                <a href="/endgame" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Endgame
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ 
  title, 
  description, 
  href, 
  color
}: { 
  title: string; 
  description: string; 
  href: string;
  color: string;
}) {
  return (
    <a 
      href={href} 
      className={`block p-4 rounded-lg ${color} transition-transform hover:scale-[1.02]`}
    >
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm mt-1">{description}</p>
    </a>
  );
}

async function DiscoverContent() {
  const content = await getContent('hub', 'discover');
  
  return (
    <div className="space-y-8">
      {content.length > 0 ? (
        content.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        ))
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Welcome to Neothink</h2>
          <div className="prose dark:prose-invert">
            <p>
              Neothink is a comprehensive system of integrated thinking that empowers
              individuals to break free from mysticism and static dogma, 
              and embrace a dynamic, rational approach to life.
            </p>
            <p>
              Through the Neothink Hub, you can access all the platforms in the
              Neothink ecosystem, including Ascenders, Neothinkers, and Immortals.
            </p>
            <p>
              To get started, explore the platforms listed on this page, or check
              your dashboard for personalized content and recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 