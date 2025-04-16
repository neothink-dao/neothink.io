import { SignInForm } from '@neothink/auth';
import Link from 'next/link';
export default function LoginPage() {
    return (<div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back to Neothinkers</h1>
        <p className="mt-2 text-sm text-gray-600">
          Continue your journey of intellectual exploration
        </p>
        <p className="mt-2 text-sm text-gray-600">
          New to Neothinkers?{' '}
          <Link href="/signup" className="text-black hover:text-gray-800">
            Create an account
          </Link>
        </p>
      </div>
      <SignInForm />
      <div className="text-center text-sm">
        <Link href="/forgotpassword" className="text-black hover:text-gray-800">
          Forgot your password?
        </Link>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map