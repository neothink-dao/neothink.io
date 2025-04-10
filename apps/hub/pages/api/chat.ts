import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NeothinkChatbot } from 'ai-integration/src/chatbot';
import { Database } from 'database-types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create authenticated Supabase client
  const supabase = createServerSupabaseClient<Database>({ req, res });
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { message, appName = 'hub' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize chatbot
    const chatbot = new NeothinkChatbot(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin access
      process.env.OPENAI_API_KEY!,
    );

    // Get recent chat history
    const history = await chatbot.getChatHistory(session.user.id, appName as any);
    const formattedHistory = chatbot.formatChatHistory(history.slice(0, 10));

    // Process the chat message
    const result = await chatbot.processChat({
      message,
      userId: session.user.id,
      appName: appName as any,
      previousMessages: formattedHistory,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 