import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { PlatformAccess } from '@neothink/ui/components/PlatformAccess';
import { getProfile, isAuthenticated, isGuardian } from '@neothink/core';
import AdminLayout from '@/components/layout/AdminLayout';

interface UserPlatformsPageProps {
  params: {
    id: string;
  };
}

export default async function UserPlatformsPage({ params }: UserPlatformsPageProps) {
  const { id } = params;
  
  // Verify admin access
  const isAuth = await isAuthenticated();
  const isAdmin = await isGuardian();
  
  if (!isAuth || !isAdmin) {
    redirect('/login');
  }
  
  // Get user profile
  const profile = await getProfile(id);
  
  if (!profile) {
    redirect('/admin/users');
  }
  
  return (
    <AdminLayout
      title={`Manage Platform Access for ${profile.full_name || profile.username || id}`}
      backUrl={`/admin/users/${id}`}
      description="Grant or revoke platform access for this user"
    >
      <div className="container mx-auto py-6">
        <div className="max-w-xl mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <PlatformAccess userId={id} />
          </Suspense>
        </div>
      </div>
    </AdminLayout>
  );
} 