import { useState, useEffect } from 'react';
import { createClientComponent, PlatformSlug } from '../../supabase/auth-client';
import LoadingSpinner from '../LoadingSpinner';

interface UserManagerProps {
  platformSlug: PlatformSlug;
  className?: string;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string;
  platforms: string[];
  is_guardian: boolean;
}

export default function UserManager({
  platformSlug,
  className = ''
}: UserManagerProps) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  useEffect(() => {
    loadUsers();
  }, [platformSlug, searchQuery, roleFilter]);
  
  async function loadUsers() {
    try {
      setLoading(true);
      const supabase = createClientComponent(platformSlug);
      
      // Join platform_access and profiles tables to get complete user data
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          created_at,
          role,
          platforms,
          is_guardian
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }
      
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      
      const { data, error: usersError } = await query;
      
      if (usersError) {
        setError('Error loading users: ' + usersError.message);
      } else {
        setUsers(data as UserData[]);
      }
    } catch (err) {
      setError('Unexpected error');
      console.error('Loading error:', err);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const supabase = createClientComponent(platformSlug);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        setError('Error updating user role: ' + updateError.message);
        return;
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError('Unexpected error');
      console.error('Update error:', err);
    }
  }
  
  async function handleToggleGuardian(userId: string, currentState: boolean) {
    try {
      const supabase = createClientComponent(platformSlug);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_guardian: !currentState,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        setError('Error updating guardian status: ' + updateError.message);
        return;
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, is_guardian: !currentState } : user
        )
      );
    } catch (err) {
      setError('Unexpected error');
      console.error('Update error:', err);
    }
  }
  
  async function handlePlatformAccess(userId: string, platform: string, currentAccess: boolean) {
    try {
      const supabase = createClientComponent(platformSlug);
      
      // Get current user data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('platforms')
        .eq('id', userId)
        .single();
      
      if (userError) {
        setError('Error getting user data: ' + userError.message);
        return;
      }
      
      let updatedPlatforms = [...(userData.platforms || [])];
      
      if (currentAccess) {
        // Remove platform
        updatedPlatforms = updatedPlatforms.filter(p => p !== platform);
      } else {
        // Add platform
        updatedPlatforms.push(platform);
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          platforms: updatedPlatforms,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        setError('Error updating platform access: ' + updateError.message);
        return;
      }
      
      // Update platform_access table
      if (currentAccess) {
        // Remove access
        await supabase
          .from('platform_access')
          .delete()
          .match({
            user_id: userId,
            tenant_slug: platform
          });
      } else {
        // Add access
        await supabase
          .from('platform_access')
          .insert({
            user_id: userId,
            tenant_slug: platform,
            created_at: new Date().toISOString()
          });
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              platforms: currentAccess
                ? user.platforms.filter(p => p !== platform)
                : [...user.platforms, platform]
            };
          }
          return user;
        })
      );
    } catch (err) {
      setError('Unexpected error');
      console.error('Update error:', err);
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="contributor">Contributor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      
      {users.length === 0 ? (
        <div className="p-6 bg-gray-50 text-gray-700 rounded-lg text-center">
          <p>No users found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform Access
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'No Name'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="user">User</option>
                      <option value="contributor">Contributor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {['ascenders', 'immortals', 'neothinkers', 'hub'].map(platform => (
                        <button
                          key={platform}
                          onClick={() => handlePlatformAccess(
                            user.id, 
                            platform, 
                            user.platforms?.includes(platform) || false
                          )}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            user.platforms?.includes(platform)
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleGuardian(user.id, user.is_guardian)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.is_guardian
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.is_guardian ? 'Guardian' : 'Not Guardian'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 