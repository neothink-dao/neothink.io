import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export type AccessDeniedProps = {
  /**
   * Platform name to display
   */
  platformName: string;
  /**
   * Callback when user requests access
   */
  onRequestAccess: () => void;
  /**
   * Reason for access denial (subscription, permission, custom)
   */
  reason?: 'subscription' | 'permission' | 'custom';
  /**
   * Name of the required permission (if reason is 'permission')
   */
  permissionName?: string;
  /**
   * Custom message to display
   */
  customMessage?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
};

/**
 * Component shown when a user doesn't have access to a platform
 * Enhanced to handle different reasons for access denial
 */
export default function AccessDenied({
  platformName,
  onRequestAccess,
  reason = 'subscription',
  permissionName,
  customMessage,
  className = ''
}: AccessDeniedProps) {
  const { colors } = useTheme();

  // Format platform name for display
  const displayName = platformName.charAt(0).toUpperCase() + platformName.slice(1);

  // Get title and message based on reason
  let title = 'Access Denied';
  let message = '';

  switch (reason) {
    case 'subscription':
      title = 'Subscription Required';
      message = `You need an active subscription to access the ${displayName} platform and unlock its valuable content and features.`;
      break;
    case 'permission':
      title = 'Permission Required';
      message = permissionName
        ? `You need the "${permissionName}" permission to access this area.`
        : `You don't have the required permissions to access this area of the ${displayName} platform.`;
      break;
    case 'custom':
      title = 'Access Restricted';
      message = customMessage || 
        `Access to this part of the ${displayName} platform is restricted. Please contact support if you believe this is an error.`;
      break;
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      style={{ minHeight: 'calc(100vh - 200px)' }}
    >
      <div className="mb-6 text-5xl">🔒</div>
      <h1 className="text-3xl font-bold mb-4">
        {title}
      </h1>
      <p className="text-lg mb-6 max-w-md">
        {message}
      </p>
      <button
        onClick={onRequestAccess}
        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
        style={{ backgroundColor: colors.primary }}
      >
        {reason === 'subscription' ? 'Upgrade Subscription' : 'Request Access'}
      </button>
    </div>
  );
} 