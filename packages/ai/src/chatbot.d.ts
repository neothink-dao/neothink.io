interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
interface ChatPreferences {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    [key: string]: any;
}
export declare class NeothinkChatbot {
    private supabase;
    private openai;
    private defaultSystemPrompt;
    constructor(supabaseUrl: string, supabaseKey: string, openaiApiKey: string);
    /**
     * Generate a response from the AI given a conversation history
     */
    generateResponse(messages: ChatMessage[], additionalContext?: string, preferences?: ChatPreferences): Promise<string>;
    /**
     * Analyze sentiment of a text
     */
    analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'>;
    /**
     * Generate a title for a conversation based on its content
     */
    generateConversationTitle(messages: ChatMessage[]): Promise<string>;
    /**
     * Generate suggestions for potential responses or actions
     */
    generateSuggestions(messages: ChatMessage[], count?: number): Promise<string[]>;
    /**
     * Moderate content to check for inappropriate material
     */
    moderateContent(content: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=chatbot.d.ts.map