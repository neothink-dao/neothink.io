"use client";
import { useState } from 'react';
import { createPlatformClient } from '../lib/supabase/client';
import { AuthForm } from './AuthForm';
export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(undefined);
        setLoading(true);
        try {
            const supabase = createPlatformClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update`,
            });
            if (error) {
                setError(error.message);
                return;
            }
            setSubmitted(true);
        }
        catch (err) {
            setError('An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    }
    if (submitted) {
        return (<div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent you a password reset link. Please check your email.
        </p>
        <div className="mt-6">
          <a href="/auth/login" className="text-black hover:text-gray-800">
            Return to login
          </a>
        </div>
      </div>);
    }
    return (<AuthForm onSubmit={handleSubmit} error={error} loading={loading}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"/>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 disabled:opacity-50">
        Reset Password
      </button>
    </AuthForm>);
}
//# sourceMappingURL=ForgotPasswordForm.js.map