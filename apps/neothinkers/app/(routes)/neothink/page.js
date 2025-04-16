import { BookOpen, Brain, Lightbulb, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';
export default function NeothinkPage() {
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Neothink Library</h1>
          <p className="text-lg text-gray-600 mt-3">
            Explore the fundamental concepts and advanced principles of neothinking
          </p>
        </header>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1 flex items-center space-x-2 px-3 py-2 border rounded-md">
            <Search size={20} className="text-gray-400"/>
            <input type="text" placeholder="Search concepts, principles, or topics..." className="flex-1 outline-none bg-transparent"/>
          </div>
          <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <Filter size={20} className="mr-2"/>
            Filters
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (<div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                {category.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{category.name}</h2>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="space-y-2">
                {category.topics.map(topic => (<Link key={topic.id} href={`/neothink/${category.slug}/${topic.slug}`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.name}</span>
                      <ArrowRight size={16} className="text-gray-400"/>
                    </div>
                  </Link>))}
              </div>
            </div>))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Brain className="text-purple-600" size={24}/>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-900">Start Your Journey</h3>
                <p className="text-purple-700 mt-2">
                  New to neothinking? Begin with our curated path for beginners.
                </p>
                <Link href="/neothink/beginner-path" className="inline-flex items-center mt-4 text-purple-700 font-medium hover:text-purple-800">
                  Begin Learning <ArrowRight size={16} className="ml-1"/>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="text-blue-600" size={24}/>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900">Advanced Concepts</h3>
                <p className="text-blue-700 mt-2">
                  Ready for deeper insights? Explore advanced neothinking principles.
                </p>
                <Link href="/neothink/advanced" className="inline-flex items-center mt-4 text-blue-700 font-medium hover:text-blue-800">
                  Explore Advanced <ArrowRight size={16} className="ml-1"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
const categories = [
    {
        id: 1,
        name: "Foundational Principles",
        slug: "foundations",
        description: "Core concepts and fundamental principles of neothinking",
        icon: <BookOpen className="text-indigo-600" size={24}/>,
        topics: [
            { id: 1, name: "Integration Techniques", slug: "integration-techniques" },
            { id: 2, name: "Mental Model Building", slug: "mental-models" },
            { id: 3, name: "Pattern Recognition", slug: "pattern-recognition" }
        ]
    },
    {
        id: 2,
        name: "Advanced Concepts",
        slug: "advanced",
        description: "Deep dive into sophisticated neothinking methodologies",
        icon: <Brain className="text-indigo-600" size={24}/>,
        topics: [
            { id: 1, name: "Systems Analysis", slug: "systems-analysis" },
            { id: 2, name: "Abstract Reasoning", slug: "abstract-reasoning" },
            { id: 3, name: "Cognitive Enhancement", slug: "cognitive-enhancement" }
        ]
    },
    {
        id: 3,
        name: "Practical Applications",
        slug: "applications",
        description: "Real-world applications of neothinking principles",
        icon: <Lightbulb className="text-indigo-600" size={24}/>,
        topics: [
            { id: 1, name: "Problem Solving", slug: "problem-solving" },
            { id: 2, name: "Decision Making", slug: "decision-making" },
            { id: 3, name: "Innovation Methods", slug: "innovation" }
        ]
    }
];
//# sourceMappingURL=page.js.map