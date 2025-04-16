import { Dna, Brain, Beaker, Zap, Search, Filter, ArrowRight, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function ImmortalisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Immortalis Protocols</h1>
          <p className="text-lg text-gray-600 mt-3">
            Advanced life extension methodologies and cutting-edge longevity research
          </p>
        </header>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1 flex items-center space-x-2 px-3 py-2 border rounded-md">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text"
              placeholder="Search protocols, research, or topics..."
              className="flex-1 outline-none bg-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <Filter size={20} className="mr-2" />
            Filters
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                {category.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{category.name}</h2>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="space-y-2">
                {category.protocols.map(protocol => (
                  <Link
                    key={protocol.id}
                    href={`/immortalis/${category.slug}/${protocol.slug}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{protocol.name}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Latest Research</h2>
            <div className="space-y-4">
              {research.map(item => (
                <Link
                  key={item.id}
                  href={`/research/${item.id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Beaker className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{item.date}</span>
                        <span className="mx-2">•</span>
                        <Users size={14} className="mr-1" />
                        <span>{item.researchers}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Featured Breakthroughs</h2>
            <div className="space-y-4">
              {breakthroughs.map(breakthrough => (
                <div key={breakthrough.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      <Star className="text-yellow-500 mr-2" size={18} />
                      {breakthrough.title}
                    </h3>
                    <span className="text-sm font-medium text-emerald-600">{breakthrough.impact}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{breakthrough.description}</p>
                  <Link
                    href={`/breakthroughs/${breakthrough.id}`}
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                  >
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">Ready to Begin Your Protocol?</h2>
              <p className="text-emerald-700 mt-2">
                Get personalized guidance and start your journey to optimal longevity
              </p>
            </div>
            <Link 
              href="/immortalis/assessment"
              className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const categories = [
  {
    id: 1,
    name: "Cellular Optimization",
    slug: "cellular",
    description: "Advanced protocols for cellular repair and regeneration",
    icon: <Dna className="text-emerald-600" size={24} />,
    protocols: [
      { id: 1, name: "Telomere Extension", slug: "telomere-extension" },
      { id: 2, name: "Mitochondrial Enhancement", slug: "mitochondrial-enhancement" },
      { id: 3, name: "Cellular Reprogramming", slug: "cellular-reprogramming" }
    ]
  },
  {
    id: 2,
    name: "Cognitive Systems",
    slug: "cognitive",
    description: "Protocols for optimal brain function and neuroplasticity",
    icon: <Brain className="text-emerald-600" size={24} />,
    protocols: [
      { id: 1, name: "Neural Regeneration", slug: "neural-regeneration" },
      { id: 2, name: "Cognitive Enhancement", slug: "cognitive-enhancement" },
      { id: 3, name: "Memory Optimization", slug: "memory-optimization" }
    ]
  },
  {
    id: 3,
    name: "Biological Integration",
    slug: "integration",
    description: "Holistic protocols for system-wide optimization",
    icon: <Zap className="text-emerald-600" size={24} />,
    protocols: [
      { id: 1, name: "Metabolic Optimization", slug: "metabolic-optimization" },
      { id: 2, name: "Immune Enhancement", slug: "immune-enhancement" },
      { id: 3, name: "Hormonal Balance", slug: "hormonal-balance" }
    ]
  }
];

const research = [
  {
    id: 1,
    title: "Breakthrough in Telomere Extension Technology",
    summary: "Novel approach to extending telomere length shows promising results in clinical trials",
    date: "2 days ago",
    researchers: "12 researchers"
  },
  {
    id: 2,
    title: "Advanced Neural Regeneration Pathway Discovered",
    summary: "New mechanism for neural tissue regeneration identified in long-term study",
    date: "1 week ago",
    researchers: "8 researchers"
  },
  {
    id: 3,
    title: "Mitochondrial Function Enhancement Protocol",
    summary: "Revolutionary method for optimizing cellular energy production validated",
    date: "2 weeks ago",
    researchers: "15 researchers"
  }
];

const breakthroughs = [
  {
    id: 1,
    title: "Cellular Age Reversal",
    description: "Successful demonstration of cellular age reversal in human tissue samples",
    impact: "Major Breakthrough"
  },
  {
    id: 2,
    title: "Cognitive Enhancement Protocol",
    description: "New protocol shows 40% improvement in neural plasticity and cognitive function",
    impact: "Significant Impact"
  },
  {
    id: 3,
    title: "Longevity Gene Activation",
    description: "Novel method for activating longevity genes through epigenetic modification",
    impact: "Revolutionary"
  }
]; 