import { useMemo } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTenant } from '../context/TenantContext';

/**
 * A hook that provides a convenient way to query data specific to the current tenant
 * This abstracts away the complexities of ensuring tenant data isolation
 */
export function useTenantQuery() {
  const { currentTenant } = useTenant();
  const supabase = useSupabaseClient();
  
  const tenantQuery = useMemo(() => {
    if (!currentTenant) {
      return {
        from: (table: string) => ({
          select: () => Promise.resolve({ data: null, error: new Error('No tenant selected') })
        })
      };
    }
    
    return {
      /**
       * Query a table with automatic tenant filtering
       * This ensures users can only access data from their current tenant
       */
      from: (table: string) => {
        // Add tenant filtering based on the table
        const query = supabase.from(table);
        
        return {
          /**
           * Select data with automatic tenant filtering
           */
          select: (columns: string = '*') => {
            // Determine how to filter based on the table structure
            if (table === 'content_modules') {
              return query.select(columns).eq('platform', currentTenant.slug);
            } 
            else if (table === 'lessons' || table === 'resources') {
              // For lessons, we need to filter based on the module's platform
              return query
                .select(`${columns}, content_modules!inner(platform)`)
                .eq('content_modules.platform', currentTenant.slug);
            }
            else if (table === 'tenant_users') {
              return query.select(columns).eq('tenant_id', currentTenant.id);
            }
            else if (table === 'activity_feed') {
              return query.select(columns).eq('platform', currentTenant.slug);
            }
            else {
              // For tables without direct tenant relationship, don't apply filtering
              // The RLS policies should handle this instead
              return query.select(columns);
            }
          },
          
          /**
           * Insert data with automatic tenant association
           */
          insert: (data: any | any[]) => {
            const isArray = Array.isArray(data);
            const items = isArray ? data : [data];
            
            // Add tenant info to each item based on the table
            const tenantizedItems = items.map(item => {
              const newItem = { ...item };
              
              if (table === 'content_modules') {
                newItem.platform = currentTenant.slug;
              }
              else if (table === 'tenant_users') {
                if (!newItem.tenant_id) {
                  newItem.tenant_id = currentTenant.id;
                }
              }
              else if (table === 'activity_feed') {
                newItem.platform = currentTenant.slug;
              }
              
              return newItem;
            });
            
            return query.insert(isArray ? tenantizedItems : tenantizedItems[0]);
          },
          
          /**
           * Update data with tenant validation
           * This ensures updates only happen for the current tenant's data
           */
          update: (data: any) => {
            // For tenant-specific tables, add a where clause to ensure
            // we're only updating data for the current tenant
            if (table === 'content_modules') {
              return query.update(data).eq('platform', currentTenant.slug);
            }
            else if (table === 'tenant_users') {
              return query.update(data).eq('tenant_id', currentTenant.id);
            }
            else if (table === 'activity_feed') {
              return query.update(data).eq('platform', currentTenant.slug);
            }
            else {
              // For tables without direct tenant relationship, don't apply filtering
              // The RLS policies should handle this
              return query.update(data);
            }
          },
          
          /**
           * Delete data with tenant validation
           * This ensures deletions only happen for the current tenant's data
           */
          delete: () => {
            // For tenant-specific tables, add a where clause to ensure
            // we're only deleting data for the current tenant
            if (table === 'content_modules') {
              return query.delete().eq('platform', currentTenant.slug);
            }
            else if (table === 'tenant_users') {
              return query.delete().eq('tenant_id', currentTenant.id);
            }
            else if (table === 'activity_feed') {
              return query.delete().eq('platform', currentTenant.slug);
            }
            else {
              // For tables without direct tenant relationship, don't apply filtering
              // The RLS policies should handle this
              return query.delete();
            }
          }
        };
      },
      
      /**
       * Execute a tenant-specific RPC function
       */
      rpc: (functionName: string, params: any = {}) => {
        // Add tenant context to the params if appropriate
        const tenantParams = {
          ...params
        };
        
        // Check if the function accepts tenant-related parameters
        if (functionName.includes('tenant') || functionName.includes('user')) {
          if (!tenantParams._tenant_id && !tenantParams.tenant_id) {
            tenantParams._tenant_id = currentTenant.id;
          }
          if (!tenantParams._tenant_slug && !tenantParams.tenant_slug) {
            tenantParams._tenant_slug = currentTenant.slug;
          }
        }
        
        return supabase.rpc(functionName, tenantParams);
      }
    };
  }, [currentTenant, supabase]);
  
  return {
    tenantQuery,
    currentTenant
  };
} 