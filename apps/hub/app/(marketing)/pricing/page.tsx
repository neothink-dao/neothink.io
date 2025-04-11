import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Choose Your Path to Excellence
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Each platform delivers unique, standalone value. Subscribe to unlock your full potential.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="space-y-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Ascenders */}
          <div className="flex flex-col rounded-lg border p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Ascenders</h3>
              <p className="text-sm text-muted-foreground">
                Enable unprecedented levels of prosperity through systematic business growth
              </p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">$197</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {ascendersFeatures.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/signup?platform=ascenders" className="w-full">
                <Button className="w-full">Join Ascenders</Button>
              </Link>
            </div>
          </div>

          {/* Neothinkers */}
          <div className="flex flex-col rounded-lg border p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Neothinkers</h3>
              <p className="text-sm text-muted-foreground">
                Achieve unprecedented happiness through integrated personal development
              </p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">$197</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {neothinkersFeatures.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/signup?platform=neothinkers" className="w-full">
                <Button className="w-full">Join Neothinkers</Button>
              </Link>
            </div>
          </div>

          {/* Immortals */}
          <div className="flex flex-col rounded-lg border p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Immortals</h3>
              <p className="text-sm text-muted-foreground">
                Premium platform for advanced health optimization and longevity
              </p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">$197</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {immortalsFeatures.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/signup?platform=immortals" className="w-full">
                <Button className="w-full">Join Immortals</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Superachiever Status */}
      <section className="space-y-6 py-8">
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
              Superachiever Status
            </h2>
            <p className="max-w-[42rem] text-muted-foreground sm:text-lg">
              Subscribe to all three platforms to unlock exclusive benefits and savings
            </p>
            <ul className="mt-6 space-y-3">
              {superachieverBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/signup?plan=superachiever">
                <Button size="lg" className="bg-primary">
                  Become a Superachiever
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 py-8">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border p-6">
              <h3 className="font-bold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-y-6 py-8">
        <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
            Ready to Transform Your Life?
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Choose your platform and begin your journey to excellence.
          </p>
          <div className="flex gap-4">
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const ascendersFeatures = [
  "Complete Ascension System",
  "FLOW Framework Implementation",
  "Business Growth Strategies",
  "Value Creation Tools",
  "Ascenders Community Access",
  "Neothink+ Hub Integration",
]

const neothinkersFeatures = [
  "Neothink University Access",
  "Mark Hamilton's Vision",
  "Advanced Thinking Tools",
  "Personal Development System",
  "Neothinkers Community",
  "Neothink+ Hub Integration",
]

const immortalsFeatures = [
  "Complete Longevity System",
  "Health Optimization Platform",
  "Wellness Journey Tools",
  "Advanced Health Protocols",
  "Immortals Community Access",
  "Neothink+ Hub Integration",
]

const superachieverBenefits = [
  "Full access to all three premium platforms",
  "Exclusive Superachiever community",
  "Priority support and mentorship",
  "Early access to new features",
  "Special event access and VIP treatment",
  "Cross-platform integration benefits",
]

const faqs = [
  {
    question: "What is Neothink+ Hub?",
    answer: "Neothink+ Hub is our central platform that connects all your subscriptions. It's included with any platform subscription and enhances your experience when using multiple platforms.",
  },
  {
    question: "Can I subscribe to multiple platforms?",
    answer: "Yes! Each platform delivers unique value independently. When you subscribe to all three platforms, you automatically achieve Superachiever status with exclusive benefits.",
  },
  {
    question: "How do I achieve Superachiever status?",
    answer: "Subscribe to all three platforms (Ascenders, Neothinkers, and Immortals) to automatically unlock Superachiever status and its exclusive benefits.",
  },
  {
    question: "Can I switch between platforms?",
    answer: "Yes, you can modify your subscriptions at any time. Each platform subscription is independent, and your benefits will adjust accordingly, including Superachiever status if applicable.",
  },
] 