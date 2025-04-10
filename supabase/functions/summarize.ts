import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { Database } from '../types/database'

// Types
interface SummaryRequest {
  appName?: string;
  period?: 'day' | 'week' | 'month';
  startDate?: string;
  endDate?: string;
}

interface FeedbackSummary {
  app_name: string;
  total_count: number;
  sentiment_breakdown: {
    positive: number;
    negative: number;
    neutral: number;
    undefined: number;
  };
  status_breakdown: {
    pending: number;
    processing: number;
    processed: number;
    archived: number;
  };
  recent_samples: {
    positive: Array<{ content: string; created_at: string }>;
    negative: Array<{ content: string; created_at: string }>;
  };
}

interface ChatSummary {
  app_name: string;
  total_messages: number;
  unique_users: number;
  total_conversations: number;
  average_messages_per_conversation: number;
  total_tokens_used: number;
}

interface SummaryResponse {
  start_date: string;
  end_date: string;
  feedback_summaries: FeedbackSummary[];
  chat_summaries: ChatSummary[];
}

serve(async (req) => {
  // CORS headers
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers, status: 405 }
    );
  }

  try {
    // Get request body
    const { appName, period = 'week', startDate, endDate } = await req.json() as SummaryRequest;

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    // Calculate date range for queries
    const now = new Date();
    let start = new Date();
    
    if (startDate) {
      start = new Date(startDate);
    } else {
      switch (period) {
        case 'day':
          start.setDate(now.getDate() - 1);
          break;
        case 'week':
          start.setDate(now.getDate() - 7);
          break;
        case 'month':
          start.setMonth(now.getMonth() - 1);
          break;
      }
    }
    
    const end = endDate ? new Date(endDate) : now;
    const formattedStartDate = start.toISOString();
    const formattedEndDate = end.toISOString();

    // Build feedback query
    let feedbackQuery = supabase
      .from('feedback')
      .select('*')
      .gte('created_at', formattedStartDate)
      .lte('created_at', formattedEndDate);
    
    if (appName) {
      feedbackQuery = feedbackQuery.eq('app_name', appName);
    }
    
    // Get feedback data
    const { data: feedbackData, error: feedbackError } = await feedbackQuery;
    
    if (feedbackError) {
      throw new Error(`Feedback query error: ${feedbackError.message}`);
    }

    // Build chat history query
    let chatQuery = supabase
      .from('chat_history')
      .select('*')
      .gte('created_at', formattedStartDate)
      .lte('created_at', formattedEndDate);
    
    if (appName) {
      chatQuery = chatQuery.eq('app_name', appName);
    }
    
    // Get chat data
    const { data: chatData, error: chatError } = await chatQuery;
    
    if (chatError) {
      throw new Error(`Chat query error: ${chatError.message}`);
    }

    // Group feedback by app
    const feedbackByApp: Record<string, any[]> = {};
    feedbackData.forEach(item => {
      if (!feedbackByApp[item.app_name]) {
        feedbackByApp[item.app_name] = [];
      }
      feedbackByApp[item.app_name].push(item);
    });

    // Group chat by app
    const chatByApp: Record<string, any[]> = {};
    chatData.forEach(item => {
      if (!chatByApp[item.app_name]) {
        chatByApp[item.app_name] = [];
      }
      chatByApp[item.app_name].push(item);
    });

    // Generate feedback summaries
    const feedbackSummaries: FeedbackSummary[] = Object.keys(feedbackByApp).map(app => {
      const appFeedback = feedbackByApp[app];
      
      // Count sentiment types
      const sentimentCounts = {
        positive: 0,
        negative: 0,
        neutral: 0,
        undefined: 0
      };
      
      appFeedback.forEach(item => {
        if (!item.sentiment) {
          sentimentCounts.undefined++;
        } else if (item.sentiment in sentimentCounts) {
          sentimentCounts[item.sentiment as keyof typeof sentimentCounts]++;
        }
      });
      
      // Count status types
      const statusCounts = {
        pending: 0,
        processing: 0,
        processed: 0,
        archived: 0
      };
      
      appFeedback.forEach(item => {
        if (item.status in statusCounts) {
          statusCounts[item.status as keyof typeof statusCounts]++;
        }
      });
      
      // Get sample feedback
      const positiveFeedback = appFeedback
        .filter(item => item.sentiment === 'positive')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map(item => ({ content: item.content, created_at: item.created_at }));
      
      const negativeFeedback = appFeedback
        .filter(item => item.sentiment === 'negative')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map(item => ({ content: item.content, created_at: item.created_at }));
      
      return {
        app_name: app,
        total_count: appFeedback.length,
        sentiment_breakdown: sentimentCounts,
        status_breakdown: statusCounts,
        recent_samples: {
          positive: positiveFeedback,
          negative: negativeFeedback
        }
      };
    });

    // Generate chat summaries
    const chatSummaries: ChatSummary[] = Object.keys(chatByApp).map(app => {
      const appChat = chatByApp[app];
      
      // Calculate unique users
      const uniqueUsers = new Set(appChat.map(item => item.user_id)).size;
      
      // Calculate unique conversations
      const uniqueConversations = new Set(
        appChat
          .filter(item => item.conversation_id)
          .map(item => item.conversation_id)
      ).size;
      
      // Calculate total tokens
      const totalTokens = appChat.reduce((sum, item) => sum + (item.tokens_used || 0), 0);
      
      return {
        app_name: app,
        total_messages: appChat.length,
        unique_users: uniqueUsers,
        total_conversations: uniqueConversations,
        average_messages_per_conversation: uniqueConversations 
          ? parseFloat((appChat.length / uniqueConversations).toFixed(1)) 
          : 0,
        total_tokens_used: totalTokens
      };
    });

    // Create final response
    const summary: SummaryResponse = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      feedback_summaries: feedbackSummaries,
      chat_summaries: chatSummaries
    };

    // Store summary in database for caching
    const summaryId = `${appName || 'all'}-${period}-${new Date().toISOString()}`;
    
    await supabase
      .from('analytics_summaries')
      .upsert({
        id: summaryId,
        platform: appName || 'all',
        summary_type: 'ai_interaction',
        time_period: period,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        metrics: summary,
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify(summary),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error generating summary:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate summary',
        details: error instanceof Error ? error.message : String(error)
      }),
      { headers, status: 500 }
    );
  }
}) 