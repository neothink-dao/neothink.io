import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponent, PlatformSlug } from '../../supabase/auth-client';
import LoadingSpinner from '../LoadingSpinner';

interface ContentManagerProps {
  platformSlug: PlatformSlug;
  className?: string;
}

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export default function ContentManager({
  platformSlug,
  className = ''
}: ContentManagerProps) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const router = useRouter();
  
  useEffect(() => {
    loadContent();
  }, [platformSlug, contentTypeFilter, publishedFilter, searchQuery]);
  
  async function loadContent() {
    try {
      setLoading(true);
      const supabase = createClientComponent(platformSlug);
      
      let query = supabase
        .from('shared_content')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (contentTypeFilter !== 'all') {
        query = query.eq('content_type', contentTypeFilter);
      }
      
      if (publishedFilter !== 'all') {
        const isPublished = publishedFilter === 'published';
        query = query.eq('is_published', isPublished);
      }
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      const { data, error: contentError } = await query;
      
      if (contentError) {
        setError('Error loading content: ' + contentError.message);
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
  
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }
    
    try {
      const supabase = createClientComponent(platformSlug);
      
      // Soft delete - mark as deleted
      const { error: deleteError } = await supabase
        .from('shared_content')
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (deleteError) {
        setError('Error deleting content: ' + deleteError.message);
        return;
      }
      
      // Reload content after deletion
      loadContent();
    } catch (err) {
      setError('Unexpected error');
      console.error('Delete error:', err);
    }
  }
  
  async function handleTogglePublished(id: string, currentState: boolean) {
    try {
      const supabase = createClientComponent(platformSlug);
      
      const updates: any = {
        is_published: !currentState,
        updated_at: new Date().toISOString()
      };
      
      // If publishing for the first time, set published_at date
      if (!currentState) {
        updates.published_at = new Date().toISOString();
      }
      
      const { error: updateError } = await supabase
        .from('shared_content')
        .update(updates)
        .eq('id', id);
      
      if (updateError) {
        setError('Error updating content: ' + updateError.message);
        return;
      }
      
      // Reload content after update
      loadContent();
    } catch (err) {
      setError('Unexpected error');
      console.error('Update error:', err);
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading && content.length === 0) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
        
        <Link
          href="/admin/content/new"
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Content
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="course">Courses</option>
            <option value="event">Events</option>
            <option value="resource">Resources</option>
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>
      
      {content.length === 0 ? (
        <div className="p-6 bg-gray-50 text-gray-700 rounded-lg text-center">
          <p>No content found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>
                    {item.is_featured && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleTogglePublished(item.id, item.is_published)}
                        className={`text-sm ${
                          item.is_published ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        {item.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/content/edit/${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 