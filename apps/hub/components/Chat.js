import React, { useState, useRef, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useChatSubscription } from '../lib/supabase/chat-subscription';
import { motion, AnimatePresence } from 'framer-motion';

// Message typing animation
const TypingIndicator = () => (
  <div className="flex space-x-2 p-2 bg-gray-100 rounded-lg w-16 justify-center">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

// Message types
export const MessageTypes = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

const DEFAULT_WELCOME_MESSAGE = 'Hello! How can I assist you today?';

export function ChatInterface({
  appName = 'hub',
  apiEndpoint = '/api/chat',
  showTitle = true,
  maxHeight = '500px',
  welcomeMessage = DEFAULT_WELCOME_MESSAGE,
  theme = {}, // Custom theme overrides
}) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  // App-specific styling with defaults and custom overrides
  const getAppTheme = () => {
    const defaultThemes = {
      hub: {
        primary: 'indigo',
        gradient: 'from-indigo-600 to-purple-600',
        bg: 'bg-indigo-50',
        bubbleBgUser: 'bg-indigo-600',
        bubbleBgAssistant: 'bg-white',
        bubbleTextUser: 'text-white',
        bubbleTextAssistant: 'text-gray-800',
      },
      ascenders: {
        primary: 'green',
        gradient: 'from-green-600 to-emerald-600',
        bg: 'bg-green-50',
        bubbleBgUser: 'bg-green-600',
        bubbleBgAssistant: 'bg-white',
        bubbleTextUser: 'text-white',
        bubbleTextAssistant: 'text-gray-800',
      },
      immortals: {
        primary: 'blue',
        gradient: 'from-blue-600 to-cyan-600',
        bg: 'bg-blue-50',
        bubbleBgUser: 'bg-blue-600',
        bubbleBgAssistant: 'bg-white',
        bubbleTextUser: 'text-white',
        bubbleTextAssistant: 'text-gray-800',
      },
      neothinkers: {
        primary: 'red',
        gradient: 'from-red-600 to-orange-600',
        bg: 'bg-red-50',
        bubbleBgUser: 'bg-red-600',
        bubbleBgAssistant: 'bg-white',
        bubbleTextUser: 'text-white',
        bubbleTextAssistant: 'text-gray-800',
      },
    };

    // Merge default theme with custom overrides
    return {
      ...defaultThemes[appName],
      ...theme,
    };
  };

  const appTheme = getAppTheme();

  // Subscribe to real-time chat updates
  const { messages, isLoading } = useChatSubscription({
    conversationId,
    userId: user?.id,
    onInsert: (message) => {
      if (message.role === 'assistant') {
        setIsTyping(false);
      }
    },
  });

  // Create welcome message if no messages
  const displayMessages = messages.length > 0 ? messages : [
    {
      id: 'welcome',
      app_name: appName,
      role: MessageTypes.ASSISTANT,
      message: welcomeMessage,
      created_at: new Date().toISOString(),
    }
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, isTyping]);

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isSubmitting || !user) return;
    
    setInputValue('');
    setIsSubmitting(true);
    setIsTyping(true);
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          appName,
          sessionId,
          conversationId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      // Update session tracking
      setSessionId(data.sessionId);
      setConversationId(data.conversationId);
      
      // Note: We don't need to update messages manually
      // The real-time subscription will handle that
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {showTitle && (
        <div className={`bg-gradient-${appTheme.gradient} p-4`}>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="mr-2">{appName.charAt(0).toUpperCase() + appName.slice(1)} Assistant</span>
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </h3>
        </div>
      )}
      
      <div 
        className={`${appTheme.bg} p-4 overflow-y-auto`}
        style={{ maxHeight, minHeight: '300px' }}
      >
        <AnimatePresence initial={false}>
          {displayMessages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={`mb-4 ${
                message.role === MessageTypes.USER ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block rounded-lg p-3 max-w-[80%] ${
                  message.role === MessageTypes.USER
                    ? `${appTheme.bubbleBgUser} ${appTheme.bubbleTextUser}`
                    : `${appTheme.bubbleBgAssistant} ${appTheme.bubbleTextAssistant} shadow-sm`
                }`}
              >
                {message.message}
              </div>
              <div className={`text-xs mt-1 text-gray-500 ${
                message.role === MessageTypes.USER ? 'text-right' : 'text-left'
              }`}>
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-left mb-4"
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-${appTheme.primary}-500 transition-all duration-200`}
            disabled={isSubmitting || !user}
          />
          <button
            type="submit"
            className={`bg-${appTheme.primary}-600 hover:bg-${appTheme.primary}-700 text-white p-3 rounded-r-lg disabled:opacity-50 transition-colors duration-200 flex items-center justify-center w-14`}
            disabled={isSubmitting || !inputValue.trim() || !user}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        {!user && (
          <div className="mt-2 text-center">
            <p className="text-sm text-red-500 font-medium">
              Please log in to use the chat feature
            </p>
            <a 
              href="/login" 
              className={`inline-block mt-1 text-${appTheme.primary}-600 hover:underline text-sm`}
            >
              Sign in now
            </a>
          </div>
        )}
      </form>
    </div>
  );
} 