import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MarketingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to NeoThink Hub
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Your central platform for accessing all NeoThink resources. Connect with our community,
            access educational content, and track your progress.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Discover what makes NeoThink Hub your essential platform for growth and learning.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="relative overflow-hidden rounded-lg border p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const features = [
  {
    title: "Centralized Knowledge",
    description:
      "Access all NeoThink resources in one place, organized and easy to navigate.",
  },
  {
    title: "Community Connection",
    description:
      "Connect with like-minded individuals and participate in meaningful discussions.",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey and track achievements across all platforms.",
  },
  {
    title: "Personalized Learning",
    description:
      "Get customized recommendations based on your interests and goals.",
  },
  {
    title: "Live Events",
    description:
      "Join webinars, workshops, and live sessions with thought leaders.",
  },
  {
    title: "Resource Library",
    description:
      "Access a vast collection of articles, videos, and learning materials.",
  },
] 