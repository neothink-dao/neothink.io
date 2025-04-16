"use client";

import { useSearchParams } from 'next/navigation'

export function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            {error}
          </div>
          <div className="mt-6 text-center">
            <a
              href="/auth/login"
              className="text-black hover:text-gray-800"
            >
              Return to login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 