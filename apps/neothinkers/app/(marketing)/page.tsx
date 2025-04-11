import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MarketingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Neothinkers
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Join a community of forward-thinking individuals dedicated to personal growth,
            innovation, and intellectual advancement.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <Button size="lg">Join Community</Button>
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
            Discover the tools and resources that will help you expand your intellectual horizons.
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
    title: "Think Tank Sessions",
    description:
      "Participate in collaborative problem-solving and idea generation sessions.",
  },
  {
    title: "Knowledge Exchange",
    description:
      "Share and learn from diverse perspectives in our intellectual community.",
  },
  {
    title: "Innovation Labs",
    description:
      "Access tools and frameworks for developing breakthrough ideas.",
  },
  {
    title: "Research Projects",
    description:
      "Engage in cutting-edge research and development initiatives.",
  },
  {
    title: "Mentorship",
    description:
      "Connect with experienced thought leaders and innovators.",
  },
  {
    title: "Resource Library",
    description:
      "Access curated content on innovation, creativity, and critical thinking.",
  },
] 