import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';
import type { Database } from '@neothink/database-types';

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

export class NeothinkChatbot {
  private supabase;
  private openai;
  private defaultSystemPrompt: string;

  constructor(
    supabaseUrl: string, 
    supabaseKey: string, 
    openaiApiKey: string
  ) {
    // Initialize Supabase client
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
    
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
  async generateResponse(
    messages: ChatMessage[],
    additionalContext: string = '',
    preferences: ChatPreferences = {}
  ): Promise<string> {
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
      const responseMessage = completion.data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
      
      return responseMessage;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  /**
   * Analyze sentiment of a text
   */
  async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
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
      
      const response = completion.data.choices[0]?.text?.trim().toLowerCase() || 'neutral';
      
      // Ensure we only return valid sentiment values
      if (response.includes('positive')) return 'positive';
      if (response.includes('negative')) return 'negative';
      return 'neutral';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral'; // Default to neutral on error
    }
  }

  /**
   * Generate a title for a conversation based on its content
   */
  async generateConversationTitle(messages: ChatMessage[]): Promise<string> {
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
      
      const title = completion.data.choices[0]?.text?.trim() || 'New Conversation';
      return title;
    } catch (error) {
      console.error('Error generating conversation title:', error);
      return 'New Conversation';
    }
  }

  /**
   * Generate suggestions for potential responses or actions
   */
  async generateSuggestions(
    messages: ChatMessage[],
    count: number = 3
  ): Promise<string[]> {
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
      
      const response = completion.data.choices[0]?.text?.trim() || '';
      
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
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return Array(count).fill('');
    }
  }

  /**
   * Moderate content to check for inappropriate material
   */
  async moderateContent(content: string): Promise<boolean> {
    try {
      const response = await this.openai.createModeration({
        input: content,
      });
      
      return response.data.results[0]?.flagged || false;
    } catch (error) {
      console.error('Error in content moderation:', error);
      return false; // Default to allowing content if moderation fails
    }
  }
} 