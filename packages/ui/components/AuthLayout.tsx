import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  platform: 'hub' | 'ascenders' | 'neothinkers' | 'immortals'
}

export function AuthLayout({ children, platform }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {platform}
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        <div className="mt-6 text-center text-sm">
          <a href="/" className="text-gray-600 hover:text-gray-900">
            Return to home
          </a>
        </div>
      </div>
    </div>
  )
} 