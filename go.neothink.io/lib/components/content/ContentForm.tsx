'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContentForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Input placeholder="Title" />
      </div>
      <div className="space-y-2">
        <Textarea placeholder="Content" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
} 