import React from 'react';
import { type VariantProps } from 'class-variance-authority';
export declare const buttonVariants: (props?: ({
    variant?: "ascenders" | "neothinkers" | "immortals" | "link" | "success" | "outline" | "secondary" | "ghost" | "destructive" | "primary" | null | undefined;
    size?: "lg" | "sm" | "icon" | "xs" | "md" | "xl" | "2xl" | null | undefined;
    width?: "auto" | "full" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    /**
     * Is the button in a loading state?
     */
    isLoading?: boolean;
    /**
     * Left icon
     */
    leftIcon?: React.ReactNode;
    /**
     * Right icon
     */
    rightIcon?: React.ReactNode;
}
/**
 * Primary UI component for user interaction
 */
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default Button;
//# sourceMappingURL=index.d.ts.map