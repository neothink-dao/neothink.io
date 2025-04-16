import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function AboutPage() {
    return (<div className="container py-10">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="flex max-w-[64rem] flex-col items-start gap-4">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            About NeoThink Hub
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Empowering individuals to reach their full potential through interconnected
            platforms for financial, intellectual, and physical growth.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col gap-4">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Our Mission
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            We believe in creating a world where everyone has access to the tools,
            knowledge, and community needed to achieve extraordinary results in their lives.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Innovation First</h3>
              <p className="text-sm text-muted-foreground">
                We constantly push boundaries and explore new possibilities in personal development.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Our strength comes from our diverse, engaged community of forward-thinkers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col gap-4">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Our Platforms
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="https://hub.neothink.io" className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <h3 className="font-bold">Hub</h3>
              <p className="text-sm text-muted-foreground">
                Your central gateway to all NeoThink resources and communities.
              </p>
            </Link>
            <Link href="https://ascenders.neothink.io" className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <h3 className="font-bold">Ascenders</h3>
              <p className="text-sm text-muted-foreground">
                Master wealth building and financial independence.
              </p>
            </Link>
            <Link href="https://neothinkers.neothink.io" className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <h3 className="font-bold">Neothinkers</h3>
              <p className="text-sm text-muted-foreground">
                Expand your intellectual horizons and innovative thinking.
              </p>
            </Link>
            <Link href="https://immortals.neothink.io" className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <h3 className="font-bold">Immortals</h3>
              <p className="text-sm text-muted-foreground">
                Optimize your health and longevity through science.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col gap-4">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Leadership Team
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (<div key={member.name} className="rounded-lg border p-4">
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="mt-2 text-sm">{member.bio}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Join Our Mission
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Be part of a community that's shaping the future of human potential.
          </p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);
}
const team = [
    {
        name: "Dr. Sarah Chen",
        role: "Chief Executive Officer",
        bio: "20+ years experience in technology and human potential development.",
    },
    {
        name: "Michael Rodriguez",
        role: "Chief Technology Officer",
        bio: "Former Silicon Valley executive, passionate about scalable innovation.",
    },
    {
        name: "Dr. James Wilson",
        role: "Chief Research Officer",
        bio: "Leading researcher in longevity science and human optimization.",
    },
];
//# sourceMappingURL=page.js.map