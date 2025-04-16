import React from 'react';
import { type InputProps } from '../../atoms/Input';
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
export declare const FormField: React.ForwardRefExoticComponent<FormFieldProps & React.RefAttributes<HTMLInputElement>>;
export default FormField;
//# sourceMappingURL=index.d.ts.map