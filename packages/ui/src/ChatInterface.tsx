import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatSubscription } from '@neothink/hub/lib/supabase/chat-subscription';

interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string;
}

interface ChatInterfaceProps {
  appName: 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
  userId: string;
  onSendMessage: (message: string) => Promise<void>;
  className?: string;
}

const appThemes = {
  hub: {
    primary: 'bg-indigo-600',
    secondary: 'bg-indigo-100',
    accent: 'text-indigo-600',
    gradient: 'from-indigo-500 to-purple-600'
  },
  ascenders: {
    primary: 'bg-emerald-600',
    secondary: 'bg-emerald-100',
    accent: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-600'
  },
  immortals: {
    primary: 'bg-violet-600',
    secondary: 'bg-violet-100',
    accent: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600'
  },
  neothinkers: {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-100',
    accent: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600'
  }
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  appName,
  userId,
  onSendMessage,
  className = ''
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = appThemes[appName];

  // Use real-time chat subscription
  const { messages, isLoading, error } = useChatSubscription({
    userId,
    onInsert: (message) => {
      if (message.role === 'assistant') {
        setIsTyping(false);
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsTyping(true);
    setInputMessage('');
    await onSendMessage(inputMessage.trim());
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`flex flex-col h-full rounded-lg overflow-hidden shadow-xl ${className}`}>
      {/* Header */}
      <div className={`${theme.primary} px-4 py-3 text-white`}>
        <h3 className="text-lg font-semibold">Neothink AI Assistant</h3>
        <p className="text-sm opacity-80">Ask me anything about {appName.charAt(0).toUpperCase() + appName.slice(1)}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={messageVariants}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? `${theme.primary} text-white`
                    : `${theme.secondary} ${theme.accent}`
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`${theme.secondary} rounded-lg px-4 py-2`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': `var(--${appName}-primary)` } as any}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className={`${theme.primary} text-white px-6 py-2 rounded-lg font-medium 
              hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}; 