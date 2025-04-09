import React from 'react';
import { useUserProgress } from '@neothink/hooks';
import { analytics } from '@neothink/analytics';
import Link from 'next/link';
import { Button } from '@neothink/ui';
import { ArrowRightIcon } from 'lucide-react';

/**
 * Discover page for the Hub platform
 * This is the fully functional landing page that is always unlocked
 * 
 * See DEVELOPMENT.md for details on the user progress system
 */
export default function DiscoverPage() {
  // Track page view when the component mounts
  React.useEffect(() => {
    analytics.page('hub', '/discover');
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Discover Neothink
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your Journey</h2>
          
          <p className="text-gray-700 mb-6">
            Welcome to Neothink Hub, your gateway to a transformative journey of personal growth and development.
            Here you'll discover powerful tools, insights, and a community dedicated to helping you unlock your
            full potential.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <FeatureCard 
              title="Learn" 
              description="Access curated content designed to expand your mind and provide practical tools for growth."
            />
            
            <FeatureCard 
              title="Connect" 
              description="Join a community of like-minded individuals on similar journeys of self-discovery."
            />
            
            <FeatureCard 
              title="Grow" 
              description="Track your progress and celebrate milestones as you develop new skills and insights."
            />
            
            <FeatureCard 
              title="Transform" 
              description="Experience profound shifts in how you think, feel, and interact with the world."
            />
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => {
                analytics.trackContentInteraction('hub', 'discover-cta', 'click', { action: 'start_journey' });
              }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <span>Start Your Journey</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Your Path Forward</h2>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            <div className="relative z-10">
              <PathStep 
                number={1} 
                title="Discover" 
                description="Begin your journey by exploring the foundational ideas and concepts."
                active={true}
              />
              
              <PathStep 
                number={2} 
                title="Onboard" 
                description="Dive deeper and get equipped with essential tools and practices."
                active={false}
                comingSoon={true}
              />
              
              <PathStep 
                number={3} 
                title="Progress" 
                description="Apply what you've learned and track your growth over time."
                active={false}
              />
              
              <PathStep 
                number={4} 
                title="Endgame" 
                description="Achieve mastery and experience transformation in key areas of your life."
                active={false}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">What Members Are Saying</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Testimonial 
              quote="Neothink has completely transformed how I approach challenges in my life. The tools I've gained are invaluable."
              author="Sarah J."
            />
            
            <Testimonial 
              quote="Being part of this community has opened my eyes to new possibilities. I'm growing in ways I never imagined."
              author="Michael T."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PathStep({ 
  number, 
  title, 
  description, 
  active, 
  comingSoon 
}: { 
  number: number; 
  title: string; 
  description: string; 
  active: boolean;
  comingSoon?: boolean;
}) {
  return (
    <div className="flex mb-12">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
        active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}>
        {number}
      </div>
      
      <div className="ml-6">
        <h3 className="text-xl font-semibold flex items-center">
          {title}
          {comingSoon && (
            <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              Coming Soon
            </span>
          )}
        </h3>
        
        <p className="text-gray-600 mt-1">{description}</p>
        
        {active && (
          <Link 
            href={`/${title.toLowerCase()}`}
            className="inline-block mt-3 text-indigo-600 hover:text-indigo-800"
            onClick={() => {
              analytics.trackContentInteraction('hub', `path-${title.toLowerCase()}`, 'click');
            }}
          >
            Explore Now →
          </Link>
        )}
      </div>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <p className="italic text-gray-700 mb-4">"{quote}"</p>
      <p className="text-gray-500 font-medium">— {author}</p>
    </div>
  );
} 