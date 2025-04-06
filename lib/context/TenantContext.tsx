import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  settings?: Record<string, any>;
  branding?: Record<string, any>;
  status: string;
};

type TenantContextType = {
  currentTenant: Tenant | null;
  userTenants: Tenant[];
  isLoading: boolean;
  error: Error | null;
  switchTenant: (tenantSlug: string) => Promise<void>;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children, initialTenantSlug }: { children: ReactNode, initialTenantSlug?: string }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [userTenants, setUserTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const supabase = useSupabaseClient();
  const user = useUser();
  
  // Load user's tenants
  useEffect(() => {
    async function loadUserTenants() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase.rpc('get_user_tenants', {
          _user_id: user.id
        });
        
        if (error) throw error;
        
        const tenants = data.map((t: any) => ({
          id: t.tenant_id,
          name: t.tenant_name,
          slug: t.tenant_slug,
          status: t.tenant_status,
        }));
        
        setUserTenants(tenants);
        
        // Set initial tenant if provided, otherwise default to first tenant
        if (initialTenantSlug) {
          const tenant = tenants.find(t => t.slug === initialTenantSlug);
          if (tenant) {
            setCurrentTenant(tenant);
          } else if (tenants.length > 0) {
            setCurrentTenant(tenants[0]);
          }
        } else if (tenants.length > 0) {
          setCurrentTenant(tenants[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tenants'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserTenants();
  }, [user, supabase, initialTenantSlug]);
  
  // Switch tenant function
  async function switchTenant(tenantSlug: string) {
    const tenant = userTenants.find(t => t.slug === tenantSlug);
    if (!tenant) {
      throw new Error(`Tenant with slug "${tenantSlug}" not found`);
    }
    setCurrentTenant(tenant);
    
    // Here you could add logic to update user preferences, etc.
    if (user) {
      await supabase.from('user_preferences')
        .upsert({
          user_id: user.id,
          platform: tenant.slug,
          preference_type: 'last_active_tenant',
          preference_value: { tenant_slug: tenant.slug }
        });
    }
  }
  
  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        userTenants,
        isLoading,
        error,
        switchTenant
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
} 