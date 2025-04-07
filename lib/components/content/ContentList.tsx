import { useState, useEffect } from 'react';
import { createClientComponent, PlatformSlug } from '../../supabase/auth-client';
import ContentCard from './ContentCard';
import LoadingSpinner from '../LoadingSpinner';

interface ContentListProps {
  platformSlug: PlatformSlug;
  contentType?: string;
  limit?: number;
  className?: string;
  featured?: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  primary_image_url: string;
  published_at: string;
  content_type: string;
  author_id: string;
  author: {
    full_name: string;
  };
}

export default function ContentList({
  platformSlug,
  contentType,
  limit = 6,
  className = '',
  featured = false
}: ContentListProps) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const supabase = createClientComponent(platformSlug);
        
        let query = supabase
          .from('shared_content')
          .select(`
            id,
            title,
            summary,
            slug,
            primary_image_url,
            published_at,
            content_type,
            author_id,
            author:profiles(full_name)
          `)
          .eq('is_published', true)
          .eq('is_deleted', false)
          .order('published_at', { ascending: false })
          .limit(limit);
        
        if (contentType) {
          query = query.eq('content_type', contentType);
        }
        
        if (featured) {
          query = query.eq('is_featured', true);
        }
        
        const { data, error: contentError } = await query;
        
        if (contentError) {
          setError('Error loading content');
          console.error('Content error:', contentError);
        } else {
          setContent(data as ContentItem[]);
        }
      } catch (err) {
        setError('Unexpected error');
        console.error('Loading error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadContent();
  }, [platformSlug, contentType, limit, featured]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-semibold">Error Loading Content</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (content.length === 0) {
    return (
      <div className="p-6 bg-gray-50 text-gray-700 rounded-lg">
        <p>No content available.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {content.map(item => (
        <ContentCard
          key={item.id}
          id={item.id}
          title={item.title}
          summary={item.summary}
          slug={item.slug}
          primaryImageUrl={item.primary_image_url}
          publishedAt={item.published_at}
          contentType={item.content_type}
          authorId={item.author_id}
          authorName={item.author?.full_name}
          platformSlug={platformSlug}
        />
      ))}
    </div>
  );
} 