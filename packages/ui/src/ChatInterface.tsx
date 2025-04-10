import React, { useState, useRef, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  appName: 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
  apiEndpoint?: string;
  showTitle?: boolean;
  maxHeight?: string;
}

const defaultMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! How can I assist you today?',
    timestamp: new Date(),
  },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  appName,
  apiEndpoint = '/api/chat',
  showTitle = true,
  maxHeight = '500px',
}) => {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  // App-specific styling
  const getAppTheme = () => {
    switch (appName) {
      case 'hub':
        return {
          primary: '#4f46e5',
          gradient: 'from-indigo-600 to-purple-600',
          bg: 'bg-indigo-50',
        };
      case 'ascenders':
        return {
          primary: '#16a34a',
          gradient: 'from-green-600 to-emerald-600',
          bg: 'bg-green-50',
        };
      case 'immortals':
        return {
          primary: '#0284c7',
          gradient: 'from-blue-600 to-cyan-600',
          bg: 'bg-blue-50',
        };
      case 'neothinkers':
        return {
          primary: '#dc2626',
          gradient: 'from-red-600 to-orange-600',
          bg: 'bg-red-50',
        };
    }
  };

  const theme = getAppTheme();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('app_name', appName)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert database records to messages format
          const historyMessages: Message[] = [];
          
          data.reverse().forEach((item) => {
            historyMessages.push({
              id: `${item.id}-user`,
              role: 'user',
              content: item.message,
              timestamp: new Date(item.created_at),
            });
            
            historyMessages.push({
              id: `${item.id}-assistant`,
              role: 'assistant',
              content: item.response,
              timestamp: new Date(item.created_at),
            });
          });
          
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    
    fetchChatHistory();
  }, [appName, supabase, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isSubmitting || !user) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          appName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      const botMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-gray-200">
      {showTitle && (
        <div className={`bg-gradient-${theme.gradient} p-4`}>
          <h3 className="text-lg font-semibold text-white">
            {appName.charAt(0).toUpperCase() + appName.slice(1)} Assistant
          </h3>
        </div>
      )}
      
      <div 
        className={`${theme.bg} p-4 overflow-y-auto`}
        style={{ maxHeight }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block rounded-lg p-3 max-w-[80%] ${
                message.role === 'user'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting || !user}
          />
          <button
            type="submit"
            className={`bg-${theme.primary} text-white p-2 rounded-r-md disabled:opacity-50`}
            disabled={isSubmitting || !inputValue.trim() || !user}
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin">↻</span>
            ) : (
              'Send'
            )}
          </button>
        </div>
        {!user && (
          <p className="text-xs text-red-500 mt-1">
            Please log in to use the chat feature.
          </p>
        )}
      </form>
    </div>
  );
}; 