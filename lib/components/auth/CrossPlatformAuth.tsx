import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Tenant = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  branding?: {
    logo_url?: string;
    primary_color?: string;
  };
  role: string;
  primary_domain?: string;
  is_active: boolean;
};

interface AuthProps {
  mode: 'signin' | 'signup';
  tenantSlug?: string;
  redirectTo?: string;
  onSuccess?: (user: any) => void;
}

export default function CrossPlatformAuth({ mode, tenantSlug, redirectTo, onSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [accessibleTenants, setAccessibleTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  
  // If user is already logged in, fetch their accessible tenants
  useEffect(() => {
    if (user) {
      fetchAccessibleTenants();
    }
  }, [user]);
  
  // If tenantSlug is provided, set it as the selected tenant
  useEffect(() => {
    if (tenantSlug) {
      setSelectedTenant(tenantSlug);
    }
  }, [tenantSlug]);
  
  async function fetchAccessibleTenants() {
    try {
      const { data, error } = await supabase.rpc('get_user_accessible_tenants', {
        _user_id: user?.id
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAccessibleTenants(data);
        
        // If there's only one tenant or if tenantSlug is specified and valid
        if (data.length === 1 || (tenantSlug && data.some(t => t.slug === tenantSlug))) {
          const tenant = tenantSlug 
            ? data.find(t => t.slug === tenantSlug) 
            : data[0];
            
          if (tenant) {
            setSelectedTenant(tenant.slug);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching accessible tenants:', error);
    }
  }
  
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          throw error;
        }
        
        if (data?.user) {
          // If user successfully signed in, fetch their accessible tenants
          await fetchAccessibleTenants();
          
          if (onSuccess) {
            onSuccess(data.user);
          }
          
          // If redirectTo is provided and selectedTenant is available, redirect
          if (redirectTo && selectedTenant) {
            router.push(redirectTo.replace('{tenant}', selectedTenant));
          }
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?tenant=${selectedTenant || tenantSlug || 'hub'}`,
          },
        });
        
        if (error) {
          throw error;
        }
        
        setMessage({
          type: 'success',
          text: 'Check your email for the confirmation link.',
        });
        
        if (onSuccess && data.user) {
          onSuccess(data.user);
        }
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during authentication.',
      });
    } finally {
      setLoading(false);
    }
  }
  
  function handleTenantSelect(slug: string) {
    setSelectedTenant(slug);
  }
  
  // If user is logged in and has accessible tenants, show tenant selection
  if (user && accessibleTenants.length > 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Select Platform</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {accessibleTenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => handleTenantSelect(tenant.slug)}
              className={`p-4 border rounded-lg flex items-center ${
                selectedTenant === tenant.slug
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } ${!tenant.is_active ? 'opacity-50' : ''}`}
              disabled={!tenant.is_active}
            >
              <div className="mr-4">
                {tenant.branding?.logo_url ? (
                  <Image
                    src={tenant.branding.logo_url}
                    alt={tenant.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                    style={tenant.branding?.primary_color ? { backgroundColor: tenant.branding.primary_color } : {}}
                  >
                    {tenant.name.substring(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{tenant.name}</div>
                <div className="text-sm text-gray-500">{tenant.description || `Access as ${tenant.role}`}</div>
              </div>
              {!tenant.is_active && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded ml-2">Inactive</span>
              )}
            </button>
          ))}
        </div>
        
        {selectedTenant && (
          <div className="mt-6">
            <button
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={() => {
                if (redirectTo) {
                  router.push(redirectTo.replace('{tenant}', selectedTenant));
                }
              }}
            >
              Continue to {accessibleTenants.find(t => t.slug === selectedTenant)?.name}
            </button>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={async () => {
              await supabase.auth.signOut();
              router.refresh();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  
  // Otherwise, show login/signup form
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'signin' ? 'Sign In' : 'Create an Account'}
      </h2>
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {message && (
          <div
            className={`p-3 rounded ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}
        
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        {mode === 'signin' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
} 