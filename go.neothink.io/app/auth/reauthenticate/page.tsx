import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReauthenticateForm } from "@/components/reauthenticate-form"

export default async function ReauthenticatePage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reauthenticate</h1>
          <p className="text-sm text-muted-foreground">
            Please verify your identity to continue
          </p>
        </div>
        <ReauthenticateForm />
      </div>
    </div>
  )
} 