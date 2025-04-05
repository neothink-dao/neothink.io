"use client"

import * as React from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

interface NavMainProps {
  items: NavItem[]
}

const NavItem = React.memo(({ item }: { item: NavItem }) => {
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

NavItem.displayName = "NavItem"

export const NavMain = React.memo(function NavMain({ items }: NavMainProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </SidebarMenu>
  )
})

NavMain.displayName = "NavMain" 