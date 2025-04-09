import React from 'react';
import { Platform } from '@neothink/types';
import { platformColors } from '../../theme';

export type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  platform?: Platform;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  platform = 'hub',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const colors = platformColors[platform];
  
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: `bg-${colors.primary} text-white hover:bg-opacity-90 focus:ring-${colors.primary}`,
    secondary: `bg-${colors.secondary} text-white hover:bg-opacity-90 focus:ring-${colors.secondary}`,
    outline: `border border-${colors.primary} text-${colors.primary} bg-transparent hover:bg-${colors.primary} hover:bg-opacity-10 focus:ring-${colors.primary}`,
    ghost: `text-${colors.primary} hover:bg-${colors.primary} hover:bg-opacity-10 focus:ring-${colors.primary}`,
    link: `text-${colors.primary} underline-offset-4 hover:underline focus:ring-${colors.primary} p-0 h-auto`,
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 h-8',
    md: 'text-sm px-4 h-10',
    lg: 'text-base px-6 h-12',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}; 