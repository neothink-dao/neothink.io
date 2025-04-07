'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ProfileForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Input placeholder="Name" />
      </div>
      <div className="space-y-2">
        <Input type="email" placeholder="Email" disabled />
      </div>
      <div className="space-y-2">
        <Textarea placeholder="Bio" />
      </div>
      <Button type="submit">Save Profile</Button>
    </form>
  )
} 