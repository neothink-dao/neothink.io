import React from 'react';
import { analytics } from '@neothink/analytics';
import { LockIcon, CalendarIcon } from 'lucide-react';

interface LockedFeatureTeaserProps {
  /**
   * The name of the feature that is locked
   */
  feature: string;
  
  /**
   * The platform this feature is on
   */
  platform: 'hub' | 'ascenders' | 'neothinkers' | 'immortals';
  
  /**
   * When the feature will be unlocked (e.g., "next week", "week 3")
   */
  unlockTime?: string;
  
  /**
   * Custom message to display
   */
  message?: string;
  
  /**
   * Optional function to handle click events
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A component that displays a teaser for a locked feature.
 * The component automatically tracks unlock attempts using the analytics package.
 * 
 * See DEVELOPMENT.md for more details on feature unlocking.
 */
export function LockedFeatureTeaser({
  feature,
  platform,
  unlockTime = 'next week',
  message,
  onClick,
  className = '',
}: LockedFeatureTeaserProps) {
  const defaultMessage = `This feature will unlock ${unlockTime}.`;
  const displayMessage = message || defaultMessage;
  
  const handleClick = () => {
    // Track the unlock attempt
    analytics.trackFeatureUnlockAttempt(platform, feature, false, 'time_requirement');
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 rounded-lg border border-gray-200 bg-gray-50 text-center space-y-4 ${className}`}
      onClick={handleClick}
      data-testid={`locked-feature-${feature}`}
    >
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
        <LockIcon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-700 capitalize">
        {feature}
      </h3>
      
      <p className="text-gray-500 max-w-md">
        {displayMessage}
      </p>
      
      <div className="flex items-center text-gray-400 text-sm">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <span>Coming {unlockTime}</span>
      </div>
      
      <button 
        className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        onClick={handleClick}
      >
        Get Notified
      </button>
    </div>
  );
} 