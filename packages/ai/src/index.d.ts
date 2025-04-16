export * from './types';
export * from './context/context-extractor';
export * from './providers/base-provider';
export * from './providers/openai-provider';
export * from './utils/id';
export * from './retrieval/supabase-vector-store';
export * from './generation/text-generation';
export * from './supabase-ai';
import React from 'react';
import { PlatformSlug } from '@neothink/platform-bridge';
import { AIProviderType, GenerationRequest, ModelConfig } from './types';
/**
 * AI service context type
 */
interface AIServiceContextType {
    generateText: (prompt: string, options?: Partial<GenerationRequest>) => Promise<string>;
    generateStreamingText: (prompt: string, onChunk: (chunk: string) => void, options?: Partial<GenerationRequest>) => Promise<void>;
    isGenerating: boolean;
    error: Error | null;
}
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
export declare const AIServiceProvider: React.FC<AIServiceProviderProps>;
/**
 * Hook to use AI service
 */
export declare const useAI: () => AIServiceContextType;
/**
 * AI Chat Message component
 */
interface AIChatMessageProps {
    message: string;
    isUser?: boolean;
    className?: string;
}
export declare const AIChatMessage: React.FC<AIChatMessageProps>;
/**
 * AI Chat Input component
 */
interface AIChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}
export declare const AIChatInput: React.FC<AIChatInputProps>;
//# sourceMappingURL=index.d.ts.map