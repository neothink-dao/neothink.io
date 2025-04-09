import { createClient } from './supabase';

export interface Topic {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  category: string;
  tags: string[];
  status: string;
  tenant_slug: string;
  route: string;
}

export interface Message {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches forum topics for a specific platform and route
 */
export async function getForumTopics(platform: string, route: string): Promise<Topic[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('discussion_topics')
    .select('*')
    .eq('tenant_slug', platform)
    .eq('route', route)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching forum topics:', error);
    throw error;
  }
  
  return data as Topic[];
}

/**
 * Posts a message to a forum topic
 */
export async function postMessage(
  userId: string,
  topicId: string,
  content: string
): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('discussion_messages')
    .insert({
      topic_id: topicId,
      user_id: userId,
      content
    });
  
  if (error) {
    console.error('Error posting message:', error);
    throw error;
  }
  
  // Award points for posting a message
  try {
    await supabase.from('user_points').insert({
      user_id: userId,
      points: 5,
      action: 'post_message'
    });
  } catch (e) {
    // Don't block the message if points can't be awarded
    console.warn('Failed to award points for message:', e);
  }
}

/**
 * Creates a new forum topic
 */
export async function createTopic(
  userId: string,
  platform: string,
  route: string,
  title: string,
  description: string,
  category: string,
  tags: string[] = []
): Promise<Topic> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('discussion_topics')
    .insert({
      title,
      description,
      created_by: userId,
      category,
      tags,
      status: 'active',
      tenant_slug: platform,
      route
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
  
  // Award points for creating a topic
  try {
    await supabase.from('user_points').insert({
      user_id: userId,
      points: 20,
      action: 'create_topic'
    });
  } catch (e) {
    // Don't block the topic creation if points can't be awarded
    console.warn('Failed to award points for topic creation:', e);
  }
  
  return data as Topic;
}

/**
 * Gets messages for a specific topic
 */
export async function getTopicMessages(topicId: string): Promise<Message[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('discussion_messages')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching topic messages:', error);
    throw error;
  }
  
  return data as Message[];
} 