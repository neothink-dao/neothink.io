import { Heart, Brain, Activity, Clock, Dna, ArrowRight, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
export default function ImmortalPage() {
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">Your Immortality Journey</h1>
            <p className="text-lg text-gray-600 mt-2">
              Track your progress towards unlimited life extension and optimal health
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 flex items-center">
              <div className="mr-3">
                <Heart className="text-emerald-600" size={20}/>
              </div>
              <div>
                <div className="text-sm text-emerald-700 font-medium">Vitality Score</div>
                <div className="text-2xl font-bold text-emerald-800">92%</div>
              </div>
            </div>
            
            <Link href="/project-life" className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center hover:border-emerald-300 transition-colors">
              <span className="mr-2">View Life Plan</span>
              <ArrowRight size={16}/>
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-4 gap-6">
          {metrics.map(metric => (<div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                {metric.icon}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">{metric.name}</h2>
                <span className="text-sm text-gray-500">{metric.trend}</span>
              </div>
              <div className="text-2xl font-bold mb-2">{metric.value}</div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${metric.progress}%` }}></div>
              </div>
            </div>))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Active Protocols</h2>
            <div className="space-y-4">
              {protocols.map(protocol => (<div key={protocol.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      <Sparkles className="text-emerald-500 mr-2" size={18}/>
                      {protocol.name}
                    </h3>
                    <span className="text-sm font-medium text-emerald-600">{protocol.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{protocol.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-400"/>
                      <span className="text-sm text-gray-600">{protocol.duration}</span>
                    </div>
                    <Link href={`/protocols/${protocol.id}`} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                      View Details
                    </Link>
                  </div>
                </div>))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Optimization Goals</h2>
            <div className="space-y-4">
              {goals.map(goal => (<div key={goal.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{goal.name}</h3>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{goal.timeframe}</span>
                    <Link href={`/goals/${goal.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium">
                      Update Progress
                    </Link>
                  </div>
                </div>))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">Ready to Optimize Further?</h2>
              <p className="text-emerald-700 mt-2">
                Discover advanced protocols and cutting-edge life extension methods
              </p>
            </div>
            <Link href="/immortalis" className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              <Target size={18} className="mr-2"/>
              Explore Protocols
            </Link>
          </div>
        </div>
      </div>
    </div>);
}
const metrics = [
    {
        id: 1,
        name: "Biological Age",
        value: "32.5 years",
        trend: "↓ 2.3 years",
        progress: 85,
        icon: <Dna className="text-emerald-600" size={24}/>
    },
    {
        id: 2,
        name: "Cognitive Function",
        value: "Superior",
        trend: "↑ 12%",
        progress: 92,
        icon: <Brain className="text-emerald-600" size={24}/>
    },
    {
        id: 3,
        name: "Physical Vitality",
        value: "Optimal",
        trend: "↑ 8%",
        progress: 88,
        icon: <Activity className="text-emerald-600" size={24}/>
    },
    {
        id: 4,
        name: "Longevity Score",
        value: "94.5",
        trend: "↑ 3.2",
        progress: 95,
        icon: <Heart className="text-emerald-600" size={24}/>
    }
];
const protocols = [
    {
        id: 1,
        name: "Advanced Cellular Regeneration",
        description: "Optimizing cellular repair and regeneration through targeted interventions",
        status: "Active",
        duration: "6 months active"
    },
    {
        id: 2,
        name: "Cognitive Enhancement Protocol",
        description: "Multi-modal approach to maximizing cognitive performance and neuroplasticity",
        status: "Ongoing",
        duration: "3 months active"
    },
    {
        id: 3,
        name: "Longevity Optimization",
        description: "Comprehensive protocol for extending healthspan and lifespan",
        status: "Active",
        duration: "12 months active"
    }
];
const goals = [
    {
        id: 1,
        name: "Telomere Length Optimization",
        progress: 78,
        timeframe: "2 months remaining"
    },
    {
        id: 2,
        name: "Mitochondrial Function",
        progress: 85,
        timeframe: "On track"
    },
    {
        id: 3,
        name: "Epigenetic Age Reduction",
        progress: 62,
        timeframe: "4 months remaining"
    },
    {
        id: 4,
        name: "Stem Cell Vitality",
        progress: 91,
        timeframe: "Target achieved"
    }
];
//# sourceMappingURL=page.js.map