import { FormEvent, ReactNode } from 'react'
import { createClient } from '../lib/supabase/client'

interface AuthFormProps {
  children: ReactNode
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  error?: string
  loading?: boolean
}

export function AuthForm({ children, onSubmit, error, loading }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
      {loading && (
        <div className="text-center text-gray-500">
          Processing...
        </div>
      )}
    </form>
  )
} 