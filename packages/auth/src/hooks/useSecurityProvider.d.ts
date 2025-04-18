import React, { ReactNode } from 'react';
import type { PlatformSlug } from '@neothink/database';
interface SecurityContextType {
    csrfToken: string;
    refreshCsrfToken: () => Promise<string>;
    logSecurityEvent: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}
interface SecurityProviderProps {
    platformSlug: PlatformSlug;
    children: ReactNode;
}
/**
 * Hook to use security features
 */
export declare function useSecurityProvider(): SecurityContextType;
/**
 * Security Provider Component
 *
 * Provides security context to the application
 */
export declare function SecurityProvider({ platformSlug, children }: SecurityProviderProps): React.JSX.Element;
/**
 * CSRF Token Provider
 *
 * Higher-order component to add CSRF tokens to fetch requests automatically
 */
export declare function withCsrfProtection<T extends Record<string, any>>(Component: React.ComponentType<T>): React.FC<T>;
export {};
//# sourceMappingURL=useSecurityProvider.d.ts.map