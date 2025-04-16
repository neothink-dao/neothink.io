import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';
export class NeothinkChatbot {
    constructor(supabaseUrl, supabaseKey, openaiApiKey) {
        // Initialize Supabase client
        this.supabase = createClient(supabaseUrl, supabaseKey);
        // Initialize OpenAI
        const configuration = new Configuration({
            apiKey: openaiApiKey,
        });
        this.openai = new OpenAIApi(configuration);
        // Default system prompt
        this.defaultSystemPrompt = `You are a helpful AI assistant for the Neothink platform. 
Answer questions accurately, concisely, and helpfully. 
If you don't know something, say so rather than making up information.
Be friendly and conversational, but prioritize accuracy and helpfulness.`;
    }
    /**
     * Generate a response from the AI given a conversation history
     */
    async generateResponse(messages, additionalContext = '', preferences = {}) {
        var _a, _b;
        try {
            // Prepare messages array
            const systemPrompt = preferences.systemPrompt || this.defaultSystemPrompt;
            // Add additional context to system prompt if available
            const enhancedSystemPrompt = additionalContext
                ? `${systemPrompt}\n\nAdditional context that may be helpful:\n${additionalContext}`
                : systemPrompt;
            const formattedMessages = [
                { role: 'system', content: enhancedSystemPrompt },
                ...messages
            ];
            // Get model preferences
            const model = preferences.model || 'gpt-4';
            const temperature = preferences.temperature || 0.7;
            const maxTokens = preferences.maxTokens || 800;
            // Call OpenAI API
            const completion = await this.openai.createChatCompletion({
                model,
                messages: formattedMessages,
                temperature,
                max_tokens: maxTokens,
            });
            // Extract the response
            const responseMessage = ((_b = (_a = completion.data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'I apologize, but I was unable to generate a response.';
            return responseMessage;
        }
        catch (error) {
            console.error('Error generating AI response:', error);
            throw error;
        }
    }
    /**
     * Analyze sentiment of a text
     */
    async analyzeSentiment(text) {
        var _a, _b;
        try {
            const promptText = `Please analyze the sentiment of the following text and respond with only one word: "positive", "negative", or "neutral".
      
Text: "${text}"

Sentiment:`;
            const completion = await this.openai.createCompletion({
                model: 'text-davinci-003',
                prompt: promptText,
                max_tokens: 10,
                temperature: 0.3,
            });
            const response = ((_b = (_a = completion.data.choices[0]) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase()) || 'neutral';
            // Ensure we only return valid sentiment values
            if (response.includes('positive'))
                return 'positive';
            if (response.includes('negative'))
                return 'negative';
            return 'neutral';
        }
        catch (error) {
            console.error('Error analyzing sentiment:', error);
            return 'neutral'; // Default to neutral on error
        }
    }
    /**
     * Generate a title for a conversation based on its content
     */
    async generateConversationTitle(messages) {
        var _a, _b;
        try {
            // Extract user messages to form context
            const userMessages = messages
                .filter(m => m.role === 'user')
                .map(m => m.content)
                .join('\n');
            const promptText = `Based on the following conversation fragments, generate a short, concise title (5 words or less):
      
${userMessages.substring(0, 1000)}

Title:`;
            const completion = await this.openai.createCompletion({
                model: 'text-davinci-003',
                prompt: promptText,
                max_tokens: 30,
                temperature: 0.5,
            });
            const title = ((_b = (_a = completion.data.choices[0]) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.trim()) || 'New Conversation';
            return title;
        }
        catch (error) {
            console.error('Error generating conversation title:', error);
            return 'New Conversation';
        }
    }
    /**
     * Generate suggestions for potential responses or actions
     */
    async generateSuggestions(messages, count = 3) {
        var _a, _b;
        try {
            const promptText = `Based on the following conversation, generate ${count} brief suggestions for how the user might respond or what actions they might take next. Each suggestion should be 1-2 sentences at most.
      
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

Provide exactly ${count} numbered suggestions, one per line:`;
            const completion = await this.openai.createCompletion({
                model: 'text-davinci-003',
                prompt: promptText,
                max_tokens: 200,
                temperature: 0.7,
            });
            const response = ((_b = (_a = completion.data.choices[0]) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.trim()) || '';
            // Split by numbered lines and clean up
            const suggestions = response
                .split(/\d+\./)
                .filter(line => line.trim().length > 0)
                .map(line => line.trim())
                .slice(0, count);
            // If we didn't get enough suggestions, pad with empty ones
            while (suggestions.length < count) {
                suggestions.push('');
            }
            return suggestions;
        }
        catch (error) {
            console.error('Error generating suggestions:', error);
            return Array(count).fill('');
        }
    }
    /**
     * Moderate content to check for inappropriate material
     */
    async moderateContent(content) {
        var _a;
        try {
            const response = await this.openai.createModeration({
                input: content,
            });
            return ((_a = response.data.results[0]) === null || _a === void 0 ? void 0 : _a.flagged) || false;
        }
        catch (error) {
            console.error('Error in content moderation:', error);
            return false; // Default to allowing content if moderation fails
        }
    }
}
//# sourceMappingURL=chatbot.js.map