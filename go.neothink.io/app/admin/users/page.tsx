import { UserManager } from '@/lib/components/admin';
import { PlatformSlug } from '@/lib/supabase/auth-client';

export const dynamic = 'force-dynamic';

export default function UserManagementPage() {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <UserManager platformSlug={platformSlug} />
  );
} 