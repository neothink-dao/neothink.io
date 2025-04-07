import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PropsWithChildren } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"

export const metadata = {
  title: "Dashboard - Neothink Hub",
  description: "Neothink Hub Dashboard",
}

export default async function AuthenticatedLayout({ children }: PropsWithChildren) {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar user={data.user} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <TopNav user={data.user} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
        
        <footer className="border-t p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Neothink Hub. All rights reserved.
        </footer>
      </div>
    </div>
  )
} 