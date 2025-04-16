'use client';

import { Button } from '@neothink/ui';
import { Hero } from '@neothink/ui/components/marketing'

export default function ImmortalsLandingPage() {
  return (
    <main>
      <Hero
        platform="immortals"
        title="Transcend the Ordinary"
        subtitle="Join an elite community of visionaries dedicated to achieving immortality through groundbreaking advances in consciousness and technology."
        ctaText="Begin Transcendence"
        ctaLink="/signup"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        imageSrc="/images/immortals-preview.jpg"
      />
      {/* Additional marketing sections will be added here */}
    </main>
  );
} 