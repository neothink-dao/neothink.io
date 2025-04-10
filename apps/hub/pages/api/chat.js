import { createClient } from '@supabase/supabase-js';
import { NeothinkChatbot } from '@neothink/ai';
import { getQuickHelp } from '@/lib/quickHelp';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  runtime: 'edge', // Use edge runtime for faster response
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, type = 'chat', userId } = await req.json();

    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle quick help requests
    if (type === 'quick_help') {
      const quickResponse = await getQuickHelp(message);
      if (quickResponse) {
        return new Response(JSON.stringify({ response: quickResponse }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Get personalized response from NeothinkChatbot
    const chatbot = new NeothinkChatbot();
    const response = await chatbot.getResponse(message, {
      userId,
      context: 'neothink_hub',
    });

    // Store chat history
    await supabase.from('chat_history').insert({
      user_id: userId,
      message,
      response,
      app_name: 'hub',
      created_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 