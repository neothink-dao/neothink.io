import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponent, UserProfile, PlatformSlug } from '../../supabase/auth-client';
import LoadingSpinner from '../LoadingSpinner';

interface ProfileEditorProps {
  platformSlug: PlatformSlug;
  className?: string;
}

export default function ProfileEditor({ platformSlug, className = '' }: ProfileEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
        setBio(data.bio || '');
      } catch (err) {
        setError('Unexpected error');
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [platformSlug]);
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    
    try {
      setSaving(true);
      const supabase = createClientComponent(platformSlug);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          bio: bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
        
      if (updateError) {
        setError('Error updating profile: ' + updateError.message);
        return;
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Unexpected error saving profile');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error && !profile) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-semibold">Error Loading Profile</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
          Profile updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/avatar.jpg"
          />
          {avatarUrl && (
            <div className="mt-2">
              <img 
                src={avatarUrl} 
                alt="Avatar preview" 
                className="w-16 h-16 rounded-full object-cover"
                onError={() => setError('Invalid avatar URL')}
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 