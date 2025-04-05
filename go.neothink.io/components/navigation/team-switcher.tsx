"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  PlusIcon,
  ArrowUpIcon,
  BrainIcon,
  InfinityIcon,
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

type Team = Readonly<{
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  url: string
  isExternal?: boolean
}>

const teams: readonly Team[] = [
  {
    id: "neothink-plus",
    name: "Neothink+",
    icon: PlusIcon,
    url: "/app/(authenticated)/dashboard",
  },
  {
    id: "ascender",
    name: "Ascender",
    icon: ArrowUpIcon,
    url: "https://www.joinascenders.org/dashboard",
    isExternal: true,
  },
  {
    id: "neothinker",
    name: "Neothinker",
    icon: BrainIcon,
    url: "https://www.joinneothinkers.org/dashboard",
    isExternal: true,
  },
  {
    id: "immortal",
    name: "Immortal",
    icon: InfinityIcon,
    url: "https://www.joinimmortals.org/dashboard",
    isExternal: true,
  },
]

const TeamItem = React.memo(({ team, isActive }: { readonly team: Team; isActive: boolean }) => {
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    // Handle click if needed
  }, [])

  return (
    <SidebarMenuItem>
      {team.isExternal ? (
        <a
          href={team.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <SidebarMenuButton
            onClick={handleClick}
            aria-current={isActive ? "page" : undefined}
            aria-label={team.name}
          >
            <team.icon className="h-4 w-4" aria-hidden="true" />
            <span>{team.name}</span>
          </SidebarMenuButton>
        </a>
      ) : (
        <Link href={team.url} passHref legacyBehavior>
          <SidebarMenuButton
            onClick={handleClick}
            aria-current={isActive ? "page" : undefined}
            aria-label={team.name}
          >
            <team.icon className="h-4 w-4" aria-hidden="true" />
            <span>{team.name}</span>
          </SidebarMenuButton>
        </Link>
      )}
    </SidebarMenuItem>
  )
})

TeamItem.displayName = "TeamItem"

export const TeamSwitcher = React.memo(function TeamSwitcher() {
  const pathname = usePathname()

  return (
    <SidebarMenu role="navigation" aria-label="Team navigation">
      {teams.map((team) => (
        <TeamItem 
          key={team.id} 
          team={team} 
          isActive={!team.isExternal && pathname.startsWith(team.url)}
        />
      ))}
    </SidebarMenu>
  )
})

TeamSwitcher.displayName = "TeamSwitcher" 