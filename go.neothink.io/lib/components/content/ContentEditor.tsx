'use client';

import { ContentForm } from './ContentForm';
import { PlatformSlug } from '@/lib/supabase/auth-client';

interface ContentEditorProps {
  platformSlug: PlatformSlug;
  contentId: string;
}

export function ContentEditor({ platformSlug, contentId }: ContentEditorProps) {
  return (
    <div className="space-y-8">
      <ContentForm platformSlug={platformSlug} contentId={contentId} />
    </div>
  );
} 