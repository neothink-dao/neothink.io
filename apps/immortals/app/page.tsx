'use client';

import { Button } from '@neothink/ui';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Immortals</h1>
      <p className="text-xl mb-8">Your journey to health and longevity starts here</p>
      <Button variant="immortals">Get Started</Button>
    </main>
  );
} 