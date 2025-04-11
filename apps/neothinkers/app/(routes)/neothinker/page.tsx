import Link from 'next/link';
import { BookOpen, Brain, Target, Star, Clock, ArrowRight, Zap, BarChart3 } from 'lucide-react';

export default function NeothinkerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">Your Neothinker Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Track your journey of mental expansion and neothinking mastery
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 flex items-center">
              <div className="mr-3">
                <Brain className="text-indigo-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-indigo-700 font-medium">Thinking Level</div>
                <div className="text-2xl font-bold text-indigo-800">Level 3</div>
              </div>
            </div>
            
            <Link 
              href="/insights" 
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center hover:border-indigo-300 transition-colors"
            >
              <span className="mr-2">View Insights</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <BookOpen className="text-purple-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-1">24</h2>
            <p className="text-gray-600">Concepts Mastered</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/neothinker/concepts" 
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View Concepts <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Target className="text-blue-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-1">8</h2>
            <p className="text-gray-600">Active Projects</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/neothinker/projects" 
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View Projects <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <BarChart3 className="text-green-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold mb-1">85%</h2>
            <p className="text-gray-600">Integration Rate</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/neothinker/progress" 
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View Progress <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Insights</h2>
            <div className="space-y-4">
              {recentInsights.map(insight => (
                <Link 
                  key={insight.id}
                  href={`/insights/${insight.id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Brain className="text-indigo-600" size={18} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{insight.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Current Focus Areas</h2>
            <div className="space-y-4">
              {focusAreas.map(area => (
                <div key={area.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{area.name}</h3>
                    <span className="text-sm font-medium">{area.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${area.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-indigo-800">Ready to expand your thinking?</h2>
              <p className="text-indigo-600 mt-2">
                Connect with a mentor to accelerate your neothinking journey
              </p>
            </div>
            <Link 
              href="/mentorship"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Star size={18} className="mr-2" />
              Find a Mentor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const recentInsights = [
  {
    id: 1,
    title: "Pattern Recognition in Complex Systems",
    description: "Identified key patterns in system interactions and their implications.",
    date: "2 hours ago"
  },
  {
    id: 2,
    title: "Integration of Multiple Mental Models",
    description: "Successfully combined different mental models for enhanced problem-solving.",
    date: "Yesterday"
  },
  {
    id: 3,
    title: "Breakthrough in Abstract Thinking",
    description: "New understanding of abstract concept relationships and applications.",
    date: "3 days ago"
  }
];

const focusAreas = [
  {
    id: 1,
    name: "Systems Thinking",
    progress: 75,
    description: "Understanding and analyzing complex interconnected systems"
  },
  {
    id: 2,
    name: "Abstract Reasoning",
    progress: 60,
    description: "Developing advanced abstract thinking capabilities"
  },
  {
    id: 3,
    name: "Integration Methods",
    progress: 85,
    description: "Techniques for integrating multiple concepts and insights"
  },
  {
    id: 4,
    name: "Mental Model Development",
    progress: 45,
    description: "Creating and refining personal mental models"
  }
]; 