import { ForgotPasswordForm } from '@neothink/auth'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset your Immortals password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <ForgotPasswordForm />
      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-black hover:text-gray-800"
        >
          Return to login
        </Link>
      </div>
    </div>
  )
} 