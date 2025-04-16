import { AIContext } from '../types';
import { createClient } from '@supabase/supabase-js';
import { PlatformSlug } from '@neothink/platform-bridge';

/**
 * Options for context extraction
 */
export interface ContextExtractionOptions {
  includeUserProfile?: boolean;
  includePageContent?: boolean;
  includeSessionData?: boolean;
  maxContentLength?: number;
}

/**
 * Default context extraction options
 */
const DEFAULT_OPTIONS: ContextExtractionOptions = {
  includeUserProfile: true,
  includePageContent: true,
  includeSessionData: true,
  maxContentLength: 1000
};

/**
 * Extract context for AI from current state
 */
export async function extractContext(
  userId: string,
  platform: PlatformSlug,
  pageUrl: string,
  pageTitle: string,
  options: ContextExtractionOptions = DEFAULT_OPTIONS
): Promise<AIContext> {
  const context: AIContext = {
    platform,
    page: {
      url: pageUrl,
      title: pageTitle
    }
  };
  
  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  // Get user information if requested
  if (options.includeUserProfile && userId) {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from(`${platform}_profiles`)
        .select('id, name, role, preferences')
        .eq('id', userId)
        .single();
      
      if (profile) {
        context.user = {
          id: userId,
          name: profile.name,
          role: profile.role,
          preferences: profile.preferences
        };
      } else {
        // Fallback to auth user
        const { data: user } = await supabase.auth.admin.getUserById(userId);
        
        if (user) {
          context.user = {
            id: userId,
            email: user.user?.email
          };
        }
      }
    } catch (error) {
      console.error('Error fetching user data for AI context:', error);
    }
  }
  
  // Get session data if requested
  if (options.includeSessionData && userId) {
    try {
      // Get session data
      const { data: lastSession } = await supabase
        .from('user_sessions')
        .select('id, created_at, interaction_count')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (lastSession) {
        context.session = {
          id: lastSession.id,
          startedAt: lastSession.created_at,
          previousInteractions: lastSession.interaction_count
        };
      }
    } catch (error) {
      console.error('Error fetching session data for AI context:', error);
    }
  }
  
  // Get page content if requested
  if (options.includePageContent) {
    try {
      // Try to extract page context from URL
      // This is a simplified example - in a real app, this would be more complex
      const urlParts = pageUrl.split('/').filter(Boolean);
      const pageType = urlParts[0] || '';
      const pageId = urlParts[1] || '';
      
      if (pageType && pageId) {
        // Different content types based on page type
        let contentTable = '';
        let contentField = '';
        
        switch (pageType) {
          case 'content':
            contentTable = 'content';
            contentField = 'body';
            break;
          case 'profiles':
            contentTable = `${platform}_profiles`;
            contentField = 'bio';
            break;
          case 'courses':
            contentTable = 'courses';
            contentField = 'description';
            break;
          // Add more types as needed
        }
        
        if (contentTable && contentField) {
          const { data: pageData } = await supabase
            .from(contentTable)
            .select(`id, ${contentField}`)
            .eq('id', pageId)
            .single();
          
          const pageDataTyped = pageData as Record<string, any> | null;
          if (pageDataTyped && typeof contentField === 'string' && pageDataTyped[contentField]) {
            const maxLength = options.maxContentLength || DEFAULT_OPTIONS.maxContentLength || 1000;
            const content = pageDataTyped[contentField].substring(0, maxLength);
            
            context.page = {
              ...context.page,
              context: content,
              url: context.page?.url || pageUrl,
              title: context.page?.title || pageTitle
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching page content for AI context:', error);
    }
  }
  
  return context;
} 