import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const platforms = [
    {
      name: "Ascenders",
      description: "Prosperity and wealth creation",
      url: "https://joinascenders.org",
      color: "bg-amber-500",
      icon: "/icons/ascenders.svg",
      features: ["Financial education", "Business strategies", "Wealth building"]
    },
    {
      name: "Neothinkers",
      description: "Happiness and integrated thinking",
      url: "https://joinneothinkers.org",
      color: "bg-blue-500",
      icon: "/icons/neothinkers.svg",
      features: ["Thought systems", "Mental models", "Personal growth"]
    },
    {
      name: "Immortals",
      description: "Health and longevity",
      url: "https://joinimmortals.org",
      color: "bg-green-500",
      icon: "/icons/immortals.svg",
      features: ["Health optimization", "Longevity science", "Well-being"]
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-10 md:mb-0 md:w-1/2">
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Your Gateway to the <span className="text-yellow-300">Neothink</span> Ecosystem
              </h1>
              <p className="mb-8 text-xl opacity-90">
                Discover a unified approach to human potential across business, thinking, and health.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  href="/platforms"
                  className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Explore Platforms
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="rounded-lg bg-blue-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-400"
                >
                  Create Account
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/images/hub-hero.png"
                alt="Neothink Hub Illustration"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Discovery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Discover Our Platforms</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Each platform is designed to help you excel in a specific dimension of human potential.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {platforms.map((platform) => (
              <div 
                key={platform.name} 
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className={`${platform.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                    <div className="h-12 w-12 rounded-full bg-white/20 p-2">
                      <Image 
                        src={platform.icon} 
                        alt={platform.name} 
                        width={32} 
                        height={32}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-white/90">{platform.description}</p>
                </div>
                
                <div className="flex-1 p-6">
                  <ul className="mb-6 space-y-3">
                    {platform.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={platform.url}
                    className="inline-block w-full rounded-md bg-gray-100 px-4 py-2 text-center font-medium text-gray-800 transition hover:bg-gray-200"
                  >
                    Visit {platform.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">How to Get Started</h2>
            <p className="mb-10 text-lg text-gray-600">
              Follow these simple steps to join the Neothink community and access all platforms.
            </p>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Create an Account</h3>
                <p className="text-gray-600">Sign up for a Neothink account to access all platforms.</p>
              </div>
              
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Choose Platforms</h3>
                <p className="text-gray-600">Select which platforms you'd like to engage with first.</p>
              </div>
              
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Start Your Journey</h3>
                <p className="text-gray-600">Begin your personalized journey toward reaching your potential.</p>
              </div>
            </div>
            
            <div className="mt-10">
              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 