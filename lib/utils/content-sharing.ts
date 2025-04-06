import { createClient } from '../supabase/server';

/**
 * Content sharing utilities
 * 
 * This module provides functions to manage content that is shared across
 * multiple sites/tenants.
 */

/**
 * Get shared content for a specific tenant
 */
export async function getSharedContentForTenant(
  tenantSlug: string, 
  options?: { 
    limit?: number; 
    offset?: number; 
    categorySlug?: string;
  }
) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_tenant_shared_content', {
    _tenant_slug: tenantSlug,
    _limit: options?.limit || 10,
    _offset: options?.offset || 0,
    _category_slug: options?.categorySlug || null
  });
  
  if (error) {
    console.error('Error fetching shared content:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get a single shared content piece by slug
 */
export async function getSharedContentBySlug(
  tenantSlug: string,
  contentSlug: string
) {
  const supabase = createClient();
  
  // First get the tenant ID
  const { data: tenantData } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single();
  
  if (!tenantData) {
    return null;
  }
  
  // Then get the content
  const { data, error } = await supabase
    .from('shared_content')
    .select(`
      *,
      category:category_id(name, slug),
      tags:content_content_tags(
        tag:tag_id(name, slug)
      ),
      tenant_info:tenant_shared_content!inner(
        is_featured,
        display_order,
        tenant_specific_settings
      )
    `)
    .eq('slug', contentSlug)
    .eq('tenant_shared_content.tenant_id', tenantData.id)
    .eq('is_published', true)
    .single();
  
  if (error || !data) {
    console.error('Error fetching shared content by slug:', error);
    return null;
  }
  
  // Convert tags from array of objects to array of strings
  const tags = data.tags?.map(tagObj => tagObj.tag) || [];
  
  return {
    ...data,
    tags,
    tenant_info: data.tenant_info[0] || null,
  };
}

/**
 * Get content categories available for a tenant
 */
export async function getContentCategoriesForTenant(tenantSlug: string) {
  const supabase = createClient();
  
  // First get the tenant ID
  const { data: tenantData } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single();
  
  if (!tenantData) {
    return [];
  }
  
  // Get all categories that have content assigned to this tenant
  const { data, error } = await supabase
    .from('content_categories')
    .select(`
      *,
      content_count:shared_content!inner(
        count,
        tenant_shared_content!inner(tenant_id)
      )
    `)
    .eq('shared_content.tenant_shared_content.tenant_id', tenantData.id)
    .eq('shared_content.is_published', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching content categories:', error);
    return [];
  }
  
  // Format the response
  return data.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    content_count: parseInt(category.content_count?.[0]?.count || '0', 10)
  }));
}

/**
 * Share content with a tenant
 */
export async function shareContentWithTenant(
  contentId: string,
  tenantId: string,
  options?: {
    isFeatured?: boolean;
    displayOrder?: number;
    tenantSpecificSettings?: any;
  }
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tenant_shared_content')
    .upsert({
      tenant_id: tenantId,
      content_id: contentId,
      is_featured: options?.isFeatured || false,
      display_order: options?.displayOrder || 0,
      tenant_specific_settings: options?.tenantSpecificSettings || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'tenant_id,content_id'
    });
  
  if (error) {
    console.error('Error sharing content with tenant:', error);
    return false;
  }
  
  return true;
}

/**
 * Remove shared content from a tenant
 */
export async function removeSharedContentFromTenant(
  contentId: string,
  tenantId: string
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('tenant_shared_content')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('content_id', contentId);
  
  if (error) {
    console.error('Error removing shared content from tenant:', error);
    return false;
  }
  
  return true;
}

/**
 * Create new shared content
 */
export async function createSharedContent(
  content: {
    title: string;
    slug: string;
    description?: string;
    content: any;
    categoryId?: string;
    isPublished?: boolean;
    tags?: string[];
  }
) {
  const supabase = createClient();
  
  // First create the content
  const { data, error } = await supabase
    .from('shared_content')
    .insert({
      title: content.title,
      slug: content.slug,
      description: content.description,
      content: content.content,
      category_id: content.categoryId,
      is_published: content.isPublished || false,
      author_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error || !data) {
    console.error('Error creating shared content:', error);
    return null;
  }
  
  // If there are tags, process them
  if (content.tags && content.tags.length > 0) {
    for (const tagName of content.tags) {
      // Get or create the tag
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
      
      let tagId: string;
      
      // First check if tag exists
      const { data: existingTag } = await supabase
        .from('content_tags')
        .select('id')
        .eq('slug', tagSlug)
        .single();
      
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Create new tag
        const { data: newTag, error: tagError } = await supabase
          .from('content_tags')
          .insert({
            name: tagName,
            slug: tagSlug
          })
          .select('id')
          .single();
        
        if (tagError || !newTag) {
          console.error('Error creating content tag:', tagError);
          continue;
        }
        
        tagId = newTag.id;
      }
      
      // Connect tag to content
      await supabase
        .from('content_content_tags')
        .insert({
          content_id: data.id,
          tag_id: tagId
        });
    }
  }
  
  return data;
} 