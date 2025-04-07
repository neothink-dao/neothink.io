import { ContentManager } from '@/lib/components/content';
import { PlatformSlug } from '@/lib/supabase/auth-client';

export const dynamic = 'force-dynamic';

export default function ContentManagementPage() {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <ContentManager platformSlug={platformSlug} />
  );
} 