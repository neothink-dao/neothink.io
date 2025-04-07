"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { Star, MessageSquare, Clock, Award } from "lucide-react"

interface Activity {
  id: string
  user_id: string
  activity_type: string
  platform: string
  description: string
  created_at: string
  metadata?: Record<string, any>
}

interface DashboardActivityProps {
  userId: string
}

export function DashboardActivity({ userId }: DashboardActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchActivities() {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
          
        if (error) throw error
        
        setActivities(data || [])
      } catch (error) {
        console.error('Error fetching user activities:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchActivities()
  }, [userId])
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex animate-pulse items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-10">
        <Clock className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No activities yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start using the platforms to see your activity here.
        </p>
      </div>
    )
  }
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-amber-600" />
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case 'favorite':
        return <Star className="h-5 w-5 text-purple-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {getActivityIcon(activity.activity_type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <span>{formatDate(activity.created_at)}</span>
                <span className="mx-1">•</span>
                <span className="capitalize">{activity.platform}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="pt-2 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-700">
          View all activity
        </button>
      </div>
    </div>
  )
}