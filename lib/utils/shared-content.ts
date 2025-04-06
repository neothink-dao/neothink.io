/**
 * Shared Content Synchronization Service
 * 
 * This service provides utilities for managing shared content across
 * all Neothink platforms, allowing content to be published once and
 * distributed to multiple platforms with platform-specific customizations.
 */

import { createClient } from '../supabase/server';

export type ContentType = 'article' | 'video' | 'course' | 'event' | 'resource';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type SharedContent = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: Record<string, any>;
  content_type: ContentType;
  primary_image_url?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  status: ContentStatus;
  published_at?: string;
  metadata: Record<string, any>;
};

export type TenantContent = {
  id: string;
  shared_content_id: string;
  tenant_slug: string;
  is_featured: boolean;
  is_enabled: boolean;
  custom_title?: string;
  custom_summary?: string;
  custom_content?: Record<string, any>;
  custom_primary_image_url?: string;
  display_order?: number;
  category_ids: string[];
  metadata: Record<string, any>;
  tenant_content_id?: string;
};

export type ContentCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tenant_slug: string;
  parent_id?: string;
  display_order?: number;
};

/**
 * Create a new shared content item
 */
export async function createSharedContent({
  title,
  slug,
  summary,
  content,
  contentType,
  primaryImageUrl,
  authorId,
  status = 'draft',
  publishedAt,
  metadata = {}
}: {
  title: string;
  slug: string;
  summary: string;
  content: Record<string, any>;
  contentType: ContentType;
  primaryImageUrl?: string;
  authorId: string;
  status?: ContentStatus;
  publishedAt?: string;
  metadata?: Record<string, any>;
}): Promise<string | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .insert({
        title,
        slug,
        summary,
        content,
        content_type: contentType,
        primary_image_url: primaryImageUrl,
        author_id: authorId,
        status,
        published_at: publishedAt,
        metadata
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating shared content:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating shared content:', error);
    return null;
  }
}

/**
 * Get a shared content item by ID
 */
export async function getSharedContentById(id: string): Promise<SharedContent | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching shared content:', error);
      return null;
    }
    
    return data as SharedContent;
  } catch (error) {
    console.error('Error fetching shared content:', error);
    return null;
  }
}

/**
 * Get a shared content item by slug
 */
export async function getSharedContentBySlug(slug: string): Promise<SharedContent | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error || !data) {
      console.error('Error fetching shared content by slug:', error);
      return null;
    }
    
    return data as SharedContent;
  } catch (error) {
    console.error('Error fetching shared content by slug:', error);
    return null;
  }
}

/**
 * Update a shared content item
 */
export async function updateSharedContent({
  id,
  title,
  slug,
  summary,
  content,
  contentType,
  primaryImageUrl,
  status,
  publishedAt,
  metadata
}: {
  id: string;
  title?: string;
  slug?: string;
  summary?: string;
  content?: Record<string, any>;
  contentType?: ContentType;
  primaryImageUrl?: string;
  status?: ContentStatus;
  publishedAt?: string | null;
  metadata?: Record<string, any>;
}): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.content = content;
    if (contentType !== undefined) updateData.content_type = contentType;
    if (primaryImageUrl !== undefined) updateData.primary_image_url = primaryImageUrl;
    if (status !== undefined) updateData.status = status;
    if (publishedAt !== undefined) updateData.published_at = publishedAt;
    if (metadata !== undefined) updateData.metadata = metadata;
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('shared_content')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating shared content:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating shared content:', error);
    return false;
  }
}

/**
 * Share content with a specific tenant
 */
export async function shareContentWithTenant({
  sharedContentId,
  tenantSlug,
  isFeatured = false,
  isEnabled = true,
  customTitle,
  customSummary,
  customContent,
  customPrimaryImageUrl,
  displayOrder,
  categoryIds = [],
  metadata = {}
}: {
  sharedContentId: string;
  tenantSlug: string;
  isFeatured?: boolean;
  isEnabled?: boolean;
  customTitle?: string;
  customSummary?: string;
  customContent?: Record<string, any>;
  customPrimaryImageUrl?: string;
  displayOrder?: number;
  categoryIds?: string[];
  metadata?: Record<string, any>;
}): Promise<string | null> {
  const supabase = createClient();
  
  try {
    // Check if content is already shared with this tenant
    const { data: existingShare } = await supabase
      .from('tenant_content')
      .select('id')
      .eq('shared_content_id', sharedContentId)
      .eq('tenant_slug', tenantSlug)
      .single();
    
    if (existingShare) {
      // Update existing share
      const { error } = await supabase
        .from('tenant_content')
        .update({
          is_featured: isFeatured,
          is_enabled: isEnabled,
          custom_title: customTitle,
          custom_summary: customSummary,
          custom_content: customContent,
          custom_primary_image_url: customPrimaryImageUrl,
          display_order: displayOrder,
          category_ids: categoryIds,
          metadata
        })
        .eq('id', existingShare.id);
      
      if (error) {
        console.error('Error updating tenant content:', error);
        return null;
      }
      
      return existingShare.id;
    } else {
      // Create new share
      const { data, error } = await supabase
        .from('tenant_content')
        .insert({
          shared_content_id: sharedContentId,
          tenant_slug: tenantSlug,
          is_featured: isFeatured,
          is_enabled: isEnabled,
          custom_title: customTitle,
          custom_summary: customSummary,
          custom_content: customContent,
          custom_primary_image_url: customPrimaryImageUrl,
          display_order: displayOrder,
          category_ids: categoryIds,
          metadata
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error sharing content with tenant:', error);
        return null;
      }
      
      return data?.id || null;
    }
  } catch (error) {
    console.error('Error sharing content with tenant:', error);
    return null;
  }
}

/**
 * Remove shared content from a tenant
 */
export async function removeSharedContentFromTenant(
  sharedContentId: string,
  tenantSlug: string
): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('tenant_content')
      .delete()
      .eq('shared_content_id', sharedContentId)
      .eq('tenant_slug', tenantSlug);
    
    if (error) {
      console.error('Error removing shared content from tenant:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing shared content from tenant:', error);
    return false;
  }
}

