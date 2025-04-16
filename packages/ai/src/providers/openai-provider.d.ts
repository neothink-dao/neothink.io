import { AIProviderType, ModelCapabilities, GenerationRequest, GenerationResponse, EmbeddingRequest, EmbeddingResponse, ChatHistory, VectorSearchRequest, VectorSearchResponse, ModelConfig } from '../types';
import { BaseAIProvider } from './base-provider';
/**
 * OpenAI provider implementation
 */
export declare class OpenAIProvider extends BaseAIProvider {
    private client;
    private capabilities;
    constructor(config: ModelConfig);
    /**
     * Get provider type
     */
    get providerType(): AIProviderType;
    /**
     * Convert our message format to OpenAI's
     */
    private messagesToOpenAIFormat;
    /**
     * Get model capabilities
     */
    getCapabilities(): Promise<ModelCapabilities>;
    /**
     * Generate text from a prompt
     */
    generateText(request: GenerationRequest): Promise<GenerationResponse>;
    /**
     * Generate text stream from a prompt
     */
    generateTextStream(request: GenerationRequest): AsyncIterable<string>;
    /**
     * Generate text from a chat history
     */
    generateChatResponse(history: ChatHistory, options?: Partial<GenerationRequest>): Promise<GenerationResponse>;
    /**
     * Generate chat response stream
     */
    generateChatStream(history: ChatHistory, options?: Partial<GenerationRequest>): AsyncIterable<string>;
    /**
     * Create embeddings for texts
     */
    createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    /**
     * Search vector database - Not directly supported by OpenAI
     * This would typically be implemented with a vector database like Pinecone or Supabase
     */
    vectorSearch(_request: VectorSearchRequest): Promise<VectorSearchResponse>;
    /**
     * Check if the API is available
     */
    isAvailable(): Promise<boolean>;
}
//# sourceMappingURL=openai-provider.d.ts.map