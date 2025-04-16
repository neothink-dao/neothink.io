import Link from 'next/link';
export default function VerifyEmail() {
    return (<div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border p-6 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold">Check your email</h2>
          <p className="mt-4 text-center text-gray-600">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>
        </div>
        <div className="text-center">
          <Link href="/auth/sign-in" className="text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map