import { RealtimeChannel } from '@supabase/supabase-js';
export interface ChatMessage {
    id: string;
    user_id: string;
    app_name: string;
    message: string;
    role: 'user' | 'assistant' | 'system';
    metadata: Record<string, any>;
    created_at: string;
    session_id?: string;
    conversation_id?: string;
    tokens_used: number;
}
type SubscriptionOptions = {
    conversationId?: string;
    userId?: string;
    onInsert?: (message: ChatMessage) => void;
    onUpdate?: (message: ChatMessage) => void;
    onDelete?: (id: string) => void;
};
/**
 * Hook for subscribing to real-time chat history updates
 */
export declare function useChatSubscription(options: SubscriptionOptions): {
    messages: ChatMessage[];
    isLoading: boolean;
    error: Error | null;
};
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
export declare const subscribeToChatUpdates: (userId: string, appName: string | undefined, onMessage: (message: ChatMessage) => void) => RealtimeChannel;
export {};
//# sourceMappingURL=chat-subscription.d.ts.map