/**
 * Get shared content for a tenant
 */
export async function getSharedContentForTenant({
  tenantSlug,
  contentType,
  categoryId,
  limit = 20,
  offset = 0,
  onlyFeatured = false,
  onlyEnabled = true
}: {
  tenantSlug: string;
  contentType?: ContentType;
  categoryId?: string;
  limit?: number;
  offset?: number;
  onlyFeatured?: boolean;
  onlyEnabled?: boolean;
}): Promise<{
  items: Array<SharedContent & Partial<TenantContent>>;
  count: number;
}> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('tenant_content')
      .select(`
        *,
        shared_content:shared_content_id (*)
      `)
      .eq('tenant_slug', tenantSlug)
      .order('display_order', { ascending: true, nullsLast: true })
      .range(offset, offset + limit - 1);
    
    if (onlyEnabled) {
      query = query.eq('is_enabled', true);
    }
    
    if (onlyFeatured) {
      query = query.eq('is_featured', true);
    }
    
    if (categoryId) {
      query = query.contains('category_ids', [categoryId]);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching shared content for tenant:', error);
      return { items: [], count: 0 };
    }
    
    if (!data || data.length === 0) {
      return { items: [], count: 0 };
    }
    
    // Format the response
    const items = data.map(item => {
      const sharedContent = item.shared_content as SharedContent;
      
      if (!sharedContent || (contentType && sharedContent.content_type !== contentType)) {
        return null;
      }
      
      // Customize content for this tenant if needed
      const customizedContent: SharedContent & Partial<TenantContent> = {
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
      
      return customizedContent;
    }).filter(Boolean) as Array<SharedContent & Partial<TenantContent>>;
    
    // Filter by content type if specified
    const filteredItems = contentType
      ? items.filter(item => item.content_type === contentType)
      : items;
    
    return {
      items: filteredItems,
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching shared content for tenant:', error);
    return { items: [], count: 0 };
  }
}

/**
 * Create a content category for a tenant
 */
export async function createContentCategory({
  name,
  slug,
  description,
  tenantSlug,
  parentId,
  displayOrder
}: {
  name: string;
  slug: string;
  description?: string;
  tenantSlug: string;
  parentId?: string;
  displayOrder?: number;
}): Promise<string | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .insert({
        name,
        slug,
        description,
        tenant_slug: tenantSlug,
        parent_id: parentId,
        display_order: displayOrder
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating content category:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating content category:', error);
    return null;
  }
}

/**
 * Get content categories for a tenant
 */
export async function getContentCategoriesForTenant(
  tenantSlug: string
): Promise<ContentCategory[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .select('*')
      .eq('tenant_slug', tenantSlug)
      .order('display_order', { ascending: true, nullsLast: true });
    
    if (error) {
      console.error('Error fetching content categories:', error);
      return [];
    }
    
    return (data || []) as ContentCategory[];
  } catch (error) {
    console.error('Error fetching content categories:', error);
    return [];
  }
}

/**
 * Get content category by ID
 */
export async function getContentCategoryById(
  categoryId: string
): Promise<ContentCategory | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching content category:', error);
      return null;
    }
    
    return data as ContentCategory;
  } catch (error) {
    console.error('Error fetching content category:', error);
    return null;
  }
}

/**
 * Update a content category
 */
export async function updateContentCategory({
  id,
  name,
  slug,
  description,
  parentId,
  displayOrder
}: {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  displayOrder?: number | null;
}): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (parentId !== undefined) updateData.parent_id = parentId;
    if (displayOrder !== undefined) updateData.display_order = displayOrder;
    
    const { error } = await supabase
      .from('content_categories')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating content category:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating content category:', error);
    return false;
  }
}

/**
 * Delete a content category
 */
export async function deleteContentCategory(categoryId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('content_categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) {
      console.error('Error deleting content category:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting content category:', error);
    return false;
  }
} 