"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const supabase = createClient()

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserIcon
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings
    }
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div 
      className={cn(
        "flex h-screen flex-col border-r bg-white transition-all", 
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <h1 className="text-xl font-bold">Neothink Hub</h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 hover:bg-gray-100"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm",
                "transition-colors duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon size={20} className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        {!collapsed && (
          <div className="mb-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user.email?.[0].toUpperCase() || "U"}
            </div>
            <div className="flex-1 truncate">
              <div className="font-medium">{user.email}</div>
              <div className="text-xs text-gray-500">Member</div>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center rounded-md px-3 py-2 text-sm text-red-700",
            "hover:bg-red-50 transition-colors duration-200",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} className={collapsed ? "mx-auto" : "mr-3"} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )
} 