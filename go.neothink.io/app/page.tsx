'use client'

import { useTheme } from '../../lib/context/theme-context'
import { Suspense } from 'react';
import { HubHeader } from '../components/HubHeader';
import { ContentListWrapper } from './ContentListWrapper';
import { RealtimeUpdates } from '../components/RealtimeUpdates';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { useAuthentication } from '@/lib/hooks'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Hub platform homepage
 * 
 * Uses:
 * - @neothink/core for Supabase data fetching with RLS
 * - @neothink/analytics for tracking page views and analytics summaries
 * - @neothink/ui for UI components
 * - @neothink/hooks for data fetching and authentication
 * 
 * @see DEVELOPMENT.md#using-app-templates - Using App Templates section
 * @see SUPABASE.md#row-level-security - Row Level Security implementation
 */
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/discover')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to Neothink+ Hub</h1>
      <p>Please sign in to continue your journey</p>
    </main>
  )
} 