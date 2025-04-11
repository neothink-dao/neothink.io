import { SignUpForm } from '@neothink/auth'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Join the Ascenders Community</h1>
        <p className="mt-2 text-sm text-gray-600">
          Begin your journey to higher consciousness
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Already an Ascender?{' '}
          <Link href="/login" className="text-black hover:text-gray-800">
            Sign in to your account
          </Link>
        </p>
      </div>
      <SignUpForm />
    </div>
  )
} 