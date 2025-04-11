import Link from 'next/link';
import { LineChart, ArrowUpRight, BookOpen, Award, BarChart3, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function AscenderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">Your Ascender Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Track your ascension journey and growth milestones
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center">
              <div className="mr-3">
                <LineChart className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-blue-700 font-medium">Current Level</div>
                <div className="text-2xl font-bold text-blue-800">Level 4</div>
              </div>
            </div>
            
            <Link 
              href="/ascension" 
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center hover:border-blue-300 transition-colors"
            >
              <span className="mr-2">View Full Journey</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </header>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <BookOpen className="text-green-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-1">12</h2>
            <p className="text-gray-600">Insights Collected</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/ascender/insights" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View Insights <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Award className="text-purple-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-1">5</h2>
            <p className="text-gray-600">Achievements Unlocked</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/ascender/achievements" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View Achievements <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-1">68%</h2>
            <p className="text-gray-600">Next Level Progress</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/ascender/progress" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View Progress <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Flow Activities</h2>
            <Link 
              href="/flow" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Activities
            </Link>
          </div>
          
          <div className="space-y-6">
            {flowActivities.map(activity => (
              <div key={activity.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    activity.type === 'insight' ? 'bg-green-100' : 
                    activity.type === 'achievement' ? 'bg-purple-100' : 
                    activity.type === 'practice' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-medium">{activity.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>{activity.date}</span>
                        <span className="mx-2">•</span>
                        <Clock size={14} className="mr-1" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{activity.description}</p>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map(event => (
                <Link 
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/ascender/events" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Events
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">Recommended Practices</h2>
            <div className="space-y-4">
              {practices.map(practice => (
                <Link 
                  key={practice.id}
                  href={`/practices/${practice.id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium">{practice.title}</h3>
                  <div className="flex items-center mt-2">
                    <div className="bg-orange-100 h-2 rounded-full flex-grow">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${practice.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium ml-3">{practice.completionRate}%</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/ascender/practices" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Practices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const flowActivities = [
  {
    id: 1,
    type: 'insight',
    title: 'Discovered "Flow State Acceleration" insight',
    description: 'You unlocked a new understanding of how to enter flow states more rapidly through mental preparation techniques.',
    date: 'Today',
    time: '2 hours ago',
    tags: ['Flow', 'Mental Performance', 'Insight']
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Achieved "Consistent Flow" milestone',
    description: 'Successfully maintained daily flow state practices for 14 consecutive days.',
    date: 'Yesterday',
    time: '5:30 PM',
    tags: ['Achievement', 'Consistency', 'Flow State']
  },
  {
    id: 3,
    type: 'practice',
    title: 'Completed "Peak Performance Meditation"',
    description: 'Finished a 30-minute guided meditation focused on preparing the mind for deep flow states.',
    date: '2 days ago',
    time: '8:15 AM',
    tags: ['Practice', 'Meditation', 'Performance']
  }
];

const events = [
  {
    id: 1,
    title: 'Flow State Mastery Workshop',
    description: 'Learn advanced techniques for entering and maintaining deep flow states.',
    date: 'Tomorrow, 7:00 PM'
  },
  {
    id: 2,
    title: 'Ascension Path Checkpoint',
    description: 'Review your progress and set new goals for your ascension journey.',
    date: 'Jan 15, 2:00 PM'
  },
  {
    id: 3,
    title: 'Ascenders Community Gathering',
    description: 'Connect with fellow Ascenders and share experiences.',
    date: 'Jan 18, 6:30 PM'
  }
];

const practices = [
  {
    id: 1,
    title: 'Morning Flow Priming Routine',
    completionRate: 75
  },
  {
    id: 2,
    title: 'Cognitive Enhancement Exercises',
    completionRate: 42
  },
  {
    id: 3,
    title: 'Evening Reflection & Integration',
    completionRate: 88
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
    default:
      return <BarChart3 className="text-blue-600" size={18} />;
  }
} 