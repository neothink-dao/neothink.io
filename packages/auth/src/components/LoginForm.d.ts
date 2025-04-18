import React from 'react';
import { PlatformSlug } from '@neothink/database';
export interface LoginFormProps extends React.ComponentPropsWithoutRef<'div'> {
    /**
     * Platform identifier
     */
    platformSlug: PlatformSlug;
    /**
     * Custom redirect URL
     */
    redirectUrl?: string;
    /**
     * Form title
     */
    title?: string;
    /**
     * Form description
     */
    description?: string;
    /**
     * Whether to show the forgot password link
     */
    showForgotPassword?: boolean;
    /**
     * Whether to show the sign up link
     */
    showSignUp?: boolean;
    /**
     * Custom sign up URL
     */
    signUpUrl?: string;
    /**
     * Custom forgot password URL
     */
    forgotPasswordUrl?: string;
    /**
     * Callback on successful login
     */
    onSuccess?: () => void;
    /**
     * Custom component to render as logo
     */
    logo?: React.ReactNode;
}
/**
 * Standardized login form component
 */
export declare const LoginForm: React.FC<LoginFormProps>;
export default LoginForm;
//# sourceMappingURL=LoginForm.d.ts.map