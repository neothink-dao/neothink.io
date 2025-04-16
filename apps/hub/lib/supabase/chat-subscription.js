import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
/**
 * Hook for subscribing to real-time chat history updates
 */
export function useChatSubscription(options) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let channel = null;
        async function initSubscription() {
            try {
                setIsLoading(true);
                // Initial data load
                let query = supabase
                    .from('chat_history')
                    .select('*')
                    .eq('app_name', 'hub')
                    .order('created_at', { ascending: true });
                // Filter by conversation ID if provided
                if (options.conversationId) {
                    query = query.eq('conversation_id', options.conversationId);
                }
                // Filter by user ID if provided
                if (options.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error: fetchError } = await query;
                if (fetchError) {
                    throw fetchError;
                }
                setMessages(data);
                // Set up realtime subscription
                channel = supabase
                    .channel('chat-updates')
                    .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_history',
                    filter: options.conversationId
                        ? `conversation_id=eq.${options.conversationId}`
                        : `app_name=eq.hub${options.userId ? ` AND user_id=eq.${options.userId}` : ''}`,
                }, (payload) => {
                    var _a;
                    const newMessage = payload.new;
                    setMessages((prev) => [...prev, newMessage]);
                    (_a = options.onInsert) === null || _a === void 0 ? void 0 : _a.call(options, newMessage);
                })
                    .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'chat_history',
                    filter: options.conversationId
                        ? `conversation_id=eq.${options.conversationId}`
                        : `app_name=eq.hub${options.userId ? ` AND user_id=eq.${options.userId}` : ''}`,
                }, (payload) => {
                    var _a;
                    const updatedMessage = payload.new;
                    setMessages((prev) => prev.map((msg) => msg.id === updatedMessage.id ? updatedMessage : msg));
                    (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, updatedMessage);
                })
                    .on('postgres_changes', {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'chat_history',
                    filter: options.conversationId
                        ? `conversation_id=eq.${options.conversationId}`
                        : `app_name=eq.hub${options.userId ? ` AND user_id=eq.${options.userId}` : ''}`,
                }, (payload) => {
                    var _a;
                    const deletedId = payload.old.id;
                    setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
                    (_a = options.onDelete) === null || _a === void 0 ? void 0 : _a.call(options, deletedId);
                })
                    .subscribe();
            }
            catch (err) {
                console.error('Error setting up chat subscription:', err);
                setError(err instanceof Error ? err : new Error(String(err)));
            }
            finally {
                setIsLoading(false);
            }
        }
        initSubscription();
        // Cleanup on unmount
        return () => {
            channel === null || channel === void 0 ? void 0 : channel.unsubscribe();
        };
    }, [options.conversationId, options.userId, supabase]);
    return { messages, isLoading, error };
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
export const subscribeToChatUpdates = (userId, appName = 'hub', onMessage) => {
    // Subscribe to chat_history changes for the specific user and app
    const channel = supabase
        .channel('chat_updates')
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_history',
        filter: `user_id=eq.${userId} AND app_name=eq.${appName}`
    }, (payload) => {
        onMessage(payload.new);
    })
        .subscribe();
    return channel;
};
// Example usage in a React component:
/*
import { useEffect } from 'react'
// import { useUser } from '@supabase/auth-helpers-react'
import { subscribeToChatUpdates, type ChatMessage } from './chat-subscription'

export function ChatComponent() {
  // const user = useUser()

  useEffect(() => {
    // if (!user) return

    const channel = subscribeToChatUpdates(user.id, 'hub', (message) => {
      console.log('New chat message:', message)
      // Update your UI state here
    })

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  return (
    // Your chat UI
  )
}
*/ 
//# sourceMappingURL=chat-subscription.js.map