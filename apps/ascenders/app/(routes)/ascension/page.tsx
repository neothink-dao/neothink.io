import Link from 'next/link';
import { CheckCircle, ChevronRight, ArrowRight, Clock, BookOpen, Star, Zap } from 'lucide-react';

export default function AscensionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Your Ascension Path</h1>
          <p className="text-lg text-gray-600 mt-2">
            Track your progress through the levels of ascending consciousness
          </p>
        </header>

        <div className="relative">
          <div className="absolute left-1/2 -ml-0.5 w-1 h-full bg-gray-200"></div>
          
          {ascensionLevels.map((level, index) => (
            <div key={level.id} className="relative mb-10 last:mb-0">
              <div className="flex items-start group">
                <div className="flex flex-col items-center">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10
                    ${level.completed ? 'bg-green-100 ring-4 ring-green-50' : 
                      level.current ? 'bg-blue-100 ring-4 ring-blue-50' : 'bg-gray-100 ring-4 ring-white'}`}
                  >
                    {level.completed ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : level.current ? (
                      <div className="bg-blue-600 w-3 h-3 rounded-full animate-pulse"></div>
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">{level.level}</span>
                    )}
                  </div>
                  {index < ascensionLevels.length - 1 && (
                    <div className="w-1 h-24 bg-gray-200"></div>
                  )}
                </div>
                
                <div className={`ml-6 pb-8 ${
                  level.completed ? 'opacity-75' : level.current ? 'opacity-100' : 'opacity-50'
                }`}>
                  <div className={`bg-white rounded-xl shadow-sm border ${
                    level.completed ? 'border-green-200' : 
                    level.current ? 'border-blue-200' : 'border-gray-200'
                  } p-6`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <h2 className={`text-xl font-bold ${
                            level.completed ? 'text-green-800' : 
                            level.current ? 'text-blue-800' : 'text-gray-800'
                          }`}>
                            Level {level.level}: {level.title}
                          </h2>
                          {level.completed && (
                            <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                          {level.current && (
                            <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">
                          {level.description}
                        </p>
                      </div>
                      
                      {(level.completed || level.current) && (
                        <Link 
                          href={`/ascension/level/${level.level}`}
                          className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                            level.completed ? 'bg-green-50 text-green-700 hover:bg-green-100' : 
                            'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          } transition-colors`}
                        >
                          {level.completed ? 'Review Level' : 'Continue Level'}
                          <ChevronRight size={16} className="ml-1" />
                        </Link>
                      )}
                    </div>
                    
                    {(level.completed || level.current) && (
                      <>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-gray-700">
                              {level.current ? 'Progress' : 'Mastery Level'}
                            </div>
                            <div className="text-sm font-medium">
                              {level.current ? `${level.progress}%` : '100%'}
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${level.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: level.completed ? '100%' : `${level.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          {level.stats.map(stat => (
                            <div key={stat.name} className="flex items-center space-x-2">
                              {stat.icon}
                              <div>
                                <div className="text-sm text-gray-500">{stat.name}</div>
                                <div className="font-medium">{stat.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {!level.completed && !level.current && (
                      <div className="mt-4 flex justify-center">
                        <span className="text-gray-400 text-sm font-medium">
                          Complete previous levels to unlock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">Looking for more guidance?</h2>
            <p className="text-blue-600 mt-1">Connect with mentors who can help accelerate your ascension journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/ascenders/mentors" 
              className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:border-blue-300 transition-colors flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Star className="text-blue-600" size={20} />
              </div>
              <h3 className="font-medium">Find a Mentor</h3>
              <p className="text-sm text-gray-600 mt-1">Connect with experienced guides</p>
            </Link>
            
            <Link 
              href="/ascenders/groups" 
              className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:border-blue-300 transition-colors flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Zap className="text-blue-600" size={20} />
              </div>
              <h3 className="font-medium">Join a Group</h3>
              <p className="text-sm text-gray-600 mt-1">Ascend together with others</p>
            </Link>
            
            <Link 
              href="/ascension/resources" 
              className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:border-blue-300 transition-colors flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <h3 className="font-medium">Resources</h3>
              <p className="text-sm text-gray-600 mt-1">Tools to support your journey</p>
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/ascenders/community" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              Explore the full community <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const ascensionLevels = [
  {
    id: 1,
    level: 1,
    title: "Awakening",
    description: "The beginning of your journey, where initial awareness and curiosity are sparked.",
    completed: true,
    current: false,
    progress: 100,
    stats: [
      { 
        name: "Days Active", 
        value: "45", 
        icon: <Clock className="text-blue-500" size={16} />
      },
      { 
        name: "Insights", 
        value: "8", 
        icon: <BookOpen className="text-green-500" size={16} />
      },
      { 
        name: "Techniques", 
        value: "6", 
        icon: <Star className="text-yellow-500" size={16} />
      },
      { 
        name: "Flow Sessions", 
        value: "12", 
        icon: <Zap className="text-purple-500" size={16} />
      }
    ]
  },
  {
    id: 2,
    level: 2,
    title: "Integration",
    description: "Begin integrating new concepts and practices into your daily consciousness.",
    completed: true,
    current: false,
    progress: 100,
    stats: [
      { 
        name: "Days Active", 
        value: "38", 
        icon: <Clock className="text-blue-500" size={16} />
      },
      { 
        name: "Insights", 
        value: "12", 
        icon: <BookOpen className="text-green-500" size={16} />
      },
      { 
        name: "Techniques", 
        value: "8", 
        icon: <Star className="text-yellow-500" size={16} />
      },
      { 
        name: "Flow Sessions", 
        value: "15", 
        icon: <Zap className="text-purple-500" size={16} />
      }
    ]
  },
  {
    id: 3,
    level: 3,
    title: "Expansion",
    description: "Expanding your awareness and capabilities through consistent practice.",
    completed: true,
    current: false,
    progress: 100,
    stats: [
      { 
        name: "Days Active", 
        value: "50", 
        icon: <Clock className="text-blue-500" size={16} />
      },
      { 
        name: "Insights", 
        value: "15", 
        icon: <BookOpen className="text-green-500" size={16} />
      },
      { 
        name: "Techniques", 
        value: "10", 
        icon: <Star className="text-yellow-500" size={16} />
      },
      { 
        name: "Flow Sessions", 
        value: "24", 
        icon: <Zap className="text-purple-500" size={16} />
      }
    ]
  },
  {
    id: 4,
    level: 4,
    title: "Acceleration",
    description: "Rapid growth and advancement in consciousness and capabilities.",
    completed: false,
    current: true,
    progress: 68,
    stats: [
      { 
        name: "Days Active", 
        value: "22", 
        icon: <Clock className="text-blue-500" size={16} />
      },
      { 
        name: "Insights", 
        value: "9", 
        icon: <BookOpen className="text-green-500" size={16} />
      },
      { 
        name: "Techniques", 
        value: "7", 
        icon: <Star className="text-yellow-500" size={16} />
      },
      { 
        name: "Flow Sessions", 
        value: "16", 
        icon: <Zap className="text-purple-500" size={16} />
      }
    ]
  },
  {
    id: 5,
    level: 5,
    title: "Mastery",
    description: "Develop mastery over advanced techniques and achieve consistent flow states.",
    completed: false,
    current: false,
    progress: 0,
    stats: []
  },
  {
    id: 6,
    level: 6,
    title: "Transcendence",
    description: "Transcend limitations and access higher levels of consciousness.",
    completed: false,
    current: false,
    progress: 0,
    stats: []
  }
]; 