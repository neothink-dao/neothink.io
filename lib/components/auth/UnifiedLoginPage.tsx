import React from 'react';
import { CrossPlatformAuth } from '../../shared';
import { getSiteConfig } from '../../config/sites';
import Link from 'next/link';

interface UnifiedLoginPageProps {
  platformId: 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
  redirectTo?: string;
  mode?: 'signin' | 'signup';
}

export default function UnifiedLoginPage({
  platformId,
  redirectTo = '/dashboard',
  mode = 'signin'
}: UnifiedLoginPageProps) {
  const config = getSiteConfig(platformId);
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <img
            className="h-12 w-auto"
            src={config.logoSrc}
            alt={config.name}
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' 
            ? `Sign in to ${config.name}`
            : `Join ${config.name}`
          }
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'signin'
            ? "Enter your credentials to access your account"
            : "Create an account to get started"
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CrossPlatformAuth 
            mode={mode}
            tenantSlug={config.tenantSlug}
            redirectTo={redirectTo}
          />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15.545 6.558a9.42 9.42 0 0 0 .139 1.626c2.434-.243 4.316-2.193 4.316-4.593 0-2.545-2.067-4.591-4.61-4.591a4.589 4.589 0 0 0-4.525 5.303 4.591 4.591 0 0 0 2.431 3.642l1.39-2.221c-.139-.11-1.262-1.032-1.262-2.421 0-1.657 1.344-2.99 3.001-2.99 1.657 0 3 1.332 3 2.99 0 1.389-1.121 2.309-1.259 2.419l-1.39 2.22c.696.346 1.348.577 1.76.657.422.082.991.145 1.673.145h.166c-.264.741-1.045 1.215-1.833 1.215h-.536A4.585 4.585 0 0 0 6.303 9.3a4.59 4.59 0 0 0-3.647-1.966A4.592 4.592 0 0 0 0 10c0 2.545 2.067 4.591 4.61 4.591a4.585 4.585 0 0 0 4.313-2.931l-1.999-1.042c-.613 1.204-1.775 1.973-3.091 1.973a3.002 3.002 0 0 1 0-6c1.655 0 2.99 1.344 2.99 3.001 0 .243-.035.484-.101.707l2.068 1.199a9.421 9.421 0 0 0-.139-1.626L6.56 7.5a4.587 4.587 0 0 0-1.066-2.851 4.587 4.587 0 0 0-2.772-1.436c1.269-.504 2.733-.504 4.001 0a4.59 4.59 0 0 0 2.772 1.436 4.59 4.59 0 0 0 1.066 2.851L15.545 6.558z"></path>
                  </svg>
                </a>
              </div>
              
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with LinkedIn</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338h-2.485V12.5c0-.926-.017-2.116-1.29-2.116-1.29 0-1.486 1.007-1.486 2.048v3.906h-2.485V8.076h2.385v1.094h.033c.33-.624 1.137-1.282 2.344-1.282 2.508 0 2.97 1.65 2.97 3.794v4.656zm-10.338 0H3.515V8.076H6v8.262zM4.756 7.076a1.442 1.442 0 11-2.884 0 1.442 1.442 0 012.884 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 