import { Target, Clock, LineChart, Calendar, ArrowRight, CheckCircle, AlertCircle, Heart, Brain } from 'lucide-react';
import Link from 'next/link';

export default function ProjectLifePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">Project Life</h1>
            <p className="text-lg text-gray-600 mt-2">
              Your personalized roadmap to optimal longevity and life extension
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 flex items-center">
              <div className="mr-3">
                <Target className="text-emerald-600" size={20} />
              </div>
              <div>
                <div className="text-sm text-emerald-700 font-medium">Goal Progress</div>
                <div className="text-2xl font-bold text-emerald-800">87%</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Life Extension Timeline</h2>
            <div className="space-y-6">
              {timeline.map(milestone => (
                <div key={milestone.id} className="relative">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      {milestone.completed ? (
                        <CheckCircle className="text-emerald-600" size={20} />
                      ) : (
                        <Clock className="text-emerald-600" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{milestone.title}</h3>
                        <span className="text-sm text-gray-500">{milestone.date}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{milestone.description}</p>
                      <div className="mt-3 flex items-center space-x-4">
                        <div className="flex items-center">
                          <LineChart size={16} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{milestone.progress}% Complete</span>
                        </div>
                        <Link
                          href={`/milestones/${milestone.id}`}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                  {milestone.id !== timeline.length && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-emerald-100"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Next Actions</h2>
              <div className="space-y-3">
                {nextActions.map(action => (
                  <div key={action.id} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      action.priority === 'high' ? 'bg-red-100' : 'bg-emerald-100'
                    }`}>
                      {action.priority === 'high' ? (
                        <AlertCircle className="text-red-600" size={14} />
                      ) : (
                        <CheckCircle className="text-emerald-600" size={14} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-500 mt-1">Due: {action.due}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Assessments</h2>
              <div className="space-y-3">
                {assessments.map(assessment => (
                  <div key={assessment.id} className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{assessment.name}</h3>
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{assessment.date}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Heart className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900">Health Score</h3>
                  <p className="text-emerald-700">Excellent Condition</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">Overall Health</span>
                  <span className="font-medium text-emerald-900">95%</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6">Long-term Objectives</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {objectives.map(objective => (
              <div key={objective.id} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    {objective.icon}
                  </div>
                  <h3 className="font-bold">{objective.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{objective.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{objective.timeline}</span>
                  <span className="font-medium text-emerald-600">{objective.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const timeline = [
  {
    id: 1,
    title: "Initial Assessment & Baseline",
    description: "Complete comprehensive health and longevity assessment",
    date: "Completed",
    progress: 100,
    completed: true
  },
  {
    id: 2,
    title: "Protocol Implementation",
    description: "Begin core longevity protocols and establish monitoring systems",
    date: "In Progress",
    progress: 75,
    completed: false
  },
  {
    id: 3,
    title: "Advanced Integration",
    description: "Integrate advanced life extension technologies and methods",
    date: "Upcoming",
    progress: 0,
    completed: false
  }
];

const nextActions = [
  {
    id: 1,
    title: "Complete Telomere Assessment",
    due: "Tomorrow",
    priority: "high"
  },
  {
    id: 2,
    title: "Update Protocol Metrics",
    due: "This Week",
    priority: "normal"
  },
  {
    id: 3,
    title: "Review Latest Research",
    due: "Next Week",
    priority: "normal"
  }
];

const assessments = [
  {
    id: 1,
    name: "Quarterly Biomarker Analysis",
    date: "March 15, 2024"
  },
  {
    id: 2,
    name: "Cognitive Performance Review",
    date: "March 22, 2024"
  },
  {
    id: 3,
    name: "Physical Optimization Check",
    date: "April 1, 2024"
  }
];

const objectives = [
  {
    id: 1,
    title: "Biological Age Reduction",
    description: "Achieve and maintain biological age 20% below chronological age",
    timeline: "2-year goal",
    status: "On Track",
    icon: <LineChart className="text-emerald-600" size={20} />
  },
  {
    id: 2,
    title: "Cognitive Enhancement",
    description: "Optimize neural plasticity and cognitive performance metrics",
    timeline: "18-month goal",
    status: "Advancing",
    icon: <Brain className="text-emerald-600" size={20} />
  },
  {
    id: 3,
    title: "Cellular Regeneration",
    description: "Implement advanced cellular repair and regeneration protocols",
    timeline: "3-year goal",
    status: "Planning",
    icon: <Target className="text-emerald-600" size={20} />
  }
]; 