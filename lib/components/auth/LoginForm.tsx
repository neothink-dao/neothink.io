"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

import { cn } from "../../../lib/utils"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

export type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  /**
   * Platform slug to identify the platform (hub, ascenders, neothinkers, immortals)
   */
  platformSlug?: string;
  /**
   * URL to redirect to after successful login
   */
  redirectUrl?: string;
  /**
   * Text to display in the login button
   */
  loginButtonText?: string;
  /**
   * URL to redirect to for signup
   */
  signUpUrl?: string;
  /**
   * URL to redirect to for forgot password
   */
  forgotPasswordUrl?: string;
  /**
   * Custom card title
   */
  cardTitle?: string;
  /**
   * Custom card description
   */
  cardDescription?: string;
  /**
   * Custom error handler
   */
  onError?: (error: Error) => void;
  /**
   * Custom success handler
   */
  onSuccess?: (userId: string) => void;
};

export function LoginForm({
  className,
  platformSlug = "hub",
  redirectUrl = "/dashboard",
  loginButtonText = "Login",
  signUpUrl = "/auth/sign-up",
  forgotPasswordUrl = "/auth/forgot-password",
  cardTitle = "Login",
  cardDescription = "Enter your email below to login to your account",
  onError,
  onSuccess,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Include platform-specific headers
      const headers = {
        "x-site-platform": platformSlug
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }, {
        options: {
          // Pass platform-specific headers
          headers
        }
      })

      if (error) throw error

      if (data?.user) {
        // Call onSuccess handler if provided
        onSuccess?.(data.user.id)
        // Redirect to specified URL
        router.push(redirectUrl)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      // Call onError handler if provided
      if (error instanceof Error && onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href={forgotPasswordUrl}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : loginButtonText}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={signUpUrl} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 