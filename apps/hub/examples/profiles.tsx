import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from '@neothink/core';

/**
 * Example component demonstrating how to fetch Hub user profiles
 * Respects Row Level Security policies:
 * - Users can only view profiles they have platform access to
 * - Guardian (admin) users can view all profiles
 * 
 * Supabase Launch Week 14 features used:
 * - Postgres Connection Pooling: Efficiently handles concurrent connections
 * - Read Replica Routing: Automatically routes read queries to replicas
 */
export default function HubProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client using the core package
  const supabase = createClient();

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      
      // Fetch hub profiles - RLS will automatically restrict access
      // Only users with hub platform access can view these profiles
      const { data, error } = await supabase
        .from('hub_profiles')
        .select(`
          id,
          user_id,
          display_name,
          bio,
          preferences,
          created_at,
          updated_at
        `)
        .limit(10);
        
      if (error) throw error;
      
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      // Update user's own hub profile
      // RLS ensures users can only update their own profiles
      const { error } = await supabase
        .from('hub_profiles')
        .update({
          bio: `Updated profile bio: ${new Date().toISOString()}`,
          preferences: { theme: 'dark', notifications: true }
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Refresh the profiles list
      fetchProfiles();
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating profile:', err);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hub User Profiles</h2>
      
      <div className="flex gap-4">
        <Button onClick={fetchProfiles}>
          Refresh Profiles
        </Button>
        
        <Button onClick={updateProfile} variant="outline">
          Update My Profile
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Hub Profiles</h3>
          
          {profiles.length === 0 ? (
            <p>No profiles found. You may not have access to view Hub profiles.</p>
          ) : (
            profiles.map((profile) => (
              <Card key={profile.id}>
                <CardContent className="p-4">
                  <p><strong>Name:</strong> {profile.display_name || 'Unnamed'}</p>
                  <p><strong>Bio:</strong> {profile.bio || 'No bio provided'}</p>
                  <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                  <p><strong>Preferences:</strong> {JSON.stringify(profile.preferences)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 