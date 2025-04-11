'use client';

import { Button } from '@neothink/ui';
import { Hero } from '@neothink/ui/components/marketing'

export default function AscendersLandingPage() {
  return (
    <main>
      <Hero
        platform="ascenders"
        title="Elevate Your Consciousness"
        subtitle="Join a community of forward-thinking individuals dedicated to exploring higher states of consciousness and personal transformation."
        ctaText="Begin Your Journey"
        ctaLink="/signup"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        imageSrc="/images/ascenders-preview.jpg"
      />
      {/* Additional marketing sections will be added here */}
    </main>
  );
} 