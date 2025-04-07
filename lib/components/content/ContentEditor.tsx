import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponent, PlatformSlug } from '../../supabase/auth-client';
import LoadingSpinner from '../LoadingSpinner';

interface ContentEditorProps {
  platformSlug: PlatformSlug;
  contentId?: string; // Undefined for new content
  className?: string;
}

interface ContentData {
  id?: string;
  title: string;
  summary: string;
  slug: string;
  content: string;
  primary_image_url: string;
  content_type: string;
  is_published: boolean;
  is_featured: boolean;
}

export default function ContentEditor({
  platformSlug,
  contentId,
  className = ''
}: ContentEditorProps) {
  const isEditMode = !!contentId;
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<ContentData>({
    title: '',
    summary: '',
    slug: '',
    content: '',
    primary_image_url: '',
    content_type: 'article',
    is_published: false,
    is_featured: false
  });
  
  const router = useRouter();
  
  useEffect(() => {
    if (contentId) {
      async function loadContent() {
        try {
          const supabase = createClientComponent(platformSlug);
          
          const { data, error: contentError } = await supabase
            .from('shared_content')
            .select('*')
            .eq('id', contentId)
            .single();
          
          if (contentError) {
            setError('Error loading content: ' + contentError.message);
            setLoading(false);
            return;
          }
          
          setFormData(data);
        } catch (err) {
          setError('Unexpected error');
          console.error('Loading error:', err);
        } finally {
          setLoading(false);
        }
      }
      
      loadContent();
    }
  }, [contentId, platformSlug]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Auto-generate slug from title if in create mode and slug is empty
    if (name === 'title' && !isEditMode && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const supabase = createClientComponent(platformSlug);
      
      if (isEditMode) {
        // Update existing content
        const { error: updateError } = await supabase
          .from('shared_content')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', contentId);
        
        if (updateError) {
          setError('Error updating content: ' + updateError.message);
          return;
        }
      } else {
        // Create new content
        const { error: insertError } = await supabase
          .from('shared_content')
          .insert({
            ...formData,
            tenant_slug: platformSlug,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          setError('Error creating content: ' + insertError.message);
          return;
        }
      }
      
      setSuccess(true);
      
      // Redirect after successful save
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError('Unexpected error');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Content' : 'Create New Content'}
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
          Content {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Content Title"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="content-slug"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Content Type
            </label>
            <select
              name="content_type"
              value={formData.content_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="course">Course</option>
              <option value="event">Event</option>
              <option value="resource">Resource</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the content"
              rows={2}
              required
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Main Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full content body (supports markdown)"
              rows={12}
              required
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Primary Image URL
            </label>
            <input
              type="url"
              name="primary_image_url"
              value={formData.primary_image_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {formData.primary_image_url && (
              <div className="mt-2">
                <img 
                  src={formData.primary_image_url} 
                  alt="Primary image preview" 
                  className="h-32 object-cover rounded"
                  onError={() => setError('Invalid image URL')}
                />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
                Publish Content
              </label>
            </div>
            <p className="text-xs text-gray-500">
              When checked, content will be visible to users
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700">
                Feature Content
              </label>
            </div>
            <p className="text-xs text-gray-500">
              When checked, content will appear in featured sections
            </p>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => router.push('/admin/content')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Content' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  );
} 