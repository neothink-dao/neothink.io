import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '@neothink/database-types';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: any;
  created_at: string;
}

interface ChatSubscriptionOptions {
  userId: string;
  conversationId?: string;
  appName?: string;
  limit?: number;
  onInsert?: (message: ChatMessage) => void;
  onUpdate?: (message: ChatMessage) => void;
  onDelete?: (id: string) => void;
}

export function useChatSubscription({
  userId,
  conversationId,
  appName,
  limit = 50,
  onInsert,
  onUpdate,
  onDelete
}: ChatSubscriptionOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    let subscription: RealtimeChannel;
    
    async function fetchMessages() {
      setIsLoading(true);
      setError(null);

      try {
        // Build query
        let query = supabase
          .from('chat_messages')
          .select('*, conversations!inner(*)')
          .order('created_at', { ascending: true })
          .limit(limit);

        // Apply filters
        if (conversationId) {
          // Specific conversation
          query = query.eq('conversation_id', conversationId);
        } else {
          // All user conversations, optionally filtered by app
          query = query.eq('conversations.user_id', userId);
          
          if (appName) {
            query = query.eq('conversations.app_name', appName);
          }
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(`Error fetching messages: ${fetchError.message}`);
        }

        // Format message data
        const formattedMessages = data?.map(item => ({
          id: item.id,
          conversation_id: item.conversation_id,
          user_id: item.user_id,
          role: item.role as 'user' | 'assistant' | 'system',
          content: item.content,
          metadata: item.metadata,
          created_at: item.created_at
        })) || [];

        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error in chat subscription:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    // Initial fetch
    fetchMessages();

    // Set up real-time subscription
    if (conversationId) {
      // Subscribe to specific conversation
      subscription = supabase
        .channel(`chat_${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          if (onInsert) onInsert(newMessage);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          const updatedMessage = payload.new as ChatMessage;
          setMessages(prev => 
            prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
          );
          if (onUpdate) onUpdate(updatedMessage);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          const deletedId = payload.old.id;
          setMessages(prev => prev.filter(msg => msg.id !== deletedId));
          if (onDelete) onDelete(deletedId);
        })
        .subscribe();
    } else {
      // Subscribe to all user conversations
      let channelFilter = `user_id=eq.${userId}`;
      
      subscription = supabase
        .channel(`user_chats_${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: channelFilter
        }, () => {
          // When a new conversation is created, refetch to get all messages
          fetchMessages();
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
          // No filter here as we can't directly filter on join conditions
          // We'll handle filtering in the payload processor
        }, async (payload) => {
          // For new messages, we need to check if they belong to this user's conversations
          const newMessageId = payload.new.id;
          const { data } = await supabase
            .from('chat_messages')
            .select('*, conversations!inner(*)')
            .eq('id', newMessageId)
            .eq('conversations.user_id', userId)
            .single();

          if (data) {
            const newMessage = {
              id: data.id,
              conversation_id: data.conversation_id,
              user_id: data.user_id,
              role: data.role as 'user' | 'assistant' | 'system',
              content: data.content,
              metadata: data.metadata,
              created_at: data.created_at
            };
            
            // If appName is specified, only add messages from that app
            if (!appName || data.conversations?.app_name === appName) {
              setMessages(prev => [...prev, newMessage]);
              if (onInsert) onInsert(newMessage);
            }
          }
        })
        .subscribe();
    }

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, userId, conversationId, appName, limit, onInsert, onUpdate, onDelete]);

  return { messages, isLoading, error };
}

// Helper hook to get a single conversation
export function useConversation(conversationId: string) {
  const [conversation, setConversation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    async function fetchConversation() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (fetchError) {
          throw new Error(`Error fetching conversation: ${fetchError.message}`);
        }

        setConversation(data);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversation();

    // Set up subscription to conversation updates
    const subscription = supabase
      .channel(`conversation_${conversationId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `id=eq.${conversationId}`
      }, (payload) => {
        setConversation(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, conversationId]);

  return { conversation, isLoading, error };
}

// Helper function to start a new conversation
export async function startNewConversation(
  supabase: any,
  userId: string, 
  appName: string, 
  initialMessage?: string
) {
  try {
    // Create new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        app_name: appName,
        title: initialMessage ? initialMessage.substring(0, 50) + (initialMessage.length > 50 ? '...' : '') : 'New Conversation',
      })
      .select()
      .single();

    if (conversationError) throw conversationError;

    // If we have an initial message, add it
    if (initialMessage) {
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          user_id: userId,
          role: 'user',
          content: initialMessage
        });

      if (messageError) throw messageError;
    }

    return conversation;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
}

// Helper function to send a message to a conversation
export async function sendMessage(
  supabase: any,
  conversationId: string, 
  userId: string,
  content: string,
  role: 'user' | 'assistant' | 'system' = 'user',
  metadata: any = {}
) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: role === 'user' ? userId : null,
        role,
        content,
        metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
} 