import React from 'react';
import { useTenant } from '../context/TenantContext';
import Link from 'next/link';

export function TenantSelector() {
  const { currentTenant, userTenants, isLoading, switchTenant } = useTenant();
  
  if (isLoading) {
    return <div className="h-10 w-40 animate-pulse bg-gray-200 rounded-md"></div>;
  }
  
  if (!currentTenant || userTenants.length <= 1) {
    return null;
  }
  
  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <span className="text-sm font-medium">{currentTenant.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg hidden group-hover:block z-50">
        <div className="py-1">
          {userTenants.map(tenant => (
            <Link
              key={tenant.id}
              href={`/${tenant.slug}`}
              className={`block px-4 py-2 text-sm ${
                tenant.id === currentTenant.id 
                  ? 'bg-gray-100 text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                switchTenant(tenant.slug);
              }}
            >
              {tenant.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 