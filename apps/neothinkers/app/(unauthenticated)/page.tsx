import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold text-center mb-8">
        Welcome to Neothinkers
      </h1>
      <p className="text-xl text-center mb-12 max-w-2xl">
        Enjoy greater HAPPINESS as a Neothinker (integrated thinker) by becoming happier 
        and your happiest through your access to Neothink + Mark Hamilton + Neothinkers.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/auth/sign-in"
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Sign In
        </Link>
        <Link
          href="/auth/sign-up"
          className="px-6 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
        >
          Join Now
        </Link>
      </div>
    </main>
  )
} 