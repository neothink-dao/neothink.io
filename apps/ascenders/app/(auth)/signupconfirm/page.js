import Link from 'next/link';
export default function SignUpConfirmPage() {
    return (<div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, Future Ascender!</h1>
      <p className="mt-2 text-sm text-gray-600">
        We've sent you a confirmation link. Please check your email to begin your ascension journey.
      </p>
      <div className="mt-6">
        <Link href="/login" className="text-black hover:text-gray-800">
          Return to login
        </Link>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map