import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClientComponent, UserProfile as ProfileType } from '../../supabase/auth-client';
import { PlatformSlug } from '../../supabase/auth-client';
import LoadingSpinner from '../LoadingSpinner';

interface UserProfileProps {
  platformSlug: PlatformSlug;
  className?: string;
}

export default function UserProfile({ platformSlug, className = '' }: UserProfileProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClientComponent(platformSlug);
        
        // Get the user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        // Get profile data
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          setError('Error loading profile');
          setLoading(false);
          return;
        }
        
        setProfile(data);
      } catch (err) {
        setError('Unexpected error');
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [platformSlug]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !profile) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-semibold">Error Loading Profile</h3>
        <p>{error || 'Profile not found'}</p>
      </div>
    );
  }
  
  const hasAvatar = !!profile.avatar_url;
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
          {hasAvatar ? (
            <Image 
              src={profile.avatar_url!} 
              alt={profile.full_name || profile.email} 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="text-3xl font-bold text-gray-400">
              {profile.full_name ? profile.full_name[0].toUpperCase() : profile.email[0].toUpperCase()}
            </div>
          )}
          
          {profile.is_guardian && (
            <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-1 rounded-sm">
              Guardian
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.full_name || 'Profile Name'}</h2>
          <p className="text-gray-600">{profile.email}</p>
          
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Platform Access</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.platforms && profile.platforms.map(platform => (
                <span 
                  key={platform} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </span>
              ))}
              
              {(!profile.platforms || profile.platforms.length === 0) && (
                <span className="text-gray-500 italic">No platform access</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => router.push(`/profile/edit`)}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
} 