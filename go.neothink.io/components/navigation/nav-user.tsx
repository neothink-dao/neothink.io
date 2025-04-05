"use client"

import * as React from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface UserNavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

interface NavUserProps {
  items: UserNavItem[]
}

const UserNavItem = React.memo(({ item }: { item: UserNavItem }) => {
  const handleClick = React.useCallback(() => {
    // Handle click if needed
  }, [])

  return (
    <SidebarMenuItem>
      <Link href={item.url} passHref legacyBehavior>
        <SidebarMenuButton onClick={handleClick}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  )
})

UserNavItem.displayName = "UserNavItem"

export const NavUser = React.memo(function NavUser({ items }: NavUserProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <UserNavItem key={item.title} item={item} />
      ))}
    </SidebarMenu>
  )
})

NavUser.displayName = "NavUser" 