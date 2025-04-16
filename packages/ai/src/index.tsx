// Export types
export * from './types';

// Export context utilities
export * from './context/context-extractor';

// Export providers
export * from './providers/base-provider';
export * from './providers/openai-provider';

// Export utility functions
export * from './utils/id';

// Export retrieval module
export * from './retrieval/supabase-vector-store';

// Export generation module
export * from './generation/text-generation';

// Export SupabaseAI
export * from './supabase-ai';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlatformSlug } from '@neothink/platform-bridge';
import { AIProviderType, GenerationRequest, GenerationResponse, ModelConfig } from './types';
import { BaseAIProvider } from './providers/base-provider';
import { OpenAIProvider } from './providers/openai-provider';
import { extractContext } from './context/context-extractor';
import { TextGenerationService } from './generation/text-generation';
import { SupabaseVectorStore } from './retrieval/supabase-vector-store';

/**
 * AI service context type
 */
interface AIServiceContextType {
  generateText: (prompt: string, options?: Partial<GenerationRequest>) => Promise<string>;
  generateStreamingText: (
    prompt: string, 
    onChunk: (chunk: string) => void,
    options?: Partial<GenerationRequest>
  ) => Promise<void>;
  isGenerating: boolean;
  error: Error | null;
}

// Create context
const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

// Provider props
interface AIServiceProviderProps {
  children: React.ReactNode;
  userId?: string;
  platform: PlatformSlug;
  provider?: AIProviderType;
  modelConfig?: Partial<ModelConfig>;
}

/**
 * AI Service Provider
 */
export const AIServiceProvider: React.FC<AIServiceProviderProps> = ({
  children,
  userId,
  platform,
  provider = 'openai',
  modelConfig
}) => {
  // State
  const [aiProvider, setAIProvider] = useState<BaseAIProvider | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        // Default config
        const defaultConfig: ModelConfig = {
          provider,
          modelName: provider === 'openai' ? 'gpt-4o' : 'gpt-4o',
          temperature: 0.7,
          maxTokens: 1000,
          streamingEnabled: true,
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
        };
        
        // Create provider instance
        let providerInstance: BaseAIProvider;
        
        switch (provider) {
          case 'openai':
            providerInstance = new OpenAIProvider({
              ...defaultConfig,
              ...modelConfig
            });
            break;
          // Add more providers here
          default:
            providerInstance = new OpenAIProvider({
              ...defaultConfig,
              ...modelConfig
            });
        }
        
        // Check if provider is available
        const isAvailable = await providerInstance.isAvailable();
        
        if (!isAvailable) {
          throw new Error(`AI provider ${provider} is not available`);
        }
        
        setAIProvider(providerInstance);
        setError(null);
      } catch (error) {
        console.error('Failed to initialize AI provider:', error);
        setError(error instanceof Error ? error : new Error('Unknown error initializing AI provider'));
        setAIProvider(null);
      }
    };
    
    initProvider();
  }, [provider, modelConfig]);
  
  /**
   * Generate text response
   */
  const generateText = async (
    prompt: string,
    options?: Partial<GenerationRequest>
  ): Promise<string> => {
    if (!aiProvider) {
      throw new Error('AI provider not initialized');
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Extract context if we have a user ID
      let context = undefined;
      
      if (userId && typeof window !== 'undefined') {
        context = await extractContext(
          userId,
          platform,
          window.location.href,
          document.title
        );
      }
      
      // Generate response
      const response = await aiProvider.generateText({
        prompt,
        context,
        ...options
      });
      
      return response.text;
    } catch (error) {
      console.error('Text generation error:', error);
      setError(error instanceof Error ? error : new Error('Text generation failed'));
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  /**
   * Generate streaming text response
   */
  const generateStreamingText = async (
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: Partial<GenerationRequest>
  ): Promise<void> => {
    if (!aiProvider) {
      throw new Error('AI provider not initialized');
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Extract context if we have a user ID
      let context = undefined;
      
      if (userId && typeof window !== 'undefined') {
        context = await extractContext(
          userId,
          platform,
          window.location.href,
          document.title
        );
      }
      
      // Generate streaming response
      const stream = aiProvider.generateTextStream({
        prompt,
        context,
        ...options
      });
      
      // Process each chunk
      for await (const chunk of stream) {
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Streaming text generation error:', error);
      setError(error instanceof Error ? error : new Error('Streaming text generation failed'));
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Create context value
  const value: AIServiceContextType = {
    generateText,
    generateStreamingText,
    isGenerating,
    error
  };
  
  return (
    <AIServiceContext.Provider value={value}>
      {children}
    </AIServiceContext.Provider>
  );
};

/**
 * Hook to use AI service
 */
export const useAI = () => {
  const context = useContext(AIServiceContext);
  
  if (!context) {
    throw new Error('useAI must be used within an AIServiceProvider');
  }
  
  return context;
};

/**
 * AI Chat Message component
 */
interface AIChatMessageProps {
  message: string;
  isUser?: boolean;
  className?: string;
}

export const AIChatMessage: React.FC<AIChatMessageProps> = ({
  message,
  isUser = false,
  className = ''
}) => {
  return (
    <div className={`ai-chat-message ${isUser ? 'user' : 'assistant'} ${className}`}>
      <div className="ai-chat-message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="ai-chat-message-content">
        {message}
      </div>
    </div>
  );
};

/**
 * AI Chat Input component
 */
interface AIChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const AIChatInput: React.FC<AIChatInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`ai-chat-input ${className}`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="ai-chat-input-field"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="ai-chat-input-button"
      >
        Send
      </button>
    </form>
  );
}; 