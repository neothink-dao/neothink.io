export {};

// Export types
export * from './types';

// Export client
export * from './client';

// Export schema helpers for migrations
export const schema = {
  // Platform bridge tables
  platformPreferences: 'platform_preferences',
  platformNotifications: 'platform_notifications',
  platformState: 'platform_state',
  
  // AI integration tables
  aiConversations: 'ai_conversations',
  aiEmbeddings: 'ai_embeddings',
  aiUsageMetrics: 'ai_usage_metrics',
};

export * from './sharding';
