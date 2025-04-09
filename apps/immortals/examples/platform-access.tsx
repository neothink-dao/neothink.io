import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from '@neothink/core';

/**
 * Example component demonstrating Immortals platform access management
 * Respects Row Level Security policies:
 * - Only users with Immortals platform access can view this component
 * - Admin users (guardians) can manage platform access for others
 * 
 * Supabase Launch Week 14 features used:
 * - Connection pooling: Automatically manages database connections efficiently
 * - Read Replica Routing: Read queries routed to replicas for better performance
 */
export default function ImmortalsPlatformAccess() {
  const [access, setAccess] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize Supabase client using the core package
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Not authenticated');
        return;
      }
      
      // Check if user is a guardian (admin)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_guardian, platforms')
        .eq('id', user.id)
        .single();
        
      setIsAdmin(profileData?.is_guardian || false);
      setUserProfile(profileData);
      
      // If admin, fetch all platform access records for Immortals
      // Otherwise, just fetch the user's access
      let query = supabase
        .from('platform_access')
        .select(`
          id,
          user_id,
          platform_slug,
          access_level,
          granted_at,
          granted_by,
          expires_at,
          profiles:user_id (email, full_name)
        `)
        .eq('platform_slug', 'immortals');
        
      if (!profileData?.is_guardian) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error: accessError } = await query.order('granted_at', { ascending: false });
        
      if (accessError) throw accessError;
      
      setAccess(data || []);
      
      // Log analytics event for platform access view
      await supabase
        .from('analytics_events')
        .insert({
          event_name: 'platform_access_view',
          platform: 'immortals',
          properties: { is_admin: profileData?.is_guardian || false }
        });
        
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function grantAccess(userId: string) {
    if (!isAdmin) {
      setError('Only guardians can grant access');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      // Insert platform access record
      // RLS will verify the current user is a guardian before allowing
      const { error } = await supabase
        .from('platform_access')
        .insert({
          user_id: userId,
          platform_slug: 'immortals',
          access_level: 'standard',
          granted_by: user.id
        });
        
      if (error) throw error;
      
      // Refresh the data
      fetchData();
    } catch (err: any) {
      setError(err.message);
      console.error('Error granting access:', err);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Immortals Platform Access</h2>
      
      {userProfile && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold">Your Access</h3>
            <p><strong>Guardian Status:</strong> {userProfile.is_guardian ? 'Yes' : 'No'}</p>
            <p><strong>Platforms:</strong> {userProfile.platforms?.join(', ') || 'None'}</p>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      {isAdmin && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-blue-700">Guardian Tools</h3>
          <p className="mb-4">As a guardian, you can manage platform access for other users.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              id="userId" 
              placeholder="User ID"
              className="px-2 py-1 border rounded-md"
            />
            <Button onClick={() => {
              const userId = (document.getElementById('userId') as HTMLInputElement)?.value;
              if (userId) grantAccess(userId);
              else setError('Please enter a user ID');
            }}>
              Grant Immortals Access
            </Button>
          </div>
        </div>
      )}
      
      {loading ? (
        <p>Loading access data...</p>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Immortals Access Records</h3>
          
          {access.length === 0 ? (
            <p>No access records found.</p>
          ) : (
            access.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <p><strong>User:</strong> {record.profiles?.full_name || record.user_id}</p>
                  <p><strong>Email:</strong> {record.profiles?.email || 'N/A'}</p>
                  <p><strong>Access Level:</strong> {record.access_level}</p>
                  <p><strong>Granted:</strong> {new Date(record.granted_at).toLocaleString()}</p>
                  {record.expires_at && (
                    <p><strong>Expires:</strong> {new Date(record.expires_at).toLocaleString()}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 