import { BookOpen, Brain, Star, Quote, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
export default function MarkHamiltonPage() {
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-bold">Mark Hamilton</h1>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Founder of Neothink® and pioneer of integrated thinking methodologies
          </p>
        </header>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-indigo-900 mb-4">Vision & Mission</h2>
              <p className="text-lg text-indigo-700 mb-6">
                Dedicated to unlocking human potential through revolutionary thinking methodologies and integrated knowledge systems.
              </p>
              <Link href="/neothink/vision" className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Learn More <ArrowRight size={20} className="ml-2"/>
              </Link>
            </div>
            <div className="space-y-4">
              {visionPoints.map((point, index) => (<div key={index} className="flex items-start space-x-3 bg-white bg-opacity-50 p-4 rounded-lg">
                  <Star className="text-yellow-500 flex-shrink-0" size={20}/>
                  <p className="text-indigo-900">{point}</p>
                </div>))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {contributions.map(contribution => (<div key={contribution.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                {contribution.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{contribution.title}</h3>
              <p className="text-gray-600 mb-4">{contribution.description}</p>
              <Link href={contribution.link} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                Explore <ArrowRight size={16} className="ml-1"/>
              </Link>
            </div>))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Featured Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map(insight => (<div key={insight.id} className="p-6 bg-gray-50 rounded-lg">
                <Quote className="text-indigo-600 mb-4" size={24}/>
                <blockquote className="text-lg text-gray-700 mb-4">
                  "{insight.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{insight.source}</div>
                    <div className="text-sm text-gray-500">{insight.context}</div>
                  </div>
                  <Link href={`/insights/${insight.id}`} className="text-indigo-600 hover:text-indigo-800">
                    Read More
                  </Link>
                </div>
              </div>))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map(event => (<div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-indigo-600" size={20}/>
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar size={14} className="mr-1"/>
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Latest Publications</h2>
            <div className="space-y-4">
              {publications.map(pub => (<Link key={pub.id} href={`/publications/${pub.id}`} className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{pub.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pub.description}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400"/>
                  </div>
                </Link>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
const visionPoints = [
    "Empowering individuals to achieve their full cognitive potential",
    "Creating integrated knowledge systems for enhanced understanding",
    "Developing revolutionary thinking methodologies"
];
const contributions = [
    {
        id: 1,
        title: "Neothink® System",
        description: "A comprehensive methodology for integrated thinking and knowledge acquisition",
        icon: <Brain className="text-indigo-600" size={24}/>,
        link: "/neothink/system"
    },
    {
        id: 2,
        title: "Published Works",
        description: "Extensive collection of books and publications on advanced thinking methods",
        icon: <BookOpen className="text-indigo-600" size={24}/>,
        link: "/publications"
    },
    {
        id: 3,
        title: "Teaching Legacy",
        description: "Decades of mentoring and guiding individuals in personal development",
        icon: <Star className="text-indigo-600" size={24}/>,
        link: "/legacy"
    }
];
const insights = [
    {
        id: 1,
        quote: "The power of integrated thinking lies in its ability to connect seemingly unrelated concepts into powerful new insights.",
        source: "Neothink® Principles",
        context: "Chapter on Integration"
    },
    {
        id: 2,
        quote: "True progress comes from the ability to see beyond traditional boundaries and integrate knowledge across disciplines.",
        source: "Advanced Thinking Methods",
        context: "Introduction"
    }
];
const events = [
    {
        id: 1,
        title: "Neothink® Integration Workshop",
        description: "Learn advanced integration techniques and methodologies",
        date: "June 15, 2024"
    },
    {
        id: 2,
        title: "Advanced Thinking Symposium",
        description: "Exploring the frontiers of integrated knowledge systems",
        date: "July 22, 2024"
    }
];
const publications = [
    {
        id: 1,
        title: "The Neothink® System",
        description: "Comprehensive guide to integrated thinking methodologies"
    },
    {
        id: 2,
        title: "Advanced Integration Techniques",
        description: "Practical applications of neothinking principles"
    },
    {
        id: 3,
        title: "Beyond Traditional Thinking",
        description: "Breaking through conventional mental boundaries"
    }
];
//# sourceMappingURL=page.js.map