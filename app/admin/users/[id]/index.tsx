import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@neothink/ui/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@neothink/ui/components/ui/card';
import { getProfile, isAuthenticated, isGuardian } from '@neothink/core';
import AdminLayout from '@/components/layout/AdminLayout';

interface UserPageProps {
  params: {
    id: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
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
      title={`User: ${profile.full_name || profile.email}`}
      description="Manage user information and access"
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>View and manage user details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email:</span> {profile.email}
              </div>
              <div>
                <span className="font-medium">Name:</span> {profile.full_name || 'Not set'}
              </div>
              <div>
                <span className="font-medium">User ID:</span> {profile.id}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/admin/users/${id}/platforms`} passHref>
              <Button variant="default">
                Manage Platform Access
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
} 