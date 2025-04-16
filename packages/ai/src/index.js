var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
import { OpenAIProvider } from './providers/openai-provider';
import { extractContext } from './context/context-extractor';
// Create context
const AIServiceContext = createContext(undefined);
/**
 * AI Service Provider
 */
export const AIServiceProvider = ({ children, userId, platform, provider = 'openai', modelConfig }) => {
    // State
    const [aiProvider, setAIProvider] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    // Initialize provider
    useEffect(() => {
        const initProvider = async () => {
            try {
                // Default config
                const defaultConfig = {
                    provider,
                    modelName: provider === 'openai' ? 'gpt-4o' : 'gpt-4o',
                    temperature: 0.7,
                    maxTokens: 1000,
                    streamingEnabled: true,
                    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
                };
                // Create provider instance
                let providerInstance;
                switch (provider) {
                    case 'openai':
                        providerInstance = new OpenAIProvider(Object.assign(Object.assign({}, defaultConfig), modelConfig));
                        break;
                    // Add more providers here
                    default:
                        providerInstance = new OpenAIProvider(Object.assign(Object.assign({}, defaultConfig), modelConfig));
                }
                // Check if provider is available
                const isAvailable = await providerInstance.isAvailable();
                if (!isAvailable) {
                    throw new Error(`AI provider ${provider} is not available`);
                }
                setAIProvider(providerInstance);
                setError(null);
            }
            catch (error) {
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
    const generateText = async (prompt, options) => {
        if (!aiProvider) {
            throw new Error('AI provider not initialized');
        }
        setIsGenerating(true);
        setError(null);
        try {
            // Extract context if we have a user ID
            let context = undefined;
            if (userId && typeof window !== 'undefined') {
                context = await extractContext(userId, platform, window.location.href, document.title);
            }
            // Generate response
            const response = await aiProvider.generateText(Object.assign({ prompt,
                context }, options));
            return response.text;
        }
        catch (error) {
            console.error('Text generation error:', error);
            setError(error instanceof Error ? error : new Error('Text generation failed'));
            throw error;
        }
        finally {
            setIsGenerating(false);
        }
    };
    /**
     * Generate streaming text response
     */
    const generateStreamingText = async (prompt, onChunk, options) => {
        var _a, e_1, _b, _c;
        if (!aiProvider) {
            throw new Error('AI provider not initialized');
        }
        setIsGenerating(true);
        setError(null);
        try {
            // Extract context if we have a user ID
            let context = undefined;
            if (userId && typeof window !== 'undefined') {
                context = await extractContext(userId, platform, window.location.href, document.title);
            }
            // Generate streaming response
            const stream = aiProvider.generateTextStream(Object.assign({ prompt,
                context }, options));
            try {
                // Process each chunk
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                    _c = stream_1_1.value;
                    _d = false;
                    const chunk = _c;
                    onChunk(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) await _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.error('Streaming text generation error:', error);
            setError(error instanceof Error ? error : new Error('Streaming text generation failed'));
            throw error;
        }
        finally {
            setIsGenerating(false);
        }
    };
    // Create context value
    const value = {
        generateText,
        generateStreamingText,
        isGenerating,
        error
    };
    return (<AIServiceContext.Provider value={value}>
      {children}
    </AIServiceContext.Provider>);
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
export const AIChatMessage = ({ message, isUser = false, className = '' }) => {
    return (<div className={`ai-chat-message ${isUser ? 'user' : 'assistant'} ${className}`}>
      <div className="ai-chat-message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="ai-chat-message-content">
        {message}
      </div>
    </div>);
};
export const AIChatInput = ({ onSend, placeholder = 'Type a message...', disabled = false, className = '' }) => {
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message);
            setMessage('');
        }
    };
    return (<form onSubmit={handleSubmit} className={`ai-chat-input ${className}`}>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={placeholder} disabled={disabled} className="ai-chat-input-field"/>
      <button type="submit" disabled={!message.trim() || disabled} className="ai-chat-input-button">
        Send
      </button>
    </form>);
};
//# sourceMappingURL=index.js.map