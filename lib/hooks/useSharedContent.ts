import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useTenant } from '../context/TenantContext';
import { ContentType, SharedContent, TenantContent, ContentCategory } from '../utils/shared-content';
import { useAnalytics } from './useAnalytics';

type ContentFilter = {
  contentType?: ContentType;
  categoryId?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
};

type ContentReaction = {
  id: string;
  user_id: string;
  shared_content_id: string;
  tenant_slug: string;
  reaction_type: 'like' | 'bookmark' | 'share';
  created_at: string;
};

/**
 * Hook for managing shared content across platforms
 * 
 * This hook provides functions for working with shared content, including
 * fetching, filtering, and tracking user engagement.
 */
export function useSharedContent() {
  const [content, setContent] = useState<Array<SharedContent & Partial<TenantContent>>>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [featuredContent, setFeaturedContent] = useState<Array<SharedContent & Partial<TenantContent>>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [userReactions, setUserReactions] = useState<ContentReaction[]>([]);
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const { currentTenant } = useTenant();
  const { trackContentInteraction } = useAnalytics();
  
  /**
   * Load content categories for the current tenant
   */
  const loadCategories = useCallback(async () => {
    if (!currentTenant?.slug) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('tenant_slug', currentTenant.slug)
        .order('display_order', { ascending: true, nullsLast: true });
      
      if (error) {
        console.error('Error loading content categories:', error);
        return;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading content categories:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentTenant]);
  
  /**
   * Load user's reactions (likes, bookmarks) to content
   */
  const loadUserReactions = useCallback(async () => {
    if (!user || !currentTenant?.slug) return;
    
    try {
      const { data, error } = await supabase
        .from('content_reactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('tenant_slug', currentTenant.slug);
      
      if (error) {
        console.error('Error loading user reactions:', error);
        return;
      }
      
      setUserReactions(data || []);
    } catch (error) {
      console.error('Error loading user reactions:', error);
    }
  }, [supabase, user, currentTenant]);
  
  /**
   * Load featured content for the current tenant
   */
  const loadFeaturedContent = useCallback(async () => {
    if (!currentTenant?.slug) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tenant_content')
        .select(`
          *,
          shared_content:shared_content_id (*)
        `)
        .eq('tenant_slug', currentTenant.slug)
        .eq('is_featured', true)
        .eq('is_enabled', true)
        .order('display_order', { ascending: true, nullsLast: true })
        .limit(5);
      
      if (error) {
        console.error('Error loading featured content:', error);
        return;
      }
      
      if (!data || data.length === 0) {
        setFeaturedContent([]);
        return;
      }
      
      // Format the content items
      const formattedContent = data.map(item => {
        const sharedContent = item.shared_content as SharedContent;
        
        if (!sharedContent || sharedContent.status !== 'published') {
          return null;
        }
        
        // Customize content for this tenant if needed
        return {
          ...sharedContent,
          title: item.custom_title || sharedContent.title,
          summary: item.custom_summary || sharedContent.summary,
          content: item.custom_content || sharedContent.content,
          primary_image_url: item.custom_primary_image_url || sharedContent.primary_image_url,
          is_featured: item.is_featured,
          is_enabled: item.is_enabled,
          display_order: item.display_order,
          category_ids: item.category_ids,
          tenant_content_id: item.id
        };
      }).filter(Boolean) as Array<SharedContent & Partial<TenantContent>>;
      
      setFeaturedContent(formattedContent);
    } catch (error) {
      console.error('Error loading featured content:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentTenant]);
  
  /**
   * Load content with filters
   */
  const loadContent = useCallback(async ({
    contentType,
    categoryId,
    search,
    featured = false,
    limit = 10,
    offset = 0
  }: ContentFilter = {}) => {
    if (!currentTenant?.slug) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('tenant_content')
        .select(`
          *,
          shared_content:shared_content_id (*),
          _count:count() OVER()
        `, { count: 'exact' })
        .eq('tenant_slug', currentTenant.slug)
        .eq('is_enabled', true);
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      if (categoryId) {
        query = query.contains('category_ids', [categoryId]);
      }
      
      // Order by display_order, then by published_at
      query = query
        .order('display_order', { ascending: true, nullsLast: true })
        .order('shared_content(published_at)', { ascending: false });
      
      // Pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error loading content:', error);
        return;
      }
      
      if (!data || data.length === 0) {
        setContent([]);
        setTotalCount(0);
        return;
      }
      
      // Set total count
      setTotalCount(count || 0);
      
      // Format the content items
      const formattedContent = data.map(item => {
        const sharedContent = item.shared_content as SharedContent;
        
        if (!sharedContent || sharedContent.status !== 'published') {
          return null;
        }
        
        // If content type filter is applied, check the type
        if (contentType && sharedContent.content_type !== contentType) {
          return null;
        }
        
        // If search is applied, check the title and summary
        if (search && !`${sharedContent.title} ${sharedContent.summary}`.toLowerCase().includes(search.toLowerCase())) {
          return null;
        }
        
        // Customize content for this tenant if needed
        return {
          ...sharedContent,
          title: item.custom_title || sharedContent.title,
          summary: item.custom_summary || sharedContent.summary,
          content: item.custom_content || sharedContent.content,
          primary_image_url: item.custom_primary_image_url || sharedContent.primary_image_url,
          is_featured: item.is_featured,
          is_enabled: item.is_enabled,
          display_order: item.display_order,
          category_ids: item.category_ids,
          tenant_content_id: item.id
        };
      }).filter(Boolean) as Array<SharedContent & Partial<TenantContent>>;
      
      setContent(formattedContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentTenant]);
  
  /**
   * Get a single content item by ID
   */
  const getContentById = useCallback(async (contentId: string) => {
    if (!currentTenant?.slug) return null;
    
    try {
      // First get the tenant content record
      const { data: tenantContent, error: tenantError } = await supabase
        .from('tenant_content')
        .select('*')
        .eq('shared_content_id', contentId)
        .eq('tenant_slug', currentTenant.slug)
        .eq('is_enabled', true)
        .single();
      
      if (tenantError || !tenantContent) {
        // If not found in tenant_content, check if it exists in shared_content
        const { data: sharedContent, error: sharedError } = await supabase
          .from('shared_content')
          .select('*')
          .eq('id', contentId)
          .single();
        
        if (sharedError || !sharedContent || sharedContent.status !== 'published') {
          return null;
        }
        
        // Content exists but is not linked to this tenant
        return sharedContent as SharedContent;
      }
      
      // Get the shared content
      const { data: sharedContent, error: sharedError } = await supabase
        .from('shared_content')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (sharedError || !sharedContent || sharedContent.status !== 'published') {
        return null;
      }
      
      // Combine shared content with tenant customizations
      const combinedContent: SharedContent & Partial<TenantContent> = {
        ...sharedContent,
        title: tenantContent.custom_title || sharedContent.title,
        summary: tenantContent.custom_summary || sharedContent.summary,
        content: tenantContent.custom_content || sharedContent.content,
        primary_image_url: tenantContent.custom_primary_image_url || sharedContent.primary_image_url,
        is_featured: tenantContent.is_featured,
        is_enabled: tenantContent.is_enabled,
        display_order: tenantContent.display_order,
        category_ids: tenantContent.category_ids,
        tenant_content_id: tenantContent.id
      };
      
      // Record a view
      await recordContentView(contentId);
      
      return combinedContent;
    } catch (error) {
      console.error('Error getting content by ID:', error);
      return null;
    }
  }, [supabase, currentTenant]);
  
  /**
   * Get a single content item by slug
   */
  const getContentBySlug = useCallback(async (slug: string) => {
    if (!currentTenant?.slug) return null;
    
    try {
      // First get the shared content by slug
      const { data: sharedContent, error: sharedError } = await supabase
        .from('shared_content')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (sharedError || !sharedContent) {
        return null;
      }
      
      // Now get the tenant content for this shared content
      const { data: tenantContent, error: tenantError } = await supabase
        .from('tenant_content')
        .select('*')
        .eq('shared_content_id', sharedContent.id)
        .eq('tenant_slug', currentTenant.slug)
        .eq('is_enabled', true)
        .single();
      
      // If there's no tenant content, return the shared content directly
      if (tenantError || !tenantContent) {
        return sharedContent as SharedContent;
      }
      
      // Combine shared content with tenant customizations
      const combinedContent: SharedContent & Partial<TenantContent> = {
        ...sharedContent,
        title: tenantContent.custom_title || sharedContent.title,
        summary: tenantContent.custom_summary || sharedContent.summary,
        content: tenantContent.custom_content || sharedContent.content,
        primary_image_url: tenantContent.custom_primary_image_url || sharedContent.primary_image_url,
        is_featured: tenantContent.is_featured,
        is_enabled: tenantContent.is_enabled,
        display_order: tenantContent.display_order,
        category_ids: tenantContent.category_ids,
        tenant_content_id: tenantContent.id
      };
      
      // Record a view
      await recordContentView(sharedContent.id);
      
      return combinedContent;
    } catch (error) {
      console.error('Error getting content by slug:', error);
      return null;
    }
  }, [supabase, currentTenant]);
  
  /**
   * Record a content view
   */
  const recordContentView = useCallback(async (
    contentId: string,
    source: 'feed' | 'search' | 'recommendation' | 'direct' | 'external' | 'email' | 'other' = 'direct'
  ) => {
    if (!currentTenant?.slug) return false;
    
    try {
      const { error } = await supabase
        .from('content_views')
        .insert({
          shared_content_id: contentId,
          tenant_slug: currentTenant.slug,
          user_id: user?.id,
          view_source: source,
          session_id: generateSessionId(),
          device_info: getDeviceInfo()
        });
      
      if (error) {
        console.error('Error recording content view:', error);
        return false;
      }
      
      // Track the analytics event
      if (trackContentInteraction) {
        trackContentInteraction(contentId, 'content', 'view');
      }
      
      return true;
    } catch (error) {
      console.error('Error recording content view:', error);
      return false;
    }
  }, [supabase, currentTenant, user, trackContentInteraction]);
  
  /**
   * Handle a user reaction to content (like, bookmark, share)
   */
  const handleContentReaction = useCallback(async (
    contentId: string,
    reactionType: 'like' | 'bookmark' | 'share'
  ) => {
    if (!user || !currentTenant?.slug) return false;
    
    try {
      // Check if the user has already reacted
      const existingReaction = userReactions.find(r => 
        r.shared_content_id === contentId &&
        r.reaction_type === reactionType
      );
      
      if (existingReaction) {
        // Remove the reaction (toggle behavior)
        const { error } = await supabase
          .from('content_reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        if (error) {
          console.error('Error removing reaction:', error);
          return false;
        }
        
        // Update local state
        setUserReactions(userReactions.filter(r => r.id !== existingReaction.id));
        return false; // Return false to indicate the reaction was removed
      } else {
        // Add the reaction
        const { data, error } = await supabase
          .from('content_reactions')
          .insert({
            user_id: user.id,
            shared_content_id: contentId,
            tenant_slug: currentTenant.slug,
            reaction_type: reactionType
          })
          .select('*')
          .single();
        
        if (error) {
          console.error('Error adding reaction:', error);
          return false;
        }
        
        // Update local state
        setUserReactions([...userReactions, data]);
        
        // Track the analytics event
        if (trackContentInteraction) {
          trackContentInteraction(contentId, 'content', reactionType as any);
        }
        
        return true; // Return true to indicate the reaction was added
      }
    } catch (error) {
      console.error('Error handling content reaction:', error);
      return false;
    }
  }, [supabase, user, currentTenant, userReactions, trackContentInteraction]);
  
  /**
   * Check if user has reacted to content
   */
  const hasUserReacted = useCallback((
    contentId: string,
    reactionType: 'like' | 'bookmark' | 'share'
  ) => {
    return userReactions.some(r => 
      r.shared_content_id === contentId &&
      r.reaction_type === reactionType
    );
  }, [userReactions]);
  
  /**
   * Get reaction counts for a content item
   */
  const getReactionCounts = useCallback(async (contentId: string) => {
    if (!currentTenant?.slug) return { likes: 0, bookmarks: 0, shares: 0 };
    
    try {
      const { data, error } = await supabase
        .from('content_reactions')
        .select('reaction_type')
        .eq('shared_content_id', contentId)
        .eq('tenant_slug', currentTenant.slug);
      
      if (error) {
        console.error('Error getting reaction counts:', error);
        return { likes: 0, bookmarks: 0, shares: 0 };
      }
      
      const likes = data.filter(r => r.reaction_type === 'like').length;
      const bookmarks = data.filter(r => r.reaction_type === 'bookmark').length;
      const shares = data.filter(r => r.reaction_type === 'share').length;
      
      return { likes, bookmarks, shares };
    } catch (error) {
      console.error('Error getting reaction counts:', error);
      return { likes: 0, bookmarks: 0, shares: 0 };
    }
  }, [supabase, currentTenant]);
  
  /**
   * Update read progress for content
   */
  const updateReadProgress = useCallback(async (
    contentId: string, 
    readPercentage: number,
    durationSeconds: number
  ) => {
    if (!currentTenant?.slug) return false;
    
    try {
      // Update the most recent view for this content
      const { data: views } = await supabase
        .from('content_views')
        .select('id')
        .eq('shared_content_id', contentId)
        .eq('tenant_slug', currentTenant.slug)
        .eq('user_id', user?.id)
        .order('view_date', { ascending: false })
        .limit(1);
      
      if (!views || views.length === 0) {
        return false;
      }
      
      const viewId = views[0].id;
      
      const { error } = await supabase
        .from('content_views')
        .update({
          read_percentage: readPercentage,
          duration_seconds: durationSeconds
        })
        .eq('id', viewId);
      
      if (error) {
        console.error('Error updating read progress:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating read progress:', error);
      return false;
    }
  }, [supabase, currentTenant, user]);
  
  // Load data when tenant changes
  useEffect(() => {
    if (currentTenant?.slug) {
      loadCategories();
      loadFeaturedContent();
      loadContent();
      if (user) {
        loadUserReactions();
      }
    }
  }, [currentTenant, user, loadCategories, loadFeaturedContent, loadContent, loadUserReactions]);
  
  return {
    content,
    featuredContent,
    categories,
    totalCount,
    loading,
    loadContent,
    getContentById,
    getContentBySlug,
    recordContentView,
    handleContentReaction,
    hasUserReacted,
    getReactionCounts,
    updateReadProgress,
    refresh: () => {
      loadContent();
      loadFeaturedContent();
      if (user) {
        loadUserReactions();
      }
    }
  };
}

// Helper functions
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { type: 'server' };
  }
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /(iPad|tablet|Tablet)/i.test(navigator.userAgent);
  
  return {
    type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
} 