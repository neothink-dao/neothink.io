export declare class SupabaseAI {
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
//# sourceMappingURL=supabase-ai.d.ts.map