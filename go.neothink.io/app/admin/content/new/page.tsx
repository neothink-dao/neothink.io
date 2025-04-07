import { ContentEditor } from '@/lib/components/content';
import { PlatformSlug } from '@/lib/supabase/auth-client';

export const dynamic = 'force-dynamic';

export default function NewContentPage() {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Content</h2>
      <ContentEditor platformSlug={platformSlug} />
    </div>
  );
} 