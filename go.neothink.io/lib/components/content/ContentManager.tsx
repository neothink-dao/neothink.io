'use client';

import { ContentList } from './ContentList';
import { ContentForm } from './ContentForm';
import { PlatformSlug } from '@/lib/supabase/auth-client';

interface ContentManagerProps {
  platformSlug: PlatformSlug;
}

export function ContentManager({ platformSlug }: ContentManagerProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
      <ContentList platformSlug={platformSlug} />
    </div>
  );
} 