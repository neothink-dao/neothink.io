import OpenAI from 'openai';
import { 
  AIProviderType, 
  ModelCapabilities,
  GenerationRequest,
  GenerationResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  ChatHistory,
  Message,
  VectorSearchRequest,
  VectorSearchResponse,
  ModelConfig
} from '../types';
import { BaseAIProvider } from './base-provider';
import { createId } from '../utils/id';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider extends BaseAIProvider {
  private client: OpenAI;
  private capabilities: Record<string, ModelCapabilities> = {};
  
  constructor(config: ModelConfig) {
    super(config);
    
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiUrl
    });
  }
  
  /**
   * Get provider type
   */
  get providerType(): AIProviderType {
    return 'openai';
  }
  
  /**
   * Convert our message format to OpenAI's
   */
  private messagesToOpenAIFormat(messages: ChatHistory): OpenAI.Chat.ChatCompletionMessageParam[] {
    return messages.map(message => {
      const { id, createdAt, ...rest } = message;
      return rest as OpenAI.Chat.ChatCompletionMessageParam;
    });
  }
  
  /**
   * Get model capabilities
   */
  async getCapabilities(): Promise<ModelCapabilities> {
    const modelName = this.config.modelName;
    
    // Return cached capabilities if available
    if (this.capabilities[modelName]) {
      return this.capabilities[modelName];
    }
    
    // Define capabilities based on model
    const capabilities: ModelCapabilities = {
      embeddings: modelName.includes('text-embedding'),
      chat: modelName.includes('gpt'),
      visionAnalysis: modelName.includes('vision') || modelName.includes('gpt-4'),
      speechToText: modelName.includes('whisper'),
      textToSpeech: false,
      functionCalling: modelName.includes('gpt-3.5-turbo') || modelName.includes('gpt-4'),
      contextWindow: 
        modelName.includes('gpt-4-turbo') || modelName.includes('gpt-4-1106') ? 128000 :
        modelName.includes('gpt-4') ? 8192 :
        modelName.includes('gpt-3.5-turbo') ? 16385 : 4096
    };
    
    // Cache capabilities
    this.capabilities[modelName] = capabilities;
    
    return capabilities;
  }
  
  /**
   * Generate text from a prompt
   */
  async generateText(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      // Create a system message for context if provided
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      
      if (request.context) {
        let systemPrompt = 'You are a helpful assistant.';
        
        if (request.context.user) {
          systemPrompt += ` You are assisting a user named ${request.context.user.name || 'User'}.`;
        }
        
        if (request.context.platform) {
          systemPrompt += ` The user is on the ${request.context.platform} platform.`;
        }
        
        if (request.context.page) {
          systemPrompt += ` The user is viewing: ${request.context.page.title}.`;
          
          if (request.context.page.context) {
            systemPrompt += ` Context: ${request.context.page.context}`;
          }
        }
        
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      
      // Add the user's prompt
      messages.push({
        role: 'user',
        content: request.prompt
      });
      
      // Apply custom config if provided
      const config = {
        ...this.config,
        ...request.modelConfig
      };
      
      // Call the API
      const response = await this.client.chat.completions.create({
        model: config.modelName,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: false
      });
      
      // Format the response
      return {
        id: response.id,
        text: response.choices[0]?.message.content || '',
        model: response.model,
        provider: this.providerType,
        tokenUsage: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      throw error;
    }
  }
  
  /**
   * Generate text stream from a prompt
   */
  async *generateTextStream(request: GenerationRequest): AsyncIterable<string> {
    try {
      // Create a system message for context if provided
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      
      if (request.context) {
        let systemPrompt = 'You are a helpful assistant.';
        
        if (request.context.user) {
          systemPrompt += ` You are assisting a user named ${request.context.user.name || 'User'}.`;
        }
        
        if (request.context.platform) {
          systemPrompt += ` The user is on the ${request.context.platform} platform.`;
        }
        
        if (request.context.page) {
          systemPrompt += ` The user is viewing: ${request.context.page.title}.`;
          
          if (request.context.page.context) {
            systemPrompt += ` Context: ${request.context.page.context}`;
          }
        }
        
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      
      // Add the user's prompt
      messages.push({
        role: 'user',
        content: request.prompt
      });
      
      // Apply custom config if provided
      const config = {
        ...this.config,
        ...request.modelConfig
      };
      
      // Call the API with streaming
      const stream = await this.client.chat.completions.create({
        model: config.modelName,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: true
      });
      
      // Yield each chunk
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI stream generation error:', error);
      throw error;
    }
  }
  
  /**
   * Generate text from a chat history
   */
  async generateChatResponse(history: ChatHistory, options?: Partial<GenerationRequest>): Promise<GenerationResponse> {
    try {
      // Convert messages to OpenAI format
      const messages = this.messagesToOpenAIFormat(history);
      
      // Apply custom config if provided
      const config = {
        ...this.config,
        ...options?.modelConfig
      };
      
      // Call the API
      const response = await this.client.chat.completions.create({
        model: config.modelName,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: false
      });
      
      // Format the response
      return {
        id: response.id,
        text: response.choices[0]?.message.content || '',
        model: response.model,
        provider: this.providerType,
        tokenUsage: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI chat generation error:', error);
      throw error;
    }
  }
  
  /**
   * Generate chat response stream
   */
  async *generateChatStream(history: ChatHistory, options?: Partial<GenerationRequest>): AsyncIterable<string> {
    try {
      // Convert messages to OpenAI format
      const messages = this.messagesToOpenAIFormat(history);
      
      // Apply custom config if provided
      const config = {
        ...this.config,
        ...options?.modelConfig
      };
      
      // Call the API with streaming
      const stream = await this.client.chat.completions.create({
        model: config.modelName,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: true
      });
      
      // Yield each chunk
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI chat stream generation error:', error);
      throw error;
    }
  }
  
  /**
   * Create embeddings for texts
   */
  async createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    try {
      // Default to embedding model if current model doesn't support embeddings
      const modelName = 
        this.config.modelName.includes('embedding') ? 
        this.config.modelName : 
        'text-embedding-3-small';
      
      // Create embeddings
      const response = await this.client.embeddings.create({
        model: modelName,
        input: request.texts,
        encoding_format: 'float'
      });
      
      // Format response
      return {
        embeddings: response.data.map(item => item.embedding),
        model: response.model,
        tokenUsage: response.usage.total_tokens
      };
    } catch (error) {
      console.error('OpenAI embedding error:', error);
      throw error;
    }
  }
  
  /**
   * Search vector database - Not directly supported by OpenAI
   * This would typically be implemented with a vector database like Pinecone or Supabase
   */
  async vectorSearch(_request: VectorSearchRequest): Promise<VectorSearchResponse> {
    throw new Error('Vector search not directly supported by OpenAI provider. Use a vector database integration.');
  }
  
  /**
   * Check if the API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Simple model list request to check API availability
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI API not available:', error);
      return false;
    }
  }
} 