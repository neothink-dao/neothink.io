"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User, ArrowUp, Clock, Trophy } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    activeDays: 0,
    achievementsCount: 0,
    platformsCount: 0,
    streak: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        // Fetch user profile for platforms count
        const { data: profile } = await supabase
          .from('profiles')
          .select('platforms')
          .eq('id', userId)
          .single()
          
        // Get user activity stats
        const { data: activities } = await supabase
          .from('user_activities')
          .select('created_at')
          .eq('user_id', userId)
        
        // Get achievements count
        const { data: achievements } = await supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', userId)
        
        // Calculate active days from activities
        const uniqueDays = new Set()
        activities?.forEach(activity => {
          const date = new Date(activity.created_at).toDateString()
          uniqueDays.add(date)
        })
        
        setStats({
          activeDays: uniqueDays.size,
          achievementsCount: achievements?.length || 0,
          platformsCount: profile?.platforms?.length || 0,
          streak: Math.min(7, uniqueDays.size) // Simplified streak calculation
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStats()
  }, [userId])
  
  const stats_items = [
    {
      name: "Active Days",
      value: stats.activeDays,
      icon: Clock,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Achievements",
      value: stats.achievementsCount,
      icon: Trophy,
      color: "bg-amber-100 text-amber-600"
    },
    {
      name: "Platforms",
      value: stats.platformsCount,
      icon: User, 
      color: "bg-purple-100 text-purple-600"
    },
    {
      name: "Current Streak",
      value: stats.streak,
      icon: ArrowUp,
      color: "bg-green-100 text-green-600"
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats_items.map((item) => {
        const Icon = item.icon
        return (
          <div 
            key={item.name}
            className="flex items-center rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className={`mr-4 rounded-full ${item.color} p-3`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{item.name}</h3>
              <p className="text-2xl font-semibold">
                {isLoading ? "-" : item.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
} 