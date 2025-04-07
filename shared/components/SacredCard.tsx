import React from 'react';
import { PlatformTheme } from '../styles/tokens/colors';
import { getPlatformBorderRadius, getGradient, getPlatformCSSVariables } from '../styles/theme-utils';
import { spacing } from '../styles/tokens/spacing';
import { PHI } from '../styles/sacred-geometry';

interface SacredCardProps {
  /**
   * The platform this card belongs to
   */
  platform: PlatformTheme;
  
  /**
   * Card title
   */
  title: string;
  
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Optional image URL
   */
  imageUrl?: string;
  
  /**
   * Card variant
   * - primary: Accent color background with light text
   * - secondary: Light background with accent colored border
   * - gradient: Platform-specific gradient background
   */
  variant?: 'primary' | 'secondary' | 'gradient';
  
  /**
   * Optional className to extend styling
   */
  className?: string;
}

/**
 * SacredCard component based on sacred geometry principles
 * - Uses golden ratio (φ) for aspect ratio and padding
 * - Implements platform-specific styling 
 * - Border radius follows sacred geometry patterns
 */
export function SacredCard({
  platform,
  title,
  children,
  imageUrl,
  variant = 'secondary',
  className = '',
}: SacredCardProps) {
  // Get platform-specific styling
  const borderRadius = getPlatformBorderRadius(platform);
  const gradient = getGradient(platform);
  const cssVars = getPlatformCSSVariables(platform);
  
  // Define card styles based on platform and variant
  const cardStyles: React.CSSProperties = {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    // Apply platform-specific css variables
    ...cssVars,
  };
  
  // Handling different variants
  let variantClasses = '';
  
  switch (variant) {
    case 'primary':
      if (platform === 'ascenders') {
        variantClasses = 'bg-orange-500 text-white border-orange-600 border';
      } else if (platform === 'neothinkers') {
        variantClasses = 'bg-amber-500 text-white border-amber-600 border';
      } else if (platform === 'immortals') {
        variantClasses = 'bg-red-500 text-white border-red-600 border';
      } else {
        // Hub uses gradient background
        variantClasses = 'text-white border border-orange-600';
        cardStyles.background = gradient;
      }
      break;
    
    case 'gradient':
      variantClasses = 'text-white';
      cardStyles.background = gradient;
      break;
    
    case 'secondary':
    default:
      if (platform === 'ascenders') {
        variantClasses = 'bg-white dark:bg-zinc-900 border-orange-500 border';
      } else if (platform === 'neothinkers') {
        variantClasses = 'bg-white dark:bg-zinc-900 border-amber-500 border';
      } else if (platform === 'immortals') {
        variantClasses = 'bg-white dark:bg-zinc-900 border-red-500 border';
      } else {
        variantClasses = 'bg-white dark:bg-zinc-900 border border-orange-500';
      }
      break;
  }
  
  // Image aspect ratio uses golden ratio
  const imageContainerStyle: React.CSSProperties = {
    aspectRatio: String(PHI),
    overflow: 'hidden',
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  };
  
  return (
    <div 
      className={`sacred-card ${variantClasses} ${className}`}
      style={cardStyles}
    >
      {imageUrl && (
        <div style={imageContainerStyle} className="mb-3">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      <h3 className={`text-xl font-semibold mb-${platform === 'neothinkers' ? '3' : platform === 'immortals' ? '9' : '6'}`}>
        {title}
      </h3>
      
      <div className="sacred-card-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Sacred Card Grid that follows the 3×3 grid pattern
 */
export function SacredCardGrid({
  platform,
  children,
  className = '',
}: {
  platform: PlatformTheme;
  children: React.ReactNode;
  className?: string;
}) {
  // Use 3×3 grid for sacred geometry
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-${platform === 'immortals' ? '9' : '6'} ${className}`}>
      {children}
    </div>
  );
} 