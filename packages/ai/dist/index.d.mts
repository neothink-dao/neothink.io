import { PlatformSlug } from '@neothink/platform-bridge';
import React from 'react';

/**
 * Available AI provider types
 */
type AIProviderType = 'openai' | 'azure-openai' | 'anthropic' | 'perplexity' | 'ollama' | 'local';
/**
 * Base model configuration
 */
interface ModelConfig {
    provider: AIProviderType;
    modelName: string;
    apiKey?: string;
    apiUrl?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    streamingEnabled?: boolean;
}
/**
 * Model capabilities
 */
interface ModelCapabilities {
    embeddings: boolean;
    chat: boolean;
    visionAnalysis: boolean;
    speechToText: boolean;
    textToSpeech: boolean;
    functionCalling: boolean;
    contextWindow: number;
}
/**
 * Contextual information for AI
 */
interface AIContext {
    user?: {
        id: string;
        name?: string;
        email?: string;
        role?: string;
        preferences?: Record<string, unknown>;
    };
    platform?: PlatformSlug;
    session?: {
        id: string;
        startedAt: string;
        previousInteractions?: number;
    };
    page?: {
        url: string;
        title: string;
        context?: string;
    };
}
/**
 * Vector store document type
 */
interface VectorDocument {
    id: string;
    content: string;
    metadata: {
        source: string;
        author?: string;
        createdAt: string;
        updatedAt?: string;
        platform?: PlatformSlug;
        category?: string;
        tags?: string[];
        [key: string]: unknown;
    };
    embedding?: number[];
}
/**
 * Chat message types
 */
type MessageRole = 'user' | 'assistant' | 'system' | 'function' | 'tool';
/**
 * Base message interface
 */
interface Message {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: string;
}
/**
 * Function call in messages
 */
interface FunctionCall {
    name: string;
    arguments: string;
    output?: string;
}
/**
 * User message
 */
interface UserMessage extends Message {
    role: 'user';
}
/**
 * Assistant message
 */
interface AssistantMessage extends Message {
    role: 'assistant';
    functionCall?: FunctionCall;
}
/**
 * System message
 */
interface SystemMessage extends Message {
    role: 'system';
}
/**
 * Function message
 */
interface FunctionMessage extends Message {
    role: 'function';
    name: string;
}
/**
 * Tool message
 */
interface ToolMessage extends Message {
    role: 'tool';
    toolCallId: string;
}
/**
 * Chat history
 */
type ChatHistory = Message[];
/**
 * AI generation request
 */
interface GenerationRequest {
    prompt: string;
    context?: AIContext;
    modelConfig?: Partial<ModelConfig>;
    retrievalEnabled?: boolean;
    retrievalOptions?: {
        maxDocuments?: number;
        minRelevanceScore?: number;
        includeSources?: boolean;
    };
}
/**
 * AI generation response
 */
interface GenerationResponse {
    id: string;
    text: string;
    model: string;
    provider: AIProviderType;
    tokenUsage?: {
        prompt: number;
        completion: number;
        total: number;
    };
    sources?: VectorDocument[];
    createdAt: string;
}
/**
 * Embedding request
 */
interface EmbeddingRequest {
    texts: string[];
    modelConfig?: Partial<ModelConfig>;
}
/**
 * Embedding response
 */
interface EmbeddingResponse {
    embeddings: number[][];
    model: string;
    tokenUsage?: number;
}
/**
 * Vector search request
 */
interface VectorSearchRequest {
    query: string;
    collection?: string;
    platform?: PlatformSlug;
    filters?: Record<string, unknown>;
    maxResults?: number;
    minScore?: number;
}
/**
 * Vector search result
 */
interface VectorSearchResult {
    document: VectorDocument;
    score: number;
}
/**
 * Vector search response
 */
interface VectorSearchResponse {
    results: VectorSearchResult[];
    totalFound: number;
}
/**
 * AI provider error
 */
interface AIProviderError {
    code: string;
    message: string;
    provider: AIProviderType;
    timestamp: string;
    details?: Record<string, unknown>;
}
/**
 * Platform-specific AI configuration
 */
interface PlatformAIConfig {
    defaultProvider: AIProviderType;
    defaultModels: {
        chat: string;
        embedding: string;
        vision?: string;
    };
    enabledFeatures: {
        contextualAssistance: boolean;
        smartRecommendations: boolean;
        contentSummarization: boolean;
        searchEnhancement: boolean;
        personalizedUI: boolean;
    };
}
/**
 * AI usage metrics
 */
interface AIUsageMetrics {
    userId: string;
    platformSlug: PlatformSlug;
    requestCount: number;
    tokenUsage: {
        prompt: number;
        completion: number;
        total: number;
    };
    cost: number;
    lastUsedAt: string;
}

/**
 * Options for context extraction
 */
interface ContextExtractionOptions {
    includeUserProfile?: boolean;
    includePageContent?: boolean;
    includeSessionData?: boolean;
    maxContentLength?: number;
}
/**
 * Extract context for AI from current state
 */
declare function extractContext(userId: string, platform: PlatformSlug, pageUrl: string, pageTitle: string, options?: ContextExtractionOptions): Promise<AIContext>;

/**
 * Abstract base class for AI providers
 */
