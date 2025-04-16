'use client';

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// Define input variants with class-variance-authority
export const inputVariants = cva(
  // Base styles applied to all inputs
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      // Size variants
      inputSize: {
        sm: 'h-8 py-1 px-3 text-xs',
        md: 'h-10 py-2 px-4 text-sm',
        lg: 'h-12 py-3 px-4 text-base',
      },
      // Validation state variants
      state: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
    },
    defaultVariants: {
      inputSize: 'md',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Left element (icon, etc.)
   */
  leftElement?: React.ReactNode;
  /**
   * Right element (icon, etc.)
   */
  rightElement?: React.ReactNode;
  /**
   * Error message (also sets state to error)
   */
  error?: string;
  /**
   * Success message (also sets state to success)
   */
  success?: string;
}

/**
 * Input component for form elements
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, size, state, leftElement, rightElement, error, success, ...props }, ref) => {
    // Determine state based on error/success props
    const validationState = error ? 'error' : success ? 'success' : state;
    
    // Map size prop to inputSize for variants
    const sizeToUse = inputSize || (size as 'sm' | 'md' | 'lg' | undefined);

    return (
      <div className="w-full">
        <div className="relative">
          {leftElement && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ inputSize: sizeToUse, state: validationState }),
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        {!error && success && <p className="mt-1 text-xs text-green-600">{success}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 