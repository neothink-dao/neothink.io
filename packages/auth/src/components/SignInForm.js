"use client";
import { useState } from 'react';
import { createPlatformClient } from '../lib/supabase/client';
import { AuthForm } from './AuthForm';
export function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(undefined);
        setLoading(true);
        try {
            const supabase = createPlatformClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setError(error.message);
                return;
            }
            // Redirect handled by middleware
        }
        catch (err) {
            setError('An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    }
    return (<AuthForm onSubmit={handleSubmit} error={error} loading={loading}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"/>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"/>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 disabled:opacity-50">
        Sign In
      </button>
    </AuthForm>);
}
//# sourceMappingURL=SignInForm.js.map