declare abstract class BaseAIProvider {
    protected config: ModelConfig;
    constructor(config: ModelConfig);
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
    getConfig(): ModelConfig;
    /**
     * Update config
     */
    updateConfig(newConfig: Partial<ModelConfig>): void;
}

/**
 * OpenAI provider implementation
 */
declare class OpenAIProvider extends BaseAIProvider {
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

/**
 * Generate a unique ID
 * @returns A unique ID string
 */
declare function createId(): string;

/**
 * Supabase Vector Store options
 */
interface SupabaseVectorStoreOptions {
    tableName?: string;
    embeddings?: {
        dimensions?: number;
        similarityThreshold?: number;
        similarityFunction?: 'cosine_distance' | 'inner_product' | 'l2_distance';
    };
}
/**
 * Supabase Vector Store for AI embeddings
 */
declare class SupabaseVectorStore {
    private supabase;
    private options;
    /**
     * Create a new Supabase Vector Store
     * @param supabaseUrl Supabase URL
     * @param supabaseKey Supabase API key
     * @param options Vector store options
     */
    constructor(supabaseUrl: string, supabaseKey: string, options?: SupabaseVectorStoreOptions);
    /**
     * Initialize the vector store (create necessary tables/indices)
     */
    initialize(): Promise<boolean>;
    /**
     * Store a document with embeddings
     * @param document Vector document to store
     * @returns Success status
     */
    storeDocument(document: VectorDocument): Promise<boolean>;
    /**
     * Store multiple documents with embeddings
     * @param documents Vector documents to store
     * @returns Number of successfully stored documents
     */
    storeDocuments(documents: VectorDocument[]): Promise<number>;
    /**
     * Perform vector similarity search
     * @param request Search request
     * @returns Search response
     */
    search(request: VectorSearchRequest): Promise<VectorSearchResponse>;
    /**
     * Delete a document by ID
     * @param id Document ID
     * @returns Success status
     */
    deleteDocument(id: string): Promise<boolean>;
    /**
     * Delete documents by platform
     * @param platform Platform
     * @returns Number of deleted documents
     */
    deleteDocumentsByPlatform(platform: PlatformSlug): Promise<number>;
    /**
     * Get a document by ID
     * @param id Document ID
     * @returns Document or null if not found
     */
    getDocument(id: string): Promise<VectorDocument | null>;
    /**
     * Update document metadata
     * @param id Document ID
     * @param metadata New metadata
     * @returns Success status
     */
    updateDocumentMetadata(id: string, metadata: Record<string, unknown>): Promise<boolean>;
}

/**
 * Text Generation Service options
 */
interface TextGenerationOptions {
    provider?: AIProviderType;
    apiKey?: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
}
/**
 * Text Generation Service
 */
declare class TextGenerationService {
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

declare class SupabaseAI {
    private supabase;
    private openai;
    constructor(supabaseUrl: string, supabaseKey: string, openaiApiKey: string);
    /**
     * Generate an embedding for content and store it in the database
     */
    generateAndStoreEmbedding(content: string, contentId: string, contentType: string, metadata?: any): Promise<string>;
    /**
     * Search for similar content using vector similarity
     */
    searchSimilarContent(query: string, contentType: string, similarityThreshold?: number, maxResults?: number): Promise<any[]>;
    /**
     * Get AI-generated suggestions for content
     */
    getSuggestions(contentId: string, contentType: string): Promise<any[]>;
    /**
     * Store an AI-generated suggestion
     */
    storeSuggestion(userId: string | null, appName: string, contentId: string | null, contentType: string, suggestionType: string, content: string, confidence: number): Promise<string>;
    /**
     * Mark a suggestion as applied
     */
    applySuggestion(suggestionId: string): Promise<void>;
    /**
     * Track AI usage analytics
     */
    trackAnalytics(eventType: string, appName: string, metrics: any, metadata?: any): Promise<string>;
    /**
     * Get or set user AI preferences
     */
    getUserPreferences(userId: string, appName: string): Promise<any>;
    setUserPreferences(userId: string, appName: string, preferences: any): Promise<void>;
}

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
declare const AIServiceProvider: React.FC<AIServiceProviderProps>;
/**
 * Hook to use AI service
 */
declare const useAI: () => AIServiceContextType;
/**
 * AI Chat Message component
 */
interface AIChatMessageProps {
    message: string;
    isUser?: boolean;
    className?: string;
}
declare const AIChatMessage: React.FC<AIChatMessageProps>;
/**
 * AI Chat Input component
 */
interface AIChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}
declare const AIChatInput: React.FC<AIChatInputProps>;

export { AIChatInput, AIChatMessage, type AIContext, type AIProviderError, type AIProviderType, AIServiceProvider, type AIUsageMetrics, type AssistantMessage, BaseAIProvider, type ChatHistory, type ContextExtractionOptions, type EmbeddingRequest, type EmbeddingResponse, type FunctionCall, type FunctionMessage, type GenerationRequest, type GenerationResponse, type Message, type MessageRole, type ModelCapabilities, type ModelConfig, OpenAIProvider, type PlatformAIConfig, SupabaseAI, SupabaseVectorStore, type SupabaseVectorStoreOptions, type SystemMessage, type TextGenerationOptions, TextGenerationService, type ToolMessage, type UserMessage, type VectorDocument, type VectorSearchRequest, type VectorSearchResponse, type VectorSearchResult, createId, extractContext, useAI };
