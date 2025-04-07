import Image from "next/image"
import { PropsWithChildren } from "react"

export const metadata = {
  title: "Authentication - Neothink Hub",
  description: "Sign in to your Neothink Hub account",
}

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Auth Form Section */}
      <div className="col-span-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Image 
              src="/logo.svg" 
              alt="Neothink Hub Logo" 
              width={80} 
              height={80}
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-center">Neothink Hub</h1>
            <p className="text-sm text-gray-500 text-center">
              Your gateway to the Neothink ecosystem
            </p>
          </div>
          {children}
        </div>
      </div>

      {/* Background Section - Hidden on Mobile */}
      <div className="col-span-1 hidden bg-blue-600 md:flex lg:col-span-2">
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to Neothink Hub</h2>
          <p className="text-xl mb-8 max-w-lg text-center">
            Access all Neothink platforms from one central location
          </p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="rounded-xl bg-white/10 p-6">
              <h3 className="text-lg font-semibold mb-2">Ascenders</h3>
              <p className="text-sm opacity-80">Prosperity and wealth creation</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6">
              <h3 className="text-lg font-semibold mb-2">Neothinkers</h3>
              <p className="text-sm opacity-80">Happiness and integrated thinking</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6">
              <h3 className="text-lg font-semibold mb-2">Immortals</h3>
              <p className="text-sm opacity-80">Health and longevity</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6">
              <h3 className="text-lg font-semibold mb-2">Hub</h3>
              <p className="text-sm opacity-80">Central command center</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 