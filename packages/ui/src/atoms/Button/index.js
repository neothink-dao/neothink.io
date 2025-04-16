'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
// Define button variants with class-variance-authority
export const buttonVariants = cva(
// Base styles applied to all buttons
'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none', {
    variants: {
        // Visual variants
        variant: {
            // Primary solid buttons
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            // Secondary/outline buttons
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            // Outline buttons
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            // Ghost buttons
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            // Link buttons
            link: 'text-primary underline-offset-4 hover:underline',
            // Destructive buttons
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            // Success buttons
            success: 'bg-green-600 text-white hover:bg-green-700',
            // Platform-specific variants
            ascenders: 'bg-amber-500 text-white hover:bg-amber-600',
            immortals: 'bg-blue-600 text-white hover:bg-blue-700',
            neothinkers: 'bg-emerald-600 text-white hover:bg-emerald-700',
        },
        // Size variants
        size: {
            xs: 'h-7 px-2 text-xs',
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-6 text-base',
            xl: 'h-14 px-8 text-lg',
            '2xl': 'h-16 px-10 text-xl',
            icon: 'h-9 w-9',
        },
        // Width variants
        width: {
            auto: 'w-auto',
            full: 'w-full',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
        width: 'auto',
    },
});
/**
 * Primary UI component for user interaction
 */
export const Button = forwardRef((_a, ref) => {
    var { className, variant, size, width, isLoading, leftIcon, rightIcon, children } = _a, props = __rest(_a, ["className", "variant", "size", "width", "isLoading", "leftIcon", "rightIcon", "children"]);
    return (<button className={cn(buttonVariants({ variant, size, width }), className)} ref={ref} disabled={isLoading || props.disabled} {...props}>
        {isLoading && (<svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>)}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>);
});
Button.displayName = 'Button';
export default Button;
//# sourceMappingURL=index.js.map