import { createClient } from '@supabase/supabase-js';
import { Database } from 'database-types';
import OpenAI from 'openai';

type ChatRequest = {
  message: string;
  userId: string;
  appName: 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

type ChatResponse = {
  response: string;
  error?: string;
};

/**
 * Handles chatbot requests across all Neothink platforms
 * 
 * @param supabaseUrl - The Supabase project URL
 * @param supabaseKey - The Supabase service role key (for admin access)
 * @param openaiKey - OpenAI API key
 */
export class NeothinkChatbot {
  private supabase;
  private openai;
  
  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    openaiKey: string
  ) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
    this.openai = new OpenAI({
      apiKey: openaiKey,
    });
  }

  /**
   * Get app-specific system prompt
   */
  private getSystemPrompt(appName: ChatRequest['appName']): string {
    const prompts = {
      hub: "You are an AI assistant for the Neothink Hub platform, focused on holistic growth for Superachievers. Provide insights that integrate knowledge from all Neothink platforms.",
      ascenders: "You are an AI assistant for Ascenders, focused on helping users achieve financial prosperity through Ascension and FLOW methodologies.",
      immortals: "You are an AI assistant for Immortals, focused on longevity and health optimization strategies to extend lifespan and improve quality of life.",
      neothinkers: "You are an AI assistant for Neothinkers, focused on community building and collaborative consciousness expansion."
    };
    
    return prompts[appName];
  }

  /**
   * Process a chat request and store in database
   */
  async processChat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Build conversation history
      const messages = [
        { role: 'system', content: this.getSystemPrompt(request.appName) },
        ...(request.previousMessages || []),
        { role: 'user', content: request.message }
      ] as OpenAI.Chat.ChatCompletionMessageParam[];

      // Get response from OpenAI
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Store in database
      await this.supabase.from('chat_history').insert({
        app_name: request.appName,
        user_id: request.userId,
        message: request.message,
        response
      });

      return { response };
    } catch (error) {
      console.error('Error processing chat:', error);
      return { 
        response: 'I apologize, but I encountered an error processing your request.',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Retrieve chat history for a user
   */
  async getChatHistory(userId: string, appName: ChatRequest['appName'], limit = 50) {
    const { data, error } = await this.supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .eq('app_name', appName)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data;
  }

  /**
   * Format chat history for OpenAI context
   */
  formatChatHistory(history: Database['public']['Tables']['chat_history']['Row'][]) {
    return history.map(entry => [
      { role: 'user' as const, content: entry.message },
      { role: 'assistant' as const, content: entry.response }
    ]).flat().reverse();
  }
} 