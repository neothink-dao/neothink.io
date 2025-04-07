import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponent, PlatformSlug } from '../../supabase/auth-client';

interface ContentCardProps {
  id: string;
  title: string;
  summary?: string;
  slug: string;
  primaryImageUrl?: string;
  publishedAt?: string;
  contentType: string;
  authorId?: string;
  authorName?: string;
  platformSlug: PlatformSlug;
  className?: string;
  showActions?: boolean;
}

export default function ContentCard({
  id,
  title,
  summary,
  slug,
  primaryImageUrl,
  publishedAt,
  contentType,
  authorId,
  authorName,
  platformSlug,
  className = '',
  showActions = true
}: ContentCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const formattedDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      })
    : null;
  
  const contentTypeMap: Record<string, { label: string, color: string }> = {
    'article': { label: 'Article', color: 'bg-blue-100 text-blue-800' },
    'video': { label: 'Video', color: 'bg-red-100 text-red-800' },
    'course': { label: 'Course', color: 'bg-green-100 text-green-800' },
    'event': { label: 'Event', color: 'bg-purple-100 text-purple-800' },
    'resource': { label: 'Resource', color: 'bg-yellow-100 text-yellow-800' }
  };
  
  const contentTypeInfo = contentTypeMap[contentType] || { 
    label: contentType.charAt(0).toUpperCase() + contentType.slice(1), 
    color: 'bg-gray-100 text-gray-800' 
  };
  
  async function toggleBookmark() {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const supabase = createClientComponent(platformSlug);
      
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_reactions')
          .delete()
          .match({ 
            shared_content_id: id,
            reaction_type: 'bookmark',
            tenant_slug: platformSlug
          });
      } else {
        // Add bookmark
        await supabase
          .from('content_reactions')
          .insert({
            shared_content_id: id,
            reaction_type: 'bookmark',
            tenant_slug: platformSlug
          });
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {primaryImageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={primaryImageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${contentTypeInfo.color}`}>
              {contentTypeInfo.label}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          <Link href={`/content/${slug}`} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>
        
        {summary && (
          <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          {authorName && (
            <span>{authorName}</span>
          )}
          
          {formattedDate && (
            <span>{formattedDate}</span>
          )}
        </div>
        
        {showActions && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <Link
              href={`/content/${slug}`}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              Read More
            </Link>
            
            <button 
              onClick={toggleBookmark}
              disabled={isLoading}
              className="text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this content"}
            >
              {isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 