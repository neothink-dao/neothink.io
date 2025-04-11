import { Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, Award, Zap, Clock, CalendarDays, Filter, ChevronDown, ArrowUpRight } from 'lucide-react';

export default function FlowPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Flow Activity</h1>
            <p className="text-lg text-gray-600 mt-2">
              Track your progress and activity across your ascension journey
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              Filter
              <ChevronDown size={14} className="ml-2" />
            </button>
            
            <button className="inline-flex items-center bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
              <Zap size={16} className="mr-2" />
              Log Activity
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 p-4">
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                All Activities
              </button>
              <button className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Insights
              </button>
              <button className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Achievements
              </button>
              <button className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Practices
              </button>
              <button className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Connections
              </button>
            </div>
          </div>
          
          <Suspense fallback={<div className="p-8 text-center">Loading activity feed...</div>}>
            <ActivityFeed />
          </Suspense>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Flow Stats</h2>
              <Link
                href="/flow/stats"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm font-medium"
              >
                Details <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Flow sessions this week</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Average flow duration</span>
                  <span className="font-medium">45 min</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Flow consistency</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Insights</h2>
              <Link
                href="/flow/insights"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm font-medium"
              >
                View all <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentInsights.map(insight => (
                <Link 
                  key={insight.id} 
                  href={`/insights/${insight.id}`}
                  className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <BookOpen className="text-green-600" size={16} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.source}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Activities</h2>
              <Link
                href="/flow/schedule"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm font-medium"
              >
                Calendar <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingActivities.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <CalendarDays className="text-blue-600" size={16} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{activity.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock size={12} className="mr-1" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  // In a real implementation, this would fetch from an API
  return (
    <div className="divide-y divide-gray-100">
      {flowActivities.map(activity => (
        <div key={activity.id} className="p-6">
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              activity.type === 'insight' ? 'bg-green-100' : 
              activity.type === 'achievement' ? 'bg-purple-100' : 
              activity.type === 'practice' ? 'bg-orange-100' :
              activity.type === 'connection' ? 'bg-indigo-100' : 'bg-blue-100'
            }`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                  <Clock size={14} className="mr-1" />
                  <span>{activity.time}</span>
                </div>
              </div>
              
              {activity.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {activity.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {activity.link && (
                <div className="mt-3">
                  <Link
                    href={activity.link}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                  >
                    View details <ArrowUpRight size={14} className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Mock data
const flowActivities = [
  {
    id: 1,
    type: 'insight',
    title: 'Discovered "Mind-Body Integration" insight',
    description: 'You recognized the connection between physical states and flow consciousness.',
    time: '10 minutes ago',
    tags: ['Integration', 'Consciousness', 'Physical'],
    link: '/insights/mind-body-integration'
  },
  {
    id: 2,
    type: 'practice',
    title: 'Completed "Flow State Preparation" session',
    description: 'You practiced the preparation routine for 30 minutes with excellent focus.',
    time: '2 hours ago',
    tags: ['Practice', 'Flow State', 'Preparation'],
    link: '/practices/flow-preparation'
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Unlocked "Flow Consistency" badge',
    description: 'Maintained daily flow practices for 7 consecutive days.',
    time: '1 day ago',
    tags: ['Achievement', 'Consistency', 'Milestone'],
    link: '/achievements/flow-consistency'
  },
  {
    id: 4,
    type: 'connection',
    title: 'Connected with mentor David L.',
    description: 'Had a 1-hour mentoring session focusing on advanced flow techniques.',
    time: '2 days ago',
    tags: ['Mentoring', 'Connection', 'Techniques'],
    link: '/connections/mentoring-session-david'
  },
  {
    id: 5,
    type: 'insight',
    title: 'Documented "Intuitive Decision Making" insight',
    description: 'You recognized patterns in how intuition guides decision-making during flow states.',
    time: '3 days ago',
    tags: ['Insight', 'Intuition', 'Decision-Making'],
    link: '/insights/intuitive-decision-making'
  }
];

const recentInsights = [
  {
    id: 1,
    title: 'Time Dilation in Deep Flow',
    source: 'From "Advanced Flow" course'
  },
  {
    id: 2,
    title: 'The Boundary of Self in Flow',
    source: 'Personal reflection'
  },
  {
    id: 3,
    title: 'Neurochemistry of Flow States',
    source: 'Research synthesis'
  }
];

const upcomingActivities = [
  {
    id: 1,
    title: 'Morning Flow Practice',
    time: 'Tomorrow, 7:00 AM'
  },
  {
    id: 2,
    title: 'Mentor Session with Sarah',
    time: 'Wed, 2:00 PM'
  },
  {
    id: 3,
    title: 'Flow Community Gathering',
    time: 'Fri, 6:30 PM'
  }
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'insight':
      return <BookOpen className="text-green-600" size={18} />;
    case 'achievement':
      return <Award className="text-purple-600" size={18} />;
    case 'practice':
      return <Clock className="text-orange-600" size={18} />;
    case 'connection':
      return <Zap className="text-indigo-600" size={18} />;
    default:
      return <Zap className="text-blue-600" size={18} />;
  }
} 