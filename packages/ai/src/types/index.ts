import { PlatformSlug } from '@neothink/platform-bridge';

/**
 * Available AI provider types
 */
export type AIProviderType = 'openai' | 'azure-openai' | 'anthropic' | 'perplexity' | 'ollama' | 'local';

/**
 * Base model configuration
 */
export interface ModelConfig {
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
export interface ModelCapabilities {
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
export interface AIContext {
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
export interface VectorDocument {
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
export type MessageRole = 'user' | 'assistant' | 'system' | 'function' | 'tool';

/**
 * Base message interface
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

/**
 * Function call in messages
 */
export interface FunctionCall {
  name: string;
  arguments: string;
  output?: string;
}

/**
 * User message
 */
export interface UserMessage extends Message {
  role: 'user';
}

/**
 * Assistant message
 */
export interface AssistantMessage extends Message {
  role: 'assistant';
  functionCall?: FunctionCall;
}

/**
 * System message
 */
export interface SystemMessage extends Message {
  role: 'system';
}

/**
 * Function message
 */
export interface FunctionMessage extends Message {
  role: 'function';
  name: string;
}

/**
 * Tool message
 */
export interface ToolMessage extends Message {
  role: 'tool';
  toolCallId: string;
}

/**
 * Chat history
 */
export type ChatHistory = Message[];

/**
 * AI generation request
 */
export interface GenerationRequest {
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
export interface GenerationResponse {
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
export interface EmbeddingRequest {
  texts: string[];
  modelConfig?: Partial<ModelConfig>;
}

/**
 * Embedding response
 */
export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  tokenUsage?: number;
}

/**
 * Vector search request
 */
export interface VectorSearchRequest {
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
export interface VectorSearchResult {
  document: VectorDocument;
  score: number;
}

/**
 * Vector search response
 */
export interface VectorSearchResponse {
  results: VectorSearchResult[];
  totalFound: number;
}

/**
 * AI provider error
 */
export interface AIProviderError {
  code: string;
  message: string;
  provider: AIProviderType;
  timestamp: string;
  details?: Record<string, unknown>;
}

/**
 * Platform-specific AI configuration
 */
export interface PlatformAIConfig {
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
export interface AIUsageMetrics {
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