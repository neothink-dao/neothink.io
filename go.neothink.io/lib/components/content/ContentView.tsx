'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContentView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content will be displayed here</p>
      </CardContent>
    </Card>
  )
} 