import { AdminDashboard } from '@/lib/components/admin';
import { PlatformSlug } from '@/lib/supabase/auth-client';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <AdminDashboard platformSlug={platformSlug} />
  );
} 