import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Loading } from '@/components/Loading';

export default function OnboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Welcome to Your Journey</h1>
          <p className="text-xl text-gray-600 mt-2">
            Complete these steps to get started on your path to transformation
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-blue-800">Your Onboarding Progress</h2>
                <p className="text-blue-600 mt-1">2 of 6 steps completed</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-blue-500">
                <span className="text-xl font-bold text-blue-800">33%</span>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full w-1/3"></div>
            </div>
          </div>

          <Suspense fallback={<Loading />}>
            <OnboardingSteps />
          </Suspense>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Explore Other Platforms</h3>
            <p className="text-gray-600 mb-4">
              Your journey extends across multiple platforms, each offering unique insights and tools.
            </p>
            <div className="space-y-3">
              <Link href="/ascenders" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Ascenders Platform</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/neothinkers" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Neothinkers Platform</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/immortals" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Immortals Platform</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Help & Resources</h3>
            <p className="text-gray-600 mb-4">
              Need assistance with your onboarding process? Check out these resources.
            </p>
            <div className="space-y-3">
              <Link href="/help/getting-started" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Getting Started Guide</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/help/faq" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Frequently Asked Questions</span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/help/support" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">Contact Support</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingSteps() {
  // In a real implementation, this would fetch from an API
  const steps = [
    { 
      id: 1, 
      title: 'Create Your Account', 
      description: 'Set up your personal profile and preferences', 
      completed: true,
      link: '/profile'
    },
    { 
      id: 2, 
      title: 'Complete Your Assessment', 
      description: 'Discover your personal strengths, areas for growth, and unique journey path', 
      completed: true,
      link: '/assessment/results'
    },
    { 
      id: 3, 
      title: 'Set Your Goals', 
      description: 'Define what you want to achieve on your transformation journey', 
      completed: false,
      link: '/goals/set'
    },
    { 
      id: 4, 
      title: 'Connect with Mentors', 
      description: 'Find guides who can help you on your path', 
      completed: false,
      link: '/mentors/discover'
    },
    { 
      id: 5, 
      title: 'Join Communities', 
      description: 'Connect with like-minded individuals on similar journeys', 
      completed: false,
      link: '/communities/explore'
    },
    { 
      id: 6, 
      title: 'Schedule First Milestone Review', 
      description: 'Plan your first progress check-in with a guide', 
      completed: false,
      link: '/milestones/schedule'
    }
  ];

  return (
    <div className="divide-y divide-gray-100">
      {steps.map(step => (
        <Link 
          key={step.id}
          href={step.link}
          className="block p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-0.5 ${
              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle size={20} />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <div className="flex-grow">
              <h3 className={`text-lg font-medium ${step.completed ? 'text-green-700' : ''}`}>
                {step.title}
              </h3>
              <p className="text-gray-600 mt-1">{step.description}</p>
            </div>
            <div className="flex-shrink-0 self-center ml-4">
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 