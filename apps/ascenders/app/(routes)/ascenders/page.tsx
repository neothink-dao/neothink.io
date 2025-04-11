import Link from 'next/link';
import { Suspense } from 'react';
import { Search, Users, Star, MessageCircle, Zap, Filter, ArrowRight, MapPin, Clock } from 'lucide-react';

export default function AscendersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Ascenders Community</h1>
          <p className="text-lg text-gray-600 mt-2">
            Connect with fellow travelers on the path of ascension
          </p>
        </header>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="relative flex-grow max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for Ascenders, groups, or events..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            
            <button className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700">
              Join a Group
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Groups</h2>
                <Link
                  href="/ascenders/groups"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View all groups <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredGroups.map(group => (
                  <Link
                    key={group.id}
                    href={`/ascenders/groups/${group.id}`}
                    className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
                  >
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-white font-bold text-lg">{group.name}</h3>
                        <div className="flex items-center mt-1">
                          <Users className="text-white opacity-75" size={14} />
                          <span className="text-white text-sm ml-1">{group.memberCount} members</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600">{group.description}</p>
                      <div className="flex items-center mt-3">
                        {group.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Discussions</h2>
                <Link
                  href="/ascenders/discussions"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  All discussions <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentDiscussions.map(discussion => (
                  <Link
                    key={discussion.id}
                    href={`/ascenders/discussions/${discussion.id}`}
                    className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {discussion.author.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-medium text-lg">{discussion.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            <span>{discussion.timeAgo}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{discussion.preview}</p>
                        <div className="flex items-center mt-3 space-x-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <MessageCircle size={14} className="mr-1" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Users size={14} className="mr-1" />
                            <span>{discussion.participants} participants</span>
                          </div>
                          <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full">
                            {discussion.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Community Insights</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-medium">12,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Groups</span>
                  <span className="font-medium">342</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discussions Today</span>
                  <span className="font-medium">128</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Upcoming Events</span>
                  <span className="font-medium">56</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Featured Mentors</h2>
              <div className="space-y-4">
                {featuredMentors.map(mentor => (
                  <Link
                    key={mentor.id}
                    href={`/ascenders/mentors/${mentor.id}`}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {mentor.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{mentor.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Star className="text-yellow-500" size={12} />
                        <span className="ml-1">{mentor.rating}</span>
                        <span className="mx-1">•</span>
                        <span>{mentor.specialty}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/ascenders/mentors"
                  className="block text-center text-blue-600 hover:text-blue-800 font-medium mt-2"
                >
                  View all mentors
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <Link
                    key={event.id}
                    href={`/ascenders/events/${event.id}`}
                    className="block"
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/ascenders/events"
                  className="block text-center text-blue-600 hover:text-blue-800 font-medium mt-2"
                >
                  View all events
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Ready to accelerate your ascension?</h2>
          <p className="text-blue-600 max-w-2xl mx-auto mb-6">
            Join premium groups, connect with elite mentors, and access exclusive resources
          </p>
          <button className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Zap size={18} className="mr-2" />
            Upgrade Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}

// Mock data
const featuredGroups = [
  {
    id: 1,
    name: "Flow State Masters",
    description: "A group dedicated to mastering and maintaining consistent flow states in daily life.",
    memberCount: 1243,
    tags: ["Flow State", "Mastery", "Daily Practice"]
  },
  {
    id: 2,
    name: "Consciousness Explorers",
    description: "Exploring the frontiers of consciousness and pushing the boundaries of human potential.",
    memberCount: 876,
    tags: ["Consciousness", "Exploration", "Potential"]
  }
];

const recentDiscussions = [
  {
    id: 1,
    title: "Techniques for maintaining flow state for extended periods",
    author: "Michael",
    preview: "I've been working on extending my flow state sessions from 1 hour to 3+ hours. Here's what I've found works...",
    timeAgo: "2 hours ago",
    replies: 24,
    participants: 12,
    category: "Techniques"
  },
  {
    id: 2,
    title: "Integration of ascension practices across multiple areas of life",
    author: "Sarah",
    preview: "I've been struggling with integrating these practices consistently across work, family, and personal development...",
    timeAgo: "Yesterday",
    replies: 38,
    participants: 15,
    category: "Integration"
  },
  {
    id: 3,
    title: "Breakthrough: Cognitive enhancement through specialized flow protocols",
    author: "David",
    preview: "After 6 months of testing different approaches, I've developed a protocol that has significantly enhanced...",
    timeAgo: "3 days ago",
    replies: 56,
    participants: 22,
    category: "Breakthrough"
  }
];

const featuredMentors = [
  {
    id: 1,
    name: "Dr. Elena Sullivan",
    rating: 4.9,
    specialty: "Flow State Science"
  },
  {
    id: 2,
    name: "Marcus Chen",
    rating: 4.8,
    specialty: "Cognitive Enhancement"
  },
  {
    id: 3,
    name: "Sophia Williams",
    rating: 4.9,
    specialty: "Integration Specialist"
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Flow State Mastery Workshop",
    date: "Jan 15, 2:00 PM",
    location: "Virtual Event"
  },
  {
    id: 2,
    title: "Ascenders Annual Gathering",
    date: "Feb 3-5",
    location: "San Francisco, CA"
  },
  {
    id: 3,
    title: "Advanced Consciousness Techniques",
    date: "Jan 22, 7:00 PM",
    location: "Virtual Event"
  }
]; 