import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FeaturesPage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="flex max-w-[64rem] flex-col items-start gap-4">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Platform Features
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Discover the powerful tools and capabilities that make NeoThink Hub
            the ultimate platform for personal growth and development.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col gap-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Core Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div key={feature.title} className="rounded-lg border p-6">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                <ul className="mt-4 space-y-2">
                  {feature.capabilities.map((capability) => (
                    <li key={capability} className="text-sm">
                      • {capability}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col gap-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Platform Integrations
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {integrations.map((integration) => (
              <div key={integration.title} className="rounded-lg border p-6">
                <h3 className="font-bold">{integration.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{integration.description}</p>
                <div className="mt-4">
                  <Link href={integration.link}>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col gap-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Coming Soon
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature) => (
              <div key={feature.title} className="rounded-lg border p-6">
                <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {feature.eta}
                </div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Join thousands of users already benefiting from our platform.
          </p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const coreFeatures = [
  {
    title: "Unified Dashboard",
    description: "Access all your NeoThink resources in one place",
    capabilities: [
      "Customizable widgets",
      "Progress tracking",
      "Resource recommendations",
      "Quick navigation",
    ],
  },
  {
    title: "Community Engagement",
    description: "Connect and collaborate with like-minded individuals",
    capabilities: [
      "Discussion forums",
      "Live chat",
      "Event participation",
      "Mentorship matching",
    ],
  },
  {
    title: "Learning Management",
    description: "Track and manage your learning journey",
    capabilities: [
      "Course progress tracking",
      "Achievement badges",
      "Learning paths",
      "Resource bookmarking",
    ],
  },
]

const integrations = [
  {
    title: "Cross-Platform Sync",
    description: "Seamlessly sync your progress and data across all NeoThink platforms.",
    link: "/features/sync",
  },
  {
    title: "API Access",
    description: "Build custom integrations with our comprehensive API.",
    link: "/features/api",
  },
]

const upcomingFeatures = [
  {
    title: "AI-Powered Insights",
    description: "Personalized recommendations and insights powered by advanced AI.",
    eta: "Q2 2024",
  },
  {
    title: "Mobile App",
    description: "Access NeoThink Hub on the go with our native mobile application.",
    eta: "Q3 2024",
  },
  {
    title: "Virtual Events Platform",
    description: "Host and participate in immersive virtual events and workshops.",
    eta: "Q4 2024",
  },
] 