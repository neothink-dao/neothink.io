import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InviteUserForm } from "@/components/invite-user-form"

export default async function InvitePage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Invite User</h1>
          <p className="text-sm text-muted-foreground">
            Enter the email address of the user you want to invite
          </p>
        </div>
        <InviteUserForm />
      </div>
    </div>
  )
} 