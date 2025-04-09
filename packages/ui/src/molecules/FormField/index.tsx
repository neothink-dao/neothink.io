'use client';

import React, { forwardRef } from 'react';
import { Input, type InputProps } from '../../atoms/Input';
import { cn } from '../../utils/cn';

export interface FormFieldProps extends Omit<InputProps, 'error' | 'success'> {
  /**
   * Label for the form field
   */
  label?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Success message
   */
  success?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Whether to hide the label
   */
  hideLabel?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    helperText, 
    error, 
    success, 
    required, 
    disabled, 
    hideLabel, 
    className, 
    id, 
    ...props 
  }, ref) => {
    // Generate an ID if one isn't provided
    const fieldId = id || `field-${Math.random().toString(36).substring(2, 9)}`;
    
    // Determine if we're showing an error or success state
    const showError = !!error;
    const showSuccess = !showError && !!success;
    
    // Determine the label text (include required indicator if needed)
    const labelText = required ? `${label} *` : label;
    
    return (
      <div className={cn('space-y-2', className)}>
        {label && !hideLabel && (
          <label 
            htmlFor={fieldId} 
            className={cn(
              'text-sm font-medium',
              disabled && 'opacity-70',
              showError && 'text-destructive',
              showSuccess && 'text-green-600'
            )}
          >
            {labelText}
          </label>
        )}
        
        <Input
          id={fieldId}
          ref={ref}
          state={showError ? 'error' : showSuccess ? 'success' : 'default'}
          error={error}
          success={success}
          disabled={disabled}
          aria-describedby={
            helperText || showError || showSuccess
              ? `${fieldId}-description`
              : undefined
          }
          required={required}
          {...props}
        />
        
        {helperText && !showError && !showSuccess && (
          <p 
            id={`${fieldId}-description`} 
            className="text-xs text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField; 