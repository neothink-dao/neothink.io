import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface PostProps {
  userId: string;
  supabaseUrl: string;
  supabaseKey: string;
  onPost?: () => void;
}

export function Post({ userId, supabaseUrl, supabaseKey, onPost }: PostProps) {
  const [content, setContent] = useState('');
  const [tokenTag, setTokenTag] = useState<string>('LUCK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient(supabaseUrl, supabaseKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          author_id: userId,
          token_tag: tokenTag,
          visibility: 'public'
        });

      if (error) throw error;

      setContent('');
      onPost?.();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[100px] w-full rounded-lg border p-3 resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <select
            value={tokenTag}
            onChange={(e) => setTokenTag(e.target.value)}
            className="rounded-lg border p-2"
            disabled={isSubmitting}
          >
            <option value="LUCK">LUCK</option>
            <option value="LIVE">LIVE</option>
            <option value="LOVE">LOVE</option>
            <option value="LIFE">LIFE</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
} 