'use client';

import { useState, useEffect, useRef } from 'react';
import { useSupabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Message typing animation
const TypingIndicator = () => (
  <div className="flex space-x-2 p-2 bg-gray-100 rounded-lg w-16 justify-center">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

// Quick help buttons for common queries
const QuickHelpButtons = ({ onSelect, appTheme }) => {
  const commonQuestions = [
    { id: 'help', label: 'Help' },
    { id: 'events', label: 'Events' },
    { id: 'membership', label: 'Membership' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {commonQuestions.map(question => (
        <button
          key={question.id}
          onClick={() => onSelect(question.id)}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-200 
            text-${appTheme.primary}-600 border border-${appTheme.primary}-300 
            hover:bg-${appTheme.primary}-50 hover:border-${appTheme.primary}-400 
            focus:outline-none focus:ring-2 focus:ring-${appTheme.primary}-500 focus:ring-opacity-50`}
        >
          {question.label}
        </button>
      ))}
    </div>
  );
};

// Message types
export const MessageTypes = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

const DEFAULT_WELCOME_MESSAGE = 'Hello! How can I assist you today?';

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(true);
  const messagesEndRef = useRef(null);
  const { supabase, session } = useSupabase();
  const { toast } = useToast();
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_history',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, supabase]);

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('app_name', 'hub')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        toast({
          title: 'Error loading messages',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setMessages(data || []);
    }

    loadMessages();
  }, [session?.user?.id, supabase, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          userId: session.user.id,
          type: 'chat',
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast({
        title: 'Message sent!',
        description: 'Your message has been processed successfully.',
      });

      setMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20,
      duration: 0.4 
    }},
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card className="bg-gradient-to-r from-blue-500/5 to-indigo-600/5 border-none shadow-lg">
        <div className="h-[600px] overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'assistant'
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {msg.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
} 