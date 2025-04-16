import { BaseAIProvider } from '../providers/base-provider';
import { AIProviderType, ChatHistory, GenerationRequest, GenerationResponse } from '../types';
/**
 * Text Generation Service options
 */
export interface TextGenerationOptions {
    provider?: AIProviderType;
    apiKey?: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
}
/**
 * Text Generation Service
 */
export declare class TextGenerationService {
    private provider;
    /**
     * Create a new Text Generation Service
     * @param options Service options
     */
    constructor(options?: TextGenerationOptions);
    /**
     * Generate text from a prompt
     * @param prompt Text prompt
     * @param options Generation options
     * @returns Generated text response
     */
    generateText(prompt: string, options?: Partial<GenerationRequest>): Promise<string>;
    /**
     * Generate text from a prompt with streaming
     * @param prompt Text prompt
     * @param onChunk Callback for each chunk of generated text
     * @param options Generation options
     */
    generateStreamingText(prompt: string, onChunk: (chunk: string) => void, options?: Partial<GenerationRequest>): Promise<void>;
    /**
     * Generate text from a chat history
     * @param history Chat history
     * @param options Generation options
     * @returns Generated chat response
     */
    generateChatResponse(history: ChatHistory, options?: Partial<GenerationRequest>): Promise<GenerationResponse>;
    /**
     * Generate text from a chat history with streaming
     * @param history Chat history
     * @param onChunk Callback for each chunk of generated text
     * @param options Generation options
     */
    generateChatStream(history: ChatHistory, onChunk: (chunk: string) => void, options?: Partial<GenerationRequest>): Promise<void>;
    /**
     * Get the provider instance
     * @returns The AI provider
     */
    getProvider(): BaseAIProvider;
}
//# sourceMappingURL=text-generation.d.ts.map