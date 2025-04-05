"use client"

import * as React from "react"
import { 
  HomeIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  PanelLeft,
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import { TeamSwitcher } from "@/components/navigation/team-switcher"
import { Button } from "@/components/ui/button"

// Sample data - replace with your actual data
const user = {
  name: "John Doe",
  email: "john@example.com",
  image: "/avatars/john.png",
}

const teams = [
  {
    id: "1",
    name: "Team Alpha",
    icon: UsersIcon,
    isActive: true,
  },
  {
    id: "2",
    name: "Team Beta",
    icon: UsersIcon,
  },
]

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: "Team",
    url: "/team",
    icon: UsersIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
]

const userNavItems = [
  {
    title: "Logout",
    url: "/auth/logout",
    icon: LogOutIcon,
  },
]

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Neothink</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <TeamSwitcher teams={teams} />
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser items={userNavItems} />
      </SidebarFooter>
    </Sidebar>
  )
} 