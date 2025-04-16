import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Target, Eye, BarChart, Clock, Users, Globe } from 'lucide-react';
import { Loading } from '@/components/Loading';
export default function EndgamePage() {
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Your Endgame Vision</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            The ultimate destination on your transformational journey
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-blue-100">
          <h2 className="text-3xl font-bold text-center mb-6">The Path Forward</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="text-blue-600" size={24}/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vision</h3>
              <p className="text-gray-600">
                Clearly visualize your ultimate potential and the future you're building toward.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Target className="text-purple-600" size={24}/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Purpose</h3>
              <p className="text-gray-600">
                Define your core mission and the impact you want to have on yourself and others.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-indigo-600" size={24}/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Values</h3>
              <p className="text-gray-600">
                Identify the principles that guide your decisions and actions on your journey.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <EndgameProgress />
        </Suspense>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Global Transformation</h2>
          <p className="text-xl text-gray-600">
            Your personal endgame connects to the broader vision of global transformation.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="text-green-600" size={20}/>
                </div>
                <h3 className="text-xl font-semibold">Community Impact</h3>
              </div>
              <p className="text-gray-600 mb-4">
                As you evolve, your transformation creates ripples that positively influence others around you.
              </p>
              <Link href="/communities/impact" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                Explore your community impact <ArrowRight size={16} className="ml-1"/>
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Globe className="text-blue-600" size={20}/>
                </div>
                <h3 className="text-xl font-semibold">Global Vision</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your personal journey is part of a larger movement toward a better future for humanity.
              </p>
              <Link href="/global-vision" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                Discover the global vision <ArrowRight size={16} className="ml-1"/>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6">Personal Endgame Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/endgame/vision-board" className="group block p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Create Vision Board</h3>
              <p className="text-gray-600 mt-2">Visualize your endgame with an interactive vision board</p>
            </Link>
            
            <Link href="/endgame/milestones" className="group block p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Set Key Milestones</h3>
              <p className="text-gray-600 mt-2">Map out the major achievements on your journey</p>
            </Link>
            
            <Link href="/endgame/mentors" className="group block p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Connect with Mentors</h3>
              <p className="text-gray-600 mt-2">Find guides who have achieved similar endgame visions</p>
            </Link>
          </div>
        </div>
      </div>
    </div>);
}
function EndgameProgress() {
    // In a real implementation, this would fetch from an API
    const progressCategories = [
        {
            id: 'personal',
            name: 'Personal Development',
            progress: 68,
            icon: <BarChart className="text-blue-600" size={24}/>,
            description: 'Growth in self-awareness, mindset, and personal capabilities'
        },
        {
            id: 'integration',
            name: 'Platform Integration',
            progress: 42,
            icon: <Clock className="text-purple-600" size={24}/>,
            description: 'Connecting your journey across all transformation platforms'
        }
    ];
    return (<div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <h2 className="text-3xl font-bold mb-6">Your Endgame Progress</h2>
      
      <div className="space-y-8">
        {progressCategories.map(category => (<div key={category.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{category.progress}%</div>
            </div>
            
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${category.progress}%` }}/>
            </div>
          </div>))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link href="/endgame/detailed-progress" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          View Detailed Progress <ArrowRight size={18} className="ml-2"/>
        </Link>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map