import Link from "next/link"
import Image from "next/image"
import { PropsWithChildren } from "react"

export const metadata = {
  title: "Neothink Hub",
  description: "Your gateway to the Neothink ecosystem",
}

export default function UnauthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt="Neothink Hub Logo" 
              width={32} 
              height={32} 
            />
            <span className="text-xl font-bold">Neothink Hub</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link href="/platforms" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Platforms
              </Link>
              <Link href="/resources" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Resources
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log in
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                About Us
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-gray-600 hover:text-blue-600">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-600 hover:text-blue-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Platforms
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="https://joinascenders.org" className="text-sm text-gray-600 hover:text-blue-600">
                    Ascenders
                  </Link>
                </li>
                <li>
                  <Link href="https://joinneothinkers.org" className="text-sm text-gray-600 hover:text-blue-600">
                    Neothinkers
                  </Link>
                </li>
                <li>
                  <Link href="https://joinimmortals.org" className="text-sm text-gray-600 hover:text-blue-600">
                    Immortals
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Resources
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-gray-600 hover:text-blue-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-gray-600 hover:text-blue-600">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-gray-600 hover:text-blue-600">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Neothink Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 