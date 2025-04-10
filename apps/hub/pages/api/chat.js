import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NeothinkChatbot } from 'packages/ai-integration/src/chatbot';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create authenticated Supabase client
  const supabase = createServerSupabaseClient({ req, res });
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to use the chat feature' });
  }

  try {
    const { message, appName = 'hub', conversationId = null, sessionId = null } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Bad Request', details: 'Message is required' });
    }

    // Generate consistent sessionId for tracking conversation threads if not provided
    const currentSessionId = sessionId || uuidv4();
    const currentConversationId = conversationId || null;

    // Initialize chatbot with environment variables
    const chatbot = new NeothinkChatbot(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role for admin access
      process.env.OPENAI_API_KEY,
    );

    // Get recent chat history with conversation context
    const historyOptions = {
      userId: session.user.id,
      appName: appName,
      limit: 10,
      conversationId: currentConversationId,
    };
    
    const history = await chatbot.getChatHistory(historyOptions);
    const formattedHistory = chatbot.formatChatHistory(history);

    // Process the chat message
    const result = await chatbot.processChat({
      message,
      userId: session.user.id,
      appName: appName,
      sessionId: currentSessionId,
      conversationId: currentConversationId,
      previousMessages: formattedHistory,
    });

    // Return the response with session tracking info
    return res.status(200).json({
      ...result,
      sessionId: currentSessionId,
      conversationId: result.conversationId || currentConversationId,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
} 