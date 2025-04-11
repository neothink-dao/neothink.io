import { Users, Heart, Star, MessageSquare, Target, ArrowRight, Search, Award } from 'lucide-react';
import Link from 'next/link';

export default function ImmortalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Immortals Community</h1>
          <p className="text-lg text-gray-600 mt-3">
            Connect with fellow immortals on the journey to unlimited life extension
          </p>
        </header>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1 flex items-center space-x-2 px-3 py-2 border rounded-md">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text"
              placeholder="Search immortals, achievements, or discussions..."
              className="flex-1 outline-none bg-transparent"
            />
          </div>
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors">
            Connect
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredMembers.map(member => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Heart className="text-emerald-600" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{member.bio}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="text-yellow-500" size={16} />
                  <span className="text-sm text-gray-600">{member.achievement}</span>
                </div>
                <Link
                  href={`/immortals/${member.id}`}
                  className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
                >
                  View Profile <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Active Discussions</h2>
            <div className="space-y-4">
              {discussions.map(discussion => (
                <Link
                  key={discussion.id}
                  href={`/discussions/${discussion.id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-medium">{discussion.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{discussion.preview}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>{discussion.participants} participants</span>
                        <span className="mx-2">•</span>
                        <span>{discussion.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{project.members}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="text-emerald-500" size={16} />
                      <span className="text-sm text-gray-600">{project.status}</span>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                    >
                      Join Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">Share Your Journey</h2>
              <p className="text-emerald-700 mt-2">
                Start a discussion or project to collaborate with fellow immortals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/discussions/new"
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-colors font-medium"
              >
                Start Discussion
              </Link>
              <Link
                href="/projects/new"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Create Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const featuredMembers = [
  {
    id: 1,
    name: "Dr. Elena Chen",
    role: "Longevity Researcher",
    bio: "Pioneering research in telomere extension and cellular regeneration.",
    achievement: "20 Years Biological Age Reduction"
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Life Extension Specialist",
    bio: "Developing innovative protocols for optimal health and longevity.",
    achievement: "Advanced Vitality Level"
  },
  {
    id: 3,
    name: "Dr. Sarah Martinez",
    role: "Immortality Pioneer",
    bio: "Leading breakthrough research in age reversal and life extension.",
    achievement: "Cellular Regeneration Expert"
  }
];

const discussions = [
  {
    id: 1,
    title: "Advanced Telomere Extension Protocols",
    preview: "Discussing latest breakthroughs in telomere extension technology...",
    participants: 28,
    replies: 95
  },
  {
    id: 2,
    title: "Cognitive Enhancement Strategies",
    preview: "Sharing effective methods for maintaining peak mental performance...",
    participants: 42,
    replies: 127
  },
  {
    id: 3,
    title: "Cellular Regeneration Techniques",
    preview: "Exploring cutting-edge approaches to cellular repair and renewal...",
    participants: 35,
    replies: 84
  }
];

const projects = [
  {
    id: 1,
    name: "Longevity Protocol Development",
    description: "Collaborative research on advanced life extension protocols",
    members: 15,
    status: "Active Research"
  },
  {
    id: 2,
    name: "Cognitive Enhancement Study",
    description: "Investigating methods for optimal brain function and plasticity",
    members: 12,
    status: "Recruiting"
  },
  {
    id: 3,
    name: "Regeneration Techniques",
    description: "Developing new approaches to cellular and tissue regeneration",
    members: 18,
    status: "In Progress"
  }
]; 