import { ProfileEditor } from '@/lib/components/profile';
import { PlatformSlug } from '@/lib/supabase/auth-client';
import ProtectedRoute from '@/lib/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function EditProfilePage() {
  const platformSlug: PlatformSlug = 'hub';
  
  return (
    <ProtectedRoute requiredPlatform={platformSlug}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        <ProfileEditor platformSlug={platformSlug} className="max-w-2xl" />
      </div>
    </ProtectedRoute>
  );
} 