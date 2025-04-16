import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type Feedback = {
  id: string
  app_name: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  sentiment: string | null
  status: 'pending' | 'processing' | 'processed' | 'archived'
  metadata: Record<string, any>
}

type SubscriptionOptions = {
  appName?: string
  status?: Feedback['status']
  userId?: string
  onStatusChange?: (feedback: Feedback) => void
  onNewFeedback?: (feedback: Feedback) => void
}

/**
 * Hook for subscribing to real-time feedback updates
 * Optimized for admin dashboards to track feedback status changes
 */
export function useFeedbackSubscription(options: SubscriptionOptions) {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  useEffect(() => {
    let channel: RealtimeChannel | null = null
    
    async function initSubscription() {
      try {
        setIsLoading(true)
        
        // Initial data load
        let query = supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false })
        
        // Apply filters
        if (options.appName) {
          query = query.eq('app_name', options.appName)
        }
        
        if (options.status) {
          query = query.eq('status', options.status)
        }
        
        if (options.userId) {
          query = query.eq('user_id', options.userId)
        }
        
        const { data, error: fetchError } = await query
        
        if (fetchError) {
          throw fetchError
        }
        
        setFeedbackItems(data as Feedback[])
        
        // Set up realtime subscription
        let filterString = ''
        
        if (options.appName) {
          filterString += `app_name=eq.${options.appName}`
        }
        
        if (options.status) {
          filterString += filterString ? ` AND status=eq.${options.status}` : `status=eq.${options.status}`
        }
        
        if (options.userId) {
          filterString += filterString ? ` AND user_id=eq.${options.userId}` : `user_id=eq.${options.userId}`
        }
        
        // Subscribe to INSERT events
        channel = supabase
          .channel('feedback-updates')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'feedback',
              filter: filterString || undefined,
            },
            (payload: RealtimePostgresChangesPayload<Feedback>) => {
              const newFeedback = payload.new as Feedback
              setFeedbackItems((prev) => [newFeedback, ...prev])
              options.onNewFeedback?.(newFeedback)
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'feedback',
              filter: filterString || undefined,
            },
            (payload: RealtimePostgresChangesPayload<Feedback>) => {
              const updatedFeedback = payload.new as Feedback
              const oldFeedback = payload.old as Partial<Feedback>
              
              // Check if status has changed
              if (oldFeedback.status && updatedFeedback.status !== oldFeedback.status) {
                options.onStatusChange?.(updatedFeedback)
              }
              
              setFeedbackItems((prev) => 
                prev.map((item) => item.id === updatedFeedback.id ? updatedFeedback : item)
              )
            }
          )
          .subscribe()
          
      } catch (err) {
        console.error('Error setting up feedback subscription:', err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }
    
    initSubscription()
    
    // Cleanup on unmount
    return () => {
      channel?.unsubscribe()
    }
  }, [options.appName, options.status, options.userId, supabase])
  
  /**
   * Update feedback status
   */
  const updateFeedbackStatus = async (id: string, status: Feedback['status']) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      
      return true
    } catch (err) {
      console.error('Error updating feedback status:', err)
      return false
    }
  }
  
  return { 
    feedbackItems, 
    isLoading, 
    error,
    updateFeedbackStatus
  }
}

/**
 * Example usage in an admin dashboard:
 * 
 * ```tsx
 * function FeedbackDashboard() {
 *   const { feedbackItems, isLoading, error, updateFeedbackStatus } = useFeedbackSubscription({
 *     appName: 'hub',
 *     onStatusChange: (feedback) => {
 *       toast.success(`Feedback #${feedback.id.slice(0, 8)} status updated to ${feedback.status}`)
 *     },
 *     onNewFeedback: (feedback) => {
 *       toast.info('New feedback received!')
 *     }
 *   })
 *   
 *   if (isLoading) return <div>Loading feedback...</div>
 *   if (error) return <div>Error loading feedback: {error.message}</div>
 *   
 *   const processFeedback = async (id: string) => {
 *     const success = await updateFeedbackStatus(id, 'processing')
 *     if (success) {
 *       // Show processing indicator
 *     }
 *   }
 *   
 *   return (
 *     <div className="feedback-dashboard">
 *       <h2>Feedback Dashboard</h2>
 *       <table>
 *         <thead>
 *           <tr>
 *             <th>ID</th>
 *             <th>Content</th>
 *             <th>Sentiment</th>
 *             <th>Status</th>
 *             <th>Actions</th>
 *           </tr>
 *         </thead>
 *         <tbody>
 *           {feedbackItems.map((item) => (
 *             <tr key={item.id}>
 *               <td>{item.id.slice(0, 8)}...</td>
 *               <td>{item.content}</td>
 *               <td>{item.sentiment || 'Unknown'}</td>
 *               <td>{item.status}</td>
 *               <td>
 *                 <button onClick={() => processFeedback(item.id)}>Process</button>
 *                 <button onClick={() => updateFeedbackStatus(item.id, 'archived')}>Archive</button>
 *               </td>
 *             </tr>
 *           ))}
 *         </tbody>
 *       </table>
 *     </div>
 *   )
 * }
 * ```
 */ 