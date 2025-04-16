import { VectorDocument, VectorSearchRequest, VectorSearchResponse } from '../types';
import { PlatformSlug } from '@neothink/platform-bridge';
/**
 * Supabase Vector Store options
 */
export interface SupabaseVectorStoreOptions {
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
export declare class SupabaseVectorStore {
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
//# sourceMappingURL=supabase-vector-store.d.ts.map