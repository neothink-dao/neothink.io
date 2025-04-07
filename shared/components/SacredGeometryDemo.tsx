import React from 'react';
import { SacredCard, SacredCardGrid } from './SacredCard';
import { SacredButton, SacredButtonGroup } from './SacredButton';
import { pattern369 } from '../styles/sacred-geometry';

/**
 * Demo component showcasing the Sacred Geometry Design System
 * across all four platforms
 */
export function SacredGeometryDemo() {
  // Sample data with 9 items (pattern of 9)
  const sampleItems = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: 'This component demonstrates the sacred geometry design system with patterns of 3, 6, and 9 throughout the layout.',
    imageUrl: `https://picsum.photos/id/${pattern369.nearestMultipleOf9(i * 10 + 30)}/800/500`,
  }));
  
  return (
    <div className="sacred-geometry-demo">
      <h1 className="text-3xl font-bold text-center mb-9">Sacred Geometry Design System</h1>
      
      {/* Ascenders Section */}
      <section className="mb-27">
        <h2 className="text-2xl font-semibold mb-6 text-orange-600 dark:text-orange-400">
          Ascenders Platform (Orange Accent)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 mb-9">
          {/* Card Variants */}
          <SacredCard 
            platform="ascenders" 
            title="Primary Card"
            variant="primary"
          >
            <p className="mb-6">This card uses the primary variant with orange accent.</p>
            <SacredButton platform="ascenders" variant="secondary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="ascenders" 
            title="Secondary Card"
            variant="secondary"
          >
            <p className="mb-6">This card uses the secondary variant with orange border.</p>
            <SacredButton platform="ascenders" variant="primary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="ascenders" 
            title="Gradient Card"
            variant="gradient"
          >
            <p className="mb-6">This card uses the gradient variant with orange to zinc.</p>
            <SacredButton platform="ascenders" variant="ghost" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
        </div>
        
        {/* Button Group */}
        <div className="mb-9">
          <h3 className="text-xl font-semibold mb-3 text-orange-600 dark:text-orange-400">
            Ascenders Buttons
          </h3>
          <SacredButtonGroup platform="ascenders">
            <SacredButton platform="ascenders" variant="primary">Primary</SacredButton>
            <SacredButton platform="ascenders" variant="secondary">Secondary</SacredButton>
            <SacredButton platform="ascenders" variant="gradient">Gradient</SacredButton>
            <SacredButton platform="ascenders" variant="ghost">Ghost</SacredButton>
          </SacredButtonGroup>
        </div>
        
        {/* Card Grid with 3 cards */}
        <SacredCardGrid platform="ascenders">
          {sampleItems.slice(0, 3).map(item => (
            <SacredCard
              key={item.id}
              platform="ascenders"
              title={item.title}
              imageUrl={item.imageUrl}
              variant="secondary"
            >
              <p>{item.description}</p>
            </SacredCard>
          ))}
        </SacredCardGrid>
      </section>
      
      {/* Neothinkers Section */}
      <section className="mb-27">
        <h2 className="text-2xl font-semibold mb-6 text-amber-600 dark:text-amber-400">
          Neothinkers Platform (Amber Accent)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 mb-9">
          {/* Card Variants */}
          <SacredCard 
            platform="neothinkers" 
            title="Primary Card"
            variant="primary"
          >
            <p className="mb-3">This card uses the primary variant with amber accent.</p>
            <SacredButton platform="neothinkers" variant="secondary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="neothinkers" 
            title="Secondary Card"
            variant="secondary"
          >
            <p className="mb-3">This card uses the secondary variant with amber border.</p>
            <SacredButton platform="neothinkers" variant="primary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="neothinkers" 
            title="Gradient Card"
            variant="gradient"
          >
            <p className="mb-3">This card uses the gradient variant with amber to zinc.</p>
            <SacredButton platform="neothinkers" variant="ghost" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
        </div>
        
        {/* Button Group */}
        <div className="mb-9">
          <h3 className="text-xl font-semibold mb-3 text-amber-600 dark:text-amber-400">
            Neothinkers Buttons
          </h3>
          <SacredButtonGroup platform="neothinkers">
            <SacredButton platform="neothinkers" variant="primary">Primary</SacredButton>
            <SacredButton platform="neothinkers" variant="secondary">Secondary</SacredButton>
            <SacredButton platform="neothinkers" variant="gradient">Gradient</SacredButton>
            <SacredButton platform="neothinkers" variant="ghost">Ghost</SacredButton>
          </SacredButtonGroup>
        </div>
        
        {/* Card Grid with 3 cards */}
        <SacredCardGrid platform="neothinkers">
          {sampleItems.slice(3, 6).map(item => (
            <SacredCard
              key={item.id}
              platform="neothinkers"
              title={item.title}
              imageUrl={item.imageUrl}
              variant="secondary"
            >
              <p>{item.description}</p>
            </SacredCard>
          ))}
        </SacredCardGrid>
      </section>
      
      {/* Immortals Section */}
      <section className="mb-27">
        <h2 className="text-2xl font-semibold mb-9 text-red-600 dark:text-red-400">
          Immortals Platform (Red Accent)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 mb-9">
          {/* Card Variants */}
          <SacredCard 
            platform="immortals" 
            title="Primary Card"
            variant="primary"
          >
            <p className="mb-9">This card uses the primary variant with red accent.</p>
            <SacredButton platform="immortals" variant="secondary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="immortals" 
            title="Secondary Card"
            variant="secondary"
          >
            <p className="mb-9">This card uses the secondary variant with red border.</p>
            <SacredButton platform="immortals" variant="primary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="immortals" 
            title="Gradient Card"
            variant="gradient"
          >
            <p className="mb-9">This card uses the gradient variant with red to zinc.</p>
            <SacredButton platform="immortals" variant="ghost" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
        </div>
        
        {/* Button Group */}
        <div className="mb-9">
          <h3 className="text-xl font-semibold mb-9 text-red-600 dark:text-red-400">
            Immortals Buttons
          </h3>
          <SacredButtonGroup platform="immortals">
            <SacredButton platform="immortals" variant="primary">Primary</SacredButton>
            <SacredButton platform="immortals" variant="secondary">Secondary</SacredButton>
            <SacredButton platform="immortals" variant="gradient">Gradient</SacredButton>
            <SacredButton platform="immortals" variant="ghost">Ghost</SacredButton>
          </SacredButtonGroup>
        </div>
        
        {/* Card Grid with 3 cards */}
        <SacredCardGrid platform="immortals">
          {sampleItems.slice(6, 9).map(item => (
            <SacredCard
              key={item.id}
              platform="immortals"
              title={item.title}
              imageUrl={item.imageUrl}
              variant="secondary"
            >
              <p>{item.description}</p>
            </SacredCard>
          ))}
        </SacredCardGrid>
      </section>
      
      {/* Hub (go.neothink.io) Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
          Hub Platform (Amber-Orange-Red Gradient)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card Variants */}
          <SacredCard 
            platform="hub" 
            title="Primary Card"
            variant="primary"
          >
            <p className="mb-6">This card uses the primary variant with gradient accent.</p>
            <SacredButton platform="hub" variant="secondary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="hub" 
            title="Secondary Card"
            variant="secondary"
          >
            <p className="mb-6">This card uses the secondary variant with orange border.</p>
            <SacredButton platform="hub" variant="primary" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
          
          <SacredCard 
            platform="hub" 
            title="Gradient Card"
            variant="gradient"
          >
            <p className="mb-6">This card uses the full amber-orange-red gradient.</p>
            <SacredButton platform="hub" variant="ghost" size="sm">
              Learn More
            </SacredButton>
          </SacredCard>
        </div>
        
        {/* Button Group */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
            Hub Buttons
          </h3>
          <SacredButtonGroup platform="hub">
            <SacredButton platform="hub" variant="primary">Primary</SacredButton>
            <SacredButton platform="hub" variant="secondary">Secondary</SacredButton>
            <SacredButton platform="hub" variant="gradient">Gradient</SacredButton>
            <SacredButton platform="hub" variant="ghost">Ghost</SacredButton>
          </SacredButtonGroup>
        </div>
        
        {/* Grid of 3×3 cards for a total of 9 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SacredCardGrid platform="hub">
            {sampleItems.slice(0, 3).map(item => (
              <SacredCard
                key={item.id}
                platform="hub"
                title={item.title}
                imageUrl={item.imageUrl}
                variant="gradient"
              >
                <p>{item.description}</p>
              </SacredCard>
            ))}
          </SacredCardGrid>
        </div>
      </section>
    </div>
  );
} 