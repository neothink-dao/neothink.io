import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardActivity } from "@/components/dashboard/activity"
import { DashboardPlatforms } from "@/components/dashboard/platforms"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Verify authentication
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single()

  // Check if onboarding is completed, redirect if not
  if (!profile?.onboarding_completed) {
    redirect("/onboarding")
  }

  // Get user's platform access
  const platforms = profile?.platforms || []

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {profile?.full_name || authData.user.email}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats userId={authData.user.id} />

      {/* Platform Access */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Your Platforms</h2>
        <DashboardPlatforms platforms={platforms} />
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <DashboardActivity userId={authData.user.id} />
      </div>
    </div>
  )
} 