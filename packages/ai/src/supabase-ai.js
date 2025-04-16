import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
export class SupabaseAI {
    constructor(supabaseUrl, supabaseKey, openaiApiKey) {
        // Initialize Supabase client
        this.supabase = createClient(supabaseUrl, supabaseKey);
        // Initialize OpenAI
        this.openai = new OpenAI({ apiKey: openaiApiKey });
    }
    /**
     * Generate an embedding for content and store it in the database
     */
    async generateAndStoreEmbedding(content, contentId, contentType, metadata = {}) {
        try {
            // Generate embedding via OpenAI
            const embeddingResponse = await this.openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: content
            });
            const embedding = embeddingResponse.data[0].embedding;
            // Store in Supabase
            const { data, error } = await this.supabase
                .from('ai_embeddings')
                .insert({
                content_id: contentId,
                content_type: contentType,
                embedding,
                metadata
            })
                .select('id')
                .single();
            if (error)
                throw error;
            return data.id;
        }
        catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        }
    }
    /**
     * Search for similar content using vector similarity
     */
    async searchSimilarContent(query, contentType, similarityThreshold = 0.7, maxResults = 5) {
        try {
            // Generate embedding for the query
            const embeddingResponse = await this.openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: query
            });
            const queryEmbedding = embeddingResponse.data[0].embedding;
            // Use RPC to search for similar content
            const { data, error } = await this.supabase.rpc('search_similar_content', {
                query_embedding: queryEmbedding,
                content_type: contentType,
                similarity_threshold: similarityThreshold,
                max_results: maxResults
            });
            if (error)
                throw error;
            // If using our function from the migration, we'll get content_ids
            // We need to fetch the actual content
            if (data && data.length > 0) {
                let contentQuery = null;
                // Query different tables based on content type
                switch (contentType) {
                    case 'chat_message':
                        contentQuery = this.supabase
                            .from('chat_messages')
                            .select('*')
                            .in('id', data.map((item) => item.content_id));
                        break;
                    case 'feedback':
                        contentQuery = this.supabase
                            .from('feedback')
                            .select('*')
                            .in('id', data.map((item) => item.content_id));
                        break;
                    default:
                        throw new Error(`Unknown content type: ${contentType}`);
                }
                const { data: contentData, error: contentError } = await contentQuery;
                if (contentError)
                    throw contentError;
                // Combine similarity scores with content
                return contentData.map((item) => {
                    const matchingScore = data.find((d) => d.content_id === item.id);
                    return Object.assign(Object.assign({}, item), { similarity: matchingScore ? matchingScore.similarity : 0 });
                }).sort((a, b) => b.similarity - a.similarity);
            }
            return [];
        }
        catch (error) {
            console.error('Error searching similar content:', error);
            throw error;
        }
    }
    /**
     * Get AI-generated suggestions for content
     */
    async getSuggestions(contentId, contentType) {
        try {
            const { data, error } = await this.supabase
                .from('ai_suggestions')
                .select('*')
                .eq('content_id', contentId)
                .eq('content_type', contentType)
                .order('confidence', { ascending: false });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Error getting suggestions:', error);
            throw error;
        }
    }
    /**
     * Store an AI-generated suggestion
     */
    async storeSuggestion(userId, appName, contentId, contentType, suggestionType, content, confidence) {
        try {
            const { data, error } = await this.supabase
                .from('ai_suggestions')
                .insert({
                user_id: userId,
                app_name: appName,
                content_id: contentId,
                content_type: contentType,
                suggestion_type: suggestionType,
                content,
                confidence
            })
                .select('id')
                .single();
            if (error)
                throw error;
            return data.id;
        }
        catch (error) {
            console.error('Error storing suggestion:', error);
            throw error;
        }
    }
    /**
     * Mark a suggestion as applied
     */
    async applySuggestion(suggestionId) {
        try {
            const { error } = await this.supabase
                .from('ai_suggestions')
                .update({ is_applied: true })
                .eq('id', suggestionId);
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Error applying suggestion:', error);
            throw error;
        }
    }
    /**
     * Track AI usage analytics
     */
    async trackAnalytics(eventType, appName, metrics, metadata = {}) {
        try {
            const { data, error } = await this.supabase.rpc('track_ai_analytics', {
                p_event_type: eventType,
                p_app_name: appName,
                p_metrics: metrics,
                p_metadata: metadata
            });
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error tracking analytics:', error);
            throw error;
        }
    }
    /**
     * Get or set user AI preferences
     */
    async getUserPreferences(userId, appName) {
        try {
            const { data, error } = await this.supabase
                .from('user_ai_preferences')
                .select('*')
                .eq('user_id', userId)
                .eq('app_name', appName)
                .single();
            if (error && error.code !== 'PGRST116') { // Not found error
                throw error;
            }
            return (data === null || data === void 0 ? void 0 : data.preferences) || {};
        }
        catch (error) {
            console.error('Error getting user preferences:', error);
            throw error;
        }
    }
    async setUserPreferences(userId, appName, preferences) {
        try {
            // Upsert preferences
            const { error } = await this.supabase
                .from('user_ai_preferences')
                .upsert({
                user_id: userId,
                app_name: appName,
                preferences,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,app_name'
            });
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Error setting user preferences:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=supabase-ai.js.map