import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {data.user.email}</h2>
        <p className="text-gray-600">This is your dashboard for the Hub platform.</p>
      </div>
    </div>
  )
} 