-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";  -- For AI embeddings

-- Chat system tables
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster querying
CREATE INDEX chat_messages_conversation_id_idx ON public.chat_messages (conversation_id);
CREATE INDEX chat_messages_user_id_idx ON public.chat_messages (user_id);
CREATE INDEX chat_messages_created_at_idx ON public.chat_messages (created_at DESC);

-- Vector embeddings for AI processing
CREATE TABLE IF NOT EXISTS public.ai_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,  -- Can reference any content type (messages, feedback, etc.)
  content_type TEXT NOT NULL, -- Type of content (e.g., 'chat_message', 'feedback', etc.)
  embedding VECTOR(1536),  -- OpenAI's default embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create an index for vector similarity search
CREATE INDEX ai_embeddings_embedding_idx ON public.ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Notifications system for real-time updates
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for notifications
CREATE INDEX notifications_user_id_idx ON public.notifications (user_id, is_read, created_at DESC);

-- AI suggestion table to store AI-generated recommendations
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  content_id UUID,  -- The ID of the content this suggestion relates to
  content_type TEXT NOT NULL, -- Type of content (e.g., 'feedback', 'chat')
  suggestion_type TEXT NOT NULL, -- Type of suggestion (e.g., 'reply', 'action', 'insight')
  content TEXT NOT NULL,
  confidence FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  is_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for suggestions
CREATE INDEX ai_suggestions_user_id_idx ON public.ai_suggestions (user_id);
CREATE INDEX ai_suggestions_content_idx ON public.ai_suggestions (content_id, content_type);

-- Analytics and metrics table for AI performance tracking
CREATE TABLE IF NOT EXISTS public.ai_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for analytics
CREATE INDEX ai_analytics_event_type_idx ON public.ai_analytics (event_type, app_name);
CREATE INDEX ai_analytics_user_id_idx ON public.ai_analytics (user_id);

-- User preferences for AI features
CREATE TABLE IF NOT EXISTS public.user_ai_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL CHECK (app_name IN ('hub', 'ascenders', 'immortals', 'neothinkers')),
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, app_name)
);

-- Add RLS policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_preferences ENABLE ROW LEVEL SECURITY;

-- RLS for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS for chat messages
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.conversations WHERE id = conversation_id
    )
  );

-- RLS for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS for user AI preferences
CREATE POLICY "Users can view their own AI preferences" ON public.user_ai_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI preferences" ON public.user_ai_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI preferences" ON public.user_ai_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update conversation's updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation timestamp when a new message is added
CREATE TRIGGER update_conversation_timestamp_trigger
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Function to generate AI embeddings
CREATE OR REPLACE FUNCTION generate_embedding(content TEXT)
RETURNS vector
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  embedding vector(1536);
BEGIN
  -- This is a placeholder. In production, this would call an external API or use pg_embedding
  -- The actual implementation would be handled through Edge Functions or server-side code
  RETURN NULL;
END;
$$;

-- Function to search for similar content using vector similarity
CREATE OR REPLACE FUNCTION search_similar_content(
  query_text TEXT,
  content_type TEXT,
  similarity_threshold FLOAT DEFAULT 0.7,
  max_results INT DEFAULT 5
)
RETURNS TABLE (
  content_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query_embedding vector(1536);
BEGIN
  -- In a production environment, this would use the generate_embedding function
  -- or call directly to an embedding service
  
  -- For now, we'll simulate with a placeholder
  -- This would be replaced with actual similarity search
  RETURN QUERY
  SELECT 
    e.content_id,
    0.0::FLOAT as similarity
  FROM 
    public.ai_embeddings e
  WHERE
    e.content_type = search_similar_content.content_type
  LIMIT max_results;
END;
$$;

-- Create real-time notification function
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  conversation public.conversations;
BEGIN
  SELECT * INTO conversation FROM public.conversations WHERE id = NEW.conversation_id;
  
  -- Insert a notification for the user
  IF NEW.role = 'assistant' THEN
    INSERT INTO public.notifications (
      user_id,
      app_name,
      type,
      title,
      message,
      link,
      metadata
    ) VALUES (
      conversation.user_id,
      conversation.app_name,
      'new_message',
      'New Message',
      'You have a new message from the AI assistant',
      '/chat/' || conversation.id,
      jsonb_build_object(
        'conversation_id', conversation.id,
        'message_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new message notifications
CREATE TRIGGER notify_new_message_trigger
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();

-- Create function to track AI usage analytics
CREATE OR REPLACE FUNCTION track_ai_analytics(
  p_event_type TEXT,
  p_app_name TEXT,
  p_metrics JSONB,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  analytics_id UUID;
BEGIN
  INSERT INTO public.ai_analytics (
    event_type,
    app_name,
    user_id,
    metrics,
    metadata
  ) VALUES (
    p_event_type,
    p_app_name,
    auth.uid(),
    p_metrics,
    p_metadata
  )
  RETURNING id INTO analytics_id;
  
  RETURN analytics_id;
END;
$$; 