import React from 'react';
import { PlatformTheme } from '../styles/tokens/colors';
import { getPlatformBorderRadius, getGradient } from '../styles/theme-utils';
import { animation } from '../styles/tokens/animation';

interface SacredButtonProps {
  /**
   * The platform this button belongs to
   */
  platform: PlatformTheme;
  
  /**
   * Button label content
   */
  children: React.ReactNode;
  
  /**
   * Button variant
   * - primary: Solid background with the platform's accent color
   * - secondary: Light background with accent colored border
   * - gradient: Platform-specific gradient background
   * - ghost: No background, only text color changes
   */
  variant?: 'primary' | 'secondary' | 'gradient' | 'ghost';
  
  /**
   * Button size
   * - sm: Small size (multiples of 3)
   * - md: Medium size (multiples of 6)
   * - lg: Large size (multiples of 9)
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Optional className to extend styling
   */
  className?: string;
  
  /**
   * Optional button type
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * SacredButton component based on sacred geometry principles
 * - Uses platform-specific styling
 * - Border radius follows sacred geometry patterns
 * - Animation timing based on Fibonacci sequence
 */
export function SacredButton({
  platform,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: SacredButtonProps) {
  // Get platform-specific styling
  const borderRadius = getPlatformBorderRadius(platform);
  const gradient = getGradient(platform);
  
  // Define button styles based on platform
  const buttonStyles: React.CSSProperties = {
    borderRadius: size === 'sm' 
      ? borderRadius.sm 
      : size === 'md' 
        ? borderRadius.md 
        : borderRadius.lg,
    transition: animation.transition.default,
  };
  
  if (variant === 'gradient') {
    buttonStyles.background = gradient;
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'py-3 px-6 text-sm',
    md: 'py-6 px-9 text-base',
    lg: 'py-9 px-18 text-lg',
  }[size];
  
  // Variant classes
  let variantClasses = '';
  
  switch (variant) {
    case 'primary':
      if (platform === 'ascenders') {
        variantClasses = 'bg-orange-500 hover:bg-orange-600 text-white';
      } else if (platform === 'neothinkers') {
        variantClasses = 'bg-amber-500 hover:bg-amber-600 text-white';
      } else if (platform === 'immortals') {
        variantClasses = 'bg-red-500 hover:bg-red-600 text-white';
      } else {
        // Hub uses gradient background
        variantClasses = 'text-white';
        buttonStyles.background = gradient;
      }
      break;
    
    case 'gradient':
      variantClasses = 'text-white';
      break;
    
    case 'secondary':
      if (platform === 'ascenders') {
        variantClasses = 'bg-white dark:bg-zinc-900 border-orange-500 border hover:bg-orange-50 dark:hover:bg-zinc-800 text-orange-700 dark:text-orange-300';
      } else if (platform === 'neothinkers') {
        variantClasses = 'bg-white dark:bg-zinc-900 border-amber-500 border hover:bg-amber-50 dark:hover:bg-zinc-800 text-amber-700 dark:text-amber-300';
      } else if (platform === 'immortals') {
        variantClasses = 'bg-white dark:bg-zinc-900 border-red-500 border hover:bg-red-50 dark:hover:bg-zinc-800 text-red-700 dark:text-red-300';
      } else {
        variantClasses = 'bg-white dark:bg-zinc-900 border border-orange-500 hover:bg-orange-50 dark:hover:bg-zinc-800 text-orange-700 dark:text-orange-300';
      }
      break;
    
    case 'ghost':
      if (platform === 'ascenders') {
        variantClasses = 'hover:bg-orange-50 dark:hover:bg-zinc-800 text-orange-700 dark:text-orange-300';
      } else if (platform === 'neothinkers') {
        variantClasses = 'hover:bg-amber-50 dark:hover:bg-zinc-800 text-amber-700 dark:text-amber-300';
      } else if (platform === 'immortals') {
        variantClasses = 'hover:bg-red-50 dark:hover:bg-zinc-800 text-red-700 dark:text-red-300';
      } else {
        variantClasses = 'hover:bg-orange-50 dark:hover:bg-zinc-800 text-orange-700 dark:text-orange-300';
      }
      break;
  }
  
  // Disabled styles
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'transition-golden'; // Use golden ratio based transition

  return (
    <button
      type={type}
      className={`sacred-button ${sizeClasses} ${variantClasses} ${disabledClasses} font-medium flex items-center justify-center gap-3 ${className}`}
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="sacred-button-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/**
 * Sacred Button Group that follows the 3, 6, 9 pattern
 */
export function SacredButtonGroup({
  platform,
  children,
  className = '',
}: {
  platform: PlatformTheme;
  children: React.ReactNode;
  className?: string;
}) {
  // Use pattern of 3 for spacing
  return (
    <div className={`sacred-button-group flex gap-3 ${className}`}>
      {children}
    </div>
  );
} 