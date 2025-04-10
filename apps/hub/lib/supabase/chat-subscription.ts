import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type ChatMessage = {
  id: string
  app_name: string
  user_id: string
  session_id: string
  message: string
  role: 'user' | 'assistant' | 'system'
  created_at: string
  conversation_id?: string
  tokens_used: number
  metadata: Record<string, any>
}

type SubscriptionOptions = {
  conversationId?: string
  userId?: string
  onInsert?: (message: ChatMessage) => void
  onUpdate?: (message: ChatMessage) => void
  onDelete?: (id: string) => void
}

/**
 * Hook for subscribing to real-time chat history updates
 */
export function useChatSubscription(options: SubscriptionOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    let channel: RealtimeChannel | null = null
    
    async function initSubscription() {
      try {
        setIsLoading(true)
        
        // Initial data load
        let query = supabase
          .from('chat_history')
          .select('*')
          .eq('app_name', 'hub')
          .order('created_at', { ascending: true })
        
        // Filter by conversation ID if provided
        if (options.conversationId) {
          query = query.eq('conversation_id', options.conversationId)
        }
        
        // Filter by user ID if provided
        if (options.userId) {
          query = query.eq('user_id', options.userId)
        }
        
        const { data, error: fetchError } = await query
        
        if (fetchError) {
          throw fetchError
        }
        
        setMessages(data as ChatMessage[])
        
        // Set up realtime subscription
        channel = supabase
          .channel('chat-updates')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_history',
              filter: options.conversationId 
                ? `conversation_id=eq.${options.conversationId}` 
                : `app_name=eq.hub${options.userId ? ` AND user_id=eq.${options.userId}` : ''}`,
            },
            (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
              const newMessage = payload.new as ChatMessage
              setMessages((prev) => [...prev, newMessage])
              options.onInsert?.(newMessage)
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'chat_history',
              filter: options.conversationId 
                ? `conversation_id=eq.${options.conversationId}` 
                : `app_name=eq.hub${options.userId ? ` AND user_id=eq.${options.userId}` : ''}`,
            },
            (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
              const updatedMessage = payload.new as ChatMessage
              setMessages((prev) => 
                prev.map((msg) => msg.id === updatedMessage.id ? updatedMessage : msg)
              )
              options.onUpdate?.(updatedMessage)
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'chat_history',
              filter: options.conversationId 
                ? `conversation_id=eq.${options.conversationId}` 
                : `app_name=eq.hub${options.userId ? ` AND user_id=eq.${options.userId}` : ''}`,
            },
            (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
              const deletedId = payload.old.id as string
              setMessages((prev) => prev.filter((msg) => msg.id !== deletedId))
              options.onDelete?.(deletedId)
            }
          )
          .subscribe()
          
      } catch (err) {
        console.error('Error setting up chat subscription:', err)
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
  }, [options.conversationId, options.userId, supabase])
  
  return { messages, isLoading, error }
}

/**
 * Example usage in a component:
 * 
 * ```tsx
 * function ChatContainer({ conversationId, userId }: { conversationId: string, userId: string }) {
 *   const { messages, isLoading, error } = useChatSubscription({
 *     conversationId,
 *     userId,
 *     onInsert: (message) => {
 *       // Custom handling for new messages, e.g., play sound for notifications
 *       if (message.role === 'assistant') {
 *         playNotificationSound()
 *       }
 *     }
 *   })
 *   
 *   if (isLoading) return <div>Loading chat history...</div>
 *   if (error) return <div>Error loading chat: {error.message}</div>
 *   
 *   return (
 *     <div className="chat-container">
 *       {messages.map((message) => (
 *         <ChatMessage key={message.id} message={message} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */ 