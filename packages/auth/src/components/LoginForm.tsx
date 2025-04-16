'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@neothink/ui';
import { Input } from '@neothink/ui';
import { useAuth } from '../hooks/useAuth';
import { PlatformSlug } from '@neothink/database';

export interface LoginFormProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Platform identifier
   */
  platformSlug: PlatformSlug;
  
  /**
   * Custom redirect URL
   */
  redirectUrl?: string;
  
  /**
   * Form title
   */
  title?: string;
  
  /**
   * Form description
   */
  description?: string;
  
  /**
   * Whether to show the forgot password link
   */
  showForgotPassword?: boolean;
  
  /**
   * Whether to show the sign up link
   */
  showSignUp?: boolean;
  
  /**
   * Custom sign up URL
   */
  signUpUrl?: string;
  
  /**
   * Custom forgot password URL
   */
  forgotPasswordUrl?: string;
  
  /**
   * Callback on successful login
   */
  onSuccess?: () => void;
  
  /**
   * Custom component to render as logo
   */
  logo?: React.ReactNode;
}

/**
 * Standardized login form component
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  platformSlug,
  redirectUrl,
  title = 'Sign in to your account',
  description = 'Enter your email below to login to your account',
  showForgotPassword = true,
  showSignUp = true,
  signUpUrl = '/auth/sign-up',
  forgotPasswordUrl = '/auth/forgot-password',
  onSuccess,
  logo,
  className,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signInWithPassword } = useAuth({ platformSlug });
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get return URL from search params or use default
  const returnUrl = searchParams?.get('returnUrl') || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signInWithPassword(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to return URL or custom redirect
      router.push(redirectUrl || returnUrl);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-background rounded-lg shadow-md" {...props}>
      {/* Logo or title */}
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        {logo && <div className="mb-4">{logo}</div>}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded text-sm text-destructive">
          {error}
        </div>
      )}
      
      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            
            {showForgotPassword && (
              <a
                href={forgotPasswordUrl}
                className="text-sm text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Forgot password?
              </a>
            )}
          </div>
          
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          variant={platformSlug === 'hub' ? 'primary' : platformSlug}
          width="full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
      
      {/* Sign up link */}
      {showSignUp && (
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <a
            href={signUpUrl}
            className="text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign up
          </a>
        </div>
      )}
    </div>
  );
};

export default LoginForm;