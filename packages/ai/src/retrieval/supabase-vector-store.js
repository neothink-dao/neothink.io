import { createClient } from '@supabase/supabase-js';
// Default embedding dimensions for OpenAI embeddings
const DEFAULT_EMBEDDING_DIMENSIONS = 1536;
/**
 * Default options
 */
const DEFAULT_OPTIONS = {
    tableName: 'ai_embeddings',
    embeddings: {
        dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
        similarityThreshold: 0.78,
        similarityFunction: 'cosine_distance'
    }
};
/**
 * Supabase Vector Store for AI embeddings
 */
export class SupabaseVectorStore {
    /**
     * Create a new Supabase Vector Store
     * @param supabaseUrl Supabase URL
     * @param supabaseKey Supabase API key
     * @param options Vector store options
     */
    constructor(supabaseUrl, supabaseKey, options = DEFAULT_OPTIONS) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.options = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), options), { embeddings: Object.assign(Object.assign({}, DEFAULT_OPTIONS.embeddings), options.embeddings) });
    }
    /**
     * Initialize the vector store (create necessary tables/indices)
     */
    async initialize() {
        try {
            // Check if pgvector extension is enabled
            const { data: extensions } = await this.supabase.rpc('get_installed_extensions');
            const hasVectorExtension = extensions.some((ext) => ext.name === 'vector');
            if (!hasVectorExtension) {
                console.error('pgvector extension is not enabled in this database');
                return false;
            }
            // Table should already be created via migrations
            return true;
        }
        catch (error) {
            console.error('Failed to initialize vector store:', error);
            return false;
        }
    }
    /**
     * Store a document with embeddings
     * @param document Vector document to store
     * @returns Success status
     */
    async storeDocument(document) {
        try {
            if (!document.embedding) {
                throw new Error('Document must have an embedding');
            }
            // Format the document for storage
            const { data, error } = await this.supabase
                .from(this.options.tableName)
                .insert({
                id: document.id,
                content: document.content,
                embedding: document.embedding,
                platform: document.metadata.platform || null,
                metadata: document.metadata
            });
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Failed to store document:', error);
            return false;
        }
    }
    /**
     * Store multiple documents with embeddings
     * @param documents Vector documents to store
     * @returns Number of successfully stored documents
     */
    async storeDocuments(documents) {
        try {
            if (!documents.length)
                return 0;
            // Ensure all documents have embeddings
            const validDocuments = documents.filter(doc => Array.isArray(doc.embedding));
            if (validDocuments.length === 0) {
                throw new Error('No valid documents with embeddings provided');
            }
            // Format documents for storage
            const formattedDocuments = validDocuments.map(doc => ({
                id: doc.id,
                content: doc.content,
                embedding: doc.embedding,
                platform: doc.metadata.platform || null,
                metadata: doc.metadata
            }));
            // Store documents in batches to avoid request size limits
            const batchSize = 20;
            let successCount = 0;
            for (let i = 0; i < formattedDocuments.length; i += batchSize) {
                const batch = formattedDocuments.slice(i, i + batchSize);
                const { error } = await this.supabase
                    .from(this.options.tableName)
                    .insert(batch);
                if (!error) {
                    successCount += batch.length;
                }
                else {
                    console.error(`Failed to store batch ${i / batchSize + 1}:`, error);
                }
            }
            return successCount;
        }
        catch (error) {
            console.error('Failed to store documents:', error);
            return 0;
        }
    }
    /**
     * Perform vector similarity search
     * @param request Search request
     * @returns Search response
     */
    async search(request) {
        try {
            if (!request.query) {
                throw new Error('Search query is required');
            }
            // Apply filters
            let query = this.supabase.rpc('match_documents', {
                query_embedding: request.query, // This will be converted to embedding on the server
                match_threshold: request.minScore || this.options.embeddings.similarityThreshold,
                match_count: request.maxResults || 10
            });
            // Platform filter
            if (request.platform) {
                query = query.eq('platform', request.platform);
            }
            // Execute query
            const { data, error } = await query;
            if (error)
                throw error;
            // Format results
            const results = data.map((item) => ({
                document: {
                    id: item.id,
                    content: item.content,
                    metadata: item.metadata
                },
                score: item.similarity
            }));
            return {
                results,
                totalFound: results.length
            };
        }
        catch (error) {
            console.error('Vector search failed:', error);
            return {
                results: [],
                totalFound: 0
            };
        }
    }
    /**
     * Delete a document by ID
     * @param id Document ID
     * @returns Success status
     */
    async deleteDocument(id) {
        try {
            const { error } = await this.supabase
                .from(this.options.tableName)
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Failed to delete document:', error);
            return false;
        }
    }
    /**
     * Delete documents by platform
     * @param platform Platform
     * @returns Number of deleted documents
     */
    async deleteDocumentsByPlatform(platform) {
        try {
            const { data, error } = await this.supabase
                .from(this.options.tableName)
                .delete()
                .eq('platform', platform)
                .select('id');
            if (error)
                throw error;
            return (data === null || data === void 0 ? void 0 : data.length) || 0;
        }
        catch (error) {
            console.error('Failed to delete documents by platform:', error);
            return 0;
        }
    }
    /**
     * Get a document by ID
     * @param id Document ID
     * @returns Document or null if not found
     */
    async getDocument(id) {
        try {
            const { data, error } = await this.supabase
                .from(this.options.tableName)
                .select('id, content, embedding, metadata, platform')
                .eq('id', id)
                .single();
            if (error)
                throw error;
            if (!data)
                return null;
            return {
                id: data.id,
                content: data.content,
                embedding: data.embedding,
                metadata: data.metadata
            };
        }
        catch (error) {
            console.error('Failed to get document:', error);
            return null;
        }
    }
    /**
     * Update document metadata
     * @param id Document ID
     * @param metadata New metadata
     * @returns Success status
     */
    async updateDocumentMetadata(id, metadata) {
        try {
            const { error } = await this.supabase
                .from(this.options.tableName)
                .update({ metadata })
                .eq('id', id);
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Failed to update document metadata:', error);
            return false;
        }
    }
}
//# sourceMappingURL=supabase-vector-store.js.map