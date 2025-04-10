import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NeothinkChatbot } from '@neothink/ai-integration';
import { Database } from '@neothink/database-types';
import { z } from 'zod';
import { startNewConversation, sendMessage } from '@neothink/hub/lib/supabase/chat-subscription';
import { SupabaseAI } from '@neothink/ai-integration/src/supabase-ai';

// Validate request body schema
const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  appName: z.enum(['hub', 'ascenders', 'immortals', 'neothinkers']).default('hub'),
  conversationId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'Only POST requests are allowed'
    });
  }

  try {
    // Create authenticated Supabase client
    const supabase = createServerSupabaseClient<Database>({ req, res });
    
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        details: 'Please log in to use the chat feature' 
      });
    }

    // Validate request body
    const validationResult = chatRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Bad Request',
        details: validationResult.error.issues.map(issue => issue.message)
      });
    }

    const { message, appName, conversationId, metadata = {} } = validationResult.data;
    const userId = session.user.id;

    // Initialize AI utility for embeddings and enhanced features
    const ai = new SupabaseAI(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      process.env.OPENAI_API_KEY!
    );

    // Track this chat request in analytics
    await ai.trackAnalytics(
      'chat_request',
      appName,
      {
        message_length: message.length,
        has_conversation: !!conversationId
      },
      {
        user_agent: req.headers['user-agent']
      }
    );

    // Get or create conversation
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      // Create a new conversation
      const conversation = await startNewConversation(
        supabase,
        userId,
        appName,
        message
      );
      activeConversationId = conversation.id;
    } else {
      // If conversation exists, add the user message
      await sendMessage(
        supabase,
        activeConversationId,
        userId,
        message,
        'user',
        metadata
      );
    }

    // Initialize chatbot
    const chatbot = new NeothinkChatbot(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      process.env.OPENAI_API_KEY!
    );

    // Process the message with enhanced context gathering
    const recentMessages = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', activeConversationId)
      .order('created_at', { ascending: true })
      .limit(10);
      
    if (recentMessages.error) throw recentMessages.error;

    // Format messages for the AI model
    const formattedMessages = recentMessages.data.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get user AI preferences
    const preferences = await ai.getUserPreferences(userId, appName);

    // Look for similar conversations to provide more context
    let similarMessageResults: any[] = [];
    try {
      similarMessageResults = await ai.searchSimilarContent(
        message, 
        'chat_message',
        0.7,
        3
      );
    } catch (error) {
      console.warn('Vector search failed, continuing without similar messages:', error);
    }

    // Add similar messages as context if available
    let context = '';
    if (similarMessageResults.length > 0) {
      context = 'Previous relevant conversations:\n' + 
        similarMessageResults
          .map(msg => `Q: ${msg.content}\nA: ${msg.response || '[No response recorded]'}`)
          .join('\n\n');
    }

    // Generate AI response
    const aiResponse = await chatbot.generateResponse(
      formattedMessages,
      context,
      preferences
    );

    // Store the assistant's response
    const assistantMessage = await sendMessage(
      supabase,
      activeConversationId,
      userId,
      aiResponse,
      'assistant',
      { model: 'gpt-4', generated_at: new Date().toISOString() }
    );

    // Generate embeddings for the conversation asynchronously (don't await)
    ai.generateAndStoreEmbedding(
      message,
      assistantMessage.id,
      'chat_message',
      {
        conversation_id: activeConversationId,
        app_name: appName
      }
    ).catch(err => {
      console.error('Failed to generate embeddings:', err);
    });

    // Return the response
    return res.status(200).json({
      conversationId: activeConversationId,
      response: aiResponse,
      messageId: assistantMessage.id
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific error types
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.issues.map(issue => issue.message)
      });
    }

    // Handle rate limiting
    if (error instanceof Error && error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Too Many Requests',
        details: 'Please wait a moment before sending more messages'
      });
    }

    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred',
      requestId: req.headers['x-request-id'] || undefined
    });
  }
} 