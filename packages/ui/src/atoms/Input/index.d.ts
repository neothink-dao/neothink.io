import React from 'react';
import { type VariantProps } from 'class-variance-authority';
export declare const inputVariants: (props?: ({
    inputSize?: "lg" | "sm" | "md" | null | undefined;
    state?: "error" | "default" | "success" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
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
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
//# sourceMappingURL=index.d.ts.map