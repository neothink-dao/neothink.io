import { 
  AIProviderType, 
  ModelConfig,
  ModelCapabilities,
  GenerationRequest,
  GenerationResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  ChatHistory,
  VectorSearchRequest,
  VectorSearchResponse
} from '../types';

/**
 * Abstract base class for AI providers
 */
export abstract class BaseAIProvider {
  protected config: ModelConfig;
  
  constructor(config: ModelConfig) {
    this.config = {
      ...config,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000,
      topP: config.topP ?? 0.95,
      streamingEnabled: config.streamingEnabled ?? false
    };
  }
  
  /**
   * Get provider type
   */
  abstract get providerType(): AIProviderType;
  
  /**
   * Get model capabilities
   */
  abstract getCapabilities(): Promise<ModelCapabilities>;
  
  /**
   * Generate text from a prompt
   */
  abstract generateText(request: GenerationRequest): Promise<GenerationResponse>;
  
  /**
   * Generate text stream from a prompt
   */
  abstract generateTextStream(request: GenerationRequest): AsyncIterable<string>;
  
  /**
   * Generate text from a chat history
   */
  abstract generateChatResponse(history: ChatHistory, options?: Partial<GenerationRequest>): Promise<GenerationResponse>;
  
  /**
   * Generate chat response stream
   */
  abstract generateChatStream(history: ChatHistory, options?: Partial<GenerationRequest>): AsyncIterable<string>;
  
  /**
   * Create embeddings for texts
   */
  abstract createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse>;
  
  /**
   * Search vector database
   */
  abstract vectorSearch(request: VectorSearchRequest): Promise<VectorSearchResponse>;
  
  /**
   * Check if the API is available
   */
  abstract isAvailable(): Promise<boolean>;
  
  /**
   * Get config with default values
   */
  getConfig(): ModelConfig {
    return this.config;
  }
  
  /**
   * Update config
   */
  updateConfig(newConfig: Partial<ModelConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
  }
} 