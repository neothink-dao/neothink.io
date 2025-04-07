import { ContentEditor } from '@/lib/components/content';
import { PlatformSlug } from '@/lib/supabase/auth-client';

export const dynamic = 'force-dynamic';

interface EditContentPageProps {
  params: {
    id: string;
  };
}

export default function EditContentPage({ params }: EditContentPageProps) {
  const platformSlug: PlatformSlug = 'hub';
  const { id } = params;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Content</h2>
      <ContentEditor platformSlug={platformSlug} contentId={id} />
    </div>
  );
} 