import { BaseAIProvider } from '../providers/base-provider';
import { OpenAIProvider } from '../providers/openai-provider';
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
export class TextGenerationService {
  private provider: BaseAIProvider;
  
  /**
   * Create a new Text Generation Service
   * @param options Service options
   */
  constructor(options: TextGenerationOptions = {}) {
    // Default to OpenAI if no provider specified
    const providerType = options.provider || 'openai';
    
    switch (providerType) {
      case 'openai':
        this.provider = new OpenAIProvider({
          provider: providerType,
          apiKey: options.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
          modelName: options.modelName || 'gpt-4o',
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000
        });
        break;
      default:
        throw new Error(`Unsupported provider: ${providerType}`);
    }
  }
  
  /**
   * Generate text from a prompt
   * @param prompt Text prompt
   * @param options Generation options
   * @returns Generated text response
   */
  async generateText(
    prompt: string,
    options: Partial<GenerationRequest> = {}
  ): Promise<string> {
    try {
      const response = await this.provider.generateText({
        prompt,
        ...options
      });
      
      return response.text;
    } catch (error) {
      console.error('Text generation error:', error);
      throw error;
    }
  }
  
  /**
   * Generate text from a prompt with streaming
   * @param prompt Text prompt
   * @param onChunk Callback for each chunk of generated text
   * @param options Generation options
   */
  async generateStreamingText(
    prompt: string,
    onChunk: (chunk: string) => void,
    options: Partial<GenerationRequest> = {}
  ): Promise<void> {
    try {
      // Get streaming response
      const stream = this.provider.generateTextStream({
        prompt,
        ...options
      });
      
      // Process each chunk
      for await (const chunk of stream) {
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Streaming text generation error:', error);
      throw error;
    }
  }
  
  /**
   * Generate text from a chat history
   * @param history Chat history
   * @param options Generation options
   * @returns Generated chat response
   */
  async generateChatResponse(
    history: ChatHistory,
    options: Partial<GenerationRequest> = {}
  ): Promise<GenerationResponse> {
    try {
      return await this.provider.generateChatResponse(history, options);
    } catch (error) {
      console.error('Chat generation error:', error);
      throw error;
    }
  }
  
  /**
   * Generate text from a chat history with streaming
   * @param history Chat history
   * @param onChunk Callback for each chunk of generated text
   * @param options Generation options
   */
  async generateChatStream(
    history: ChatHistory,
    onChunk: (chunk: string) => void,
    options: Partial<GenerationRequest> = {}
  ): Promise<void> {
    try {
      // Get streaming response
      const stream = this.provider.generateChatStream(history, options);
      
      // Process each chunk
      for await (const chunk of stream) {
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Streaming chat generation error:', error);
      throw error;
    }
  }
  
  /**
   * Get the provider instance
   * @returns The AI provider
   */
  getProvider(): BaseAIProvider {
    return this.provider;
  }
} 