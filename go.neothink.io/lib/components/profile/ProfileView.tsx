'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileView() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>User Name</CardTitle>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No bio provided</p>
      </CardContent>
    </Card>
  )
} 