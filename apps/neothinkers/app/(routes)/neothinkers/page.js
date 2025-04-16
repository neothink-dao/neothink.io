import { Users, Brain, Star, MessageSquare, Sparkles, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
export default function NeothinkersPage() {
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Neothinkers Community</h1>
          <p className="text-lg text-gray-600 mt-3">
            Connect with fellow neothinkers, share insights, and grow together
          </p>
        </header>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1 flex items-center space-x-2 px-3 py-2 border rounded-md">
            <Search size={20} className="text-gray-400"/>
            <input type="text" placeholder="Search neothinkers, discussions, or topics..." className="flex-1 outline-none bg-transparent"/>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Connect
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredMembers.map(member => (<div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Brain className="text-indigo-600" size={32}/>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{member.bio}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-500" size={16}/>
                  <span className="text-sm text-gray-600">{member.level}</span>
                </div>
                <Link href={`/neothinkers/${member.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  View Profile <ArrowRight size={16} className="ml-1"/>
                </Link>
              </div>
            </div>))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Active Discussions</h2>
            <div className="space-y-4">
              {discussions.map(discussion => (<Link key={discussion.id} href={`/discussions/${discussion.id}`} className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="text-indigo-600 flex-shrink-0 mt-1" size={20}/>
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
                </Link>))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
            <div className="space-y-4">
              {projects.map(project => (<div key={project.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-400"/>
                      <span className="text-sm text-gray-600">{project.members}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="text-yellow-500" size={16}/>
                      <span className="text-sm text-gray-600">{project.status}</span>
                    </div>
                    <Link href={`/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Join Project
                    </Link>
                  </div>
                </div>))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Ready to Share Your Insights?</h2>
              <p className="text-purple-700 mt-2">
                Start a discussion or project to collaborate with fellow neothinkers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/discussions/new" className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors font-medium">
                Start Discussion
              </Link>
              <Link href="/projects/new" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Create Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
const featuredMembers = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Integration Specialist",
        bio: "Passionate about connecting different domains of knowledge to create innovative solutions.",
        level: "Advanced Integrator"
    },
    {
        id: 2,
        name: "Michael Roberts",
        role: "Systems Thinker",
        bio: "Exploring the interconnections between complex systems and human cognition.",
        level: "Master Analyst"
    },
    {
        id: 3,
        name: "Elena Martinez",
        role: "Cognitive Developer",
        bio: "Dedicated to unlocking new pathways of thinking and mental model creation.",
        level: "Senior Practitioner"
    }
];
const discussions = [
    {
        id: 1,
        title: "Integration of Eastern and Western Thought Systems",
        preview: "Exploring the synergies between different philosophical traditions...",
        participants: 24,
        replies: 86
    },
    {
        id: 2,
        title: "Advanced Pattern Recognition in Complex Systems",
        preview: "Discussing techniques for identifying hidden patterns...",
        participants: 18,
        replies: 45
    },
    {
        id: 3,
        title: "Mental Model Development Workshop",
        preview: "Collaborative session on building effective mental models...",
        participants: 32,
        replies: 92
    }
];
const projects = [
    {
        id: 1,
        name: "Cognitive Enhancement Research",
        description: "Investigating methods for expanding mental capabilities through integrated thinking",
        members: 12,
        status: "Active Research"
    },
    {
        id: 2,
        name: "Knowledge Integration Platform",
        description: "Building tools for better connection and synthesis of information",
        members: 8,
        status: "In Development"
    },
    {
        id: 3,
        name: "Neothinking Education Initiative",
        description: "Creating resources for teaching advanced thinking methods",
        members: 15,
        status: "Launching Soon"
    }
];
//# sourceMappingURL=page.js.map