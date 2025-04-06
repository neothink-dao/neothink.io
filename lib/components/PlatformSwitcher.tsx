import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAccessiblePlatforms } from '../hooks/use-platform-access';
import { PlatformSlug } from '../supabase/auth-client';
import { sitesConfig, getPlatformSwitchUrl } from '../config/sites';
import LoadingSpinner from './LoadingSpinner';

interface PlatformSwitcherProps {
  /**
   * The current platform
   */
  currentPlatform: PlatformSlug;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Whether to use a dropdown (true) or a list (false)
   * @default true
   */
  dropdown?: boolean;
  
  /**
   * Optional renderer for platform items
   */
  renderPlatform?: (platform: PlatformSlug, isActive: boolean) => React.ReactNode;
}

/**
 * A component that allows users to switch between platforms they have access to
 */
export default function PlatformSwitcher({
  currentPlatform,
  className = '',
  dropdown = true,
  renderPlatform,
}: PlatformSwitcherProps) {
  const router = useRouter();
  const { platforms, isLoading, error } = useAccessiblePlatforms();
  const [isOpen, setIsOpen] = useState(false);
  
  // If loading or error, show appropriate state
  if (isLoading) {
    return <LoadingSpinner size={24} />;
  }
  
  if (error || platforms.length === 0) {
    return null;
  }
  
  // If user only has access to one platform, don't show switcher
  if (platforms.length === 1 && platforms[0] === currentPlatform) {
    return null;
  }
  
  // Handle platform switch
  const handlePlatformSwitch = (platform: PlatformSlug) => {
    if (platform === currentPlatform) return;
    
    const targetUrl = getPlatformSwitchUrl(currentPlatform, platform, router.asPath);
    window.location.href = targetUrl;
  };
  
  // If using a dropdown
  if (dropdown) {
    const currentSite = sitesConfig[currentPlatform];
    
    return (
      <div className={`relative ${className}`}>
        <button
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img 
            src={currentSite.logoSrc} 
            alt={currentSite.name} 
            className="w-6 h-6 rounded"
          />
          <span>{currentSite.name}</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {platforms.map(platform => {
                const site = sitesConfig[platform];
                const isActive = platform === currentPlatform;
                
                if (renderPlatform) {
                  return (
                    <div 
                      key={platform} 
                      onClick={() => {
                        handlePlatformSwitch(platform);
                        setIsOpen(false);
                      }}
                    >
                      {renderPlatform(platform, isActive)}
                    </div>
                  );
                }
                
                return (
                  <button
                    key={platform}
                    className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                      isActive 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    role="menuitem"
                    onClick={() => {
                      handlePlatformSwitch(platform);
                      setIsOpen(false);
                    }}
                  >
                    <img 
                      src={site.logoSrc} 
                      alt={site.name} 
                      className="w-5 h-5 mr-3 rounded" 
                    />
                    <span>{site.name}</span>
                    {isActive && (
                      <svg className="ml-auto w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // If not using a dropdown, show as a list
  return (
    <div className={`flex space-x-2 ${className}`}>
      {platforms.map(platform => {
        const site = sitesConfig[platform];
        const isActive = platform === currentPlatform;
        
        if (renderPlatform) {
          return (
            <div 
              key={platform}
              onClick={() => handlePlatformSwitch(platform)}
            >
              {renderPlatform(platform, isActive)}
            </div>
          );
        }
        
        return (
          <button
            key={platform}
            className={`flex items-center px-3 py-1 text-sm rounded ${
              isActive 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => handlePlatformSwitch(platform)}
          >
            <img 
              src={site.logoSrc} 
              alt={site.name} 
              className="w-4 h-4 mr-2 rounded" 
            />
            <span>{site.name}</span>
          </button>
        );
      })}
    </div>
  );
} 