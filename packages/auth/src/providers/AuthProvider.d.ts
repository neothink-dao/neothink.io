import React, { ReactNode } from 'react';
import { UseAuthProps } from '../hooks/useAuth';
import { User, Session } from '@supabase/supabase-js';
import { PlatformSlug } from '@neothink/database';
interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: Error | null;
    signInWithPassword: (email: string, password: string) => Promise<any>;
    signInWithOtp: (email: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
    updatePassword: (password: string) => Promise<any>;
    updateEmail: (email: string) => Promise<any>;
}
interface AuthProviderProps extends UseAuthProps {
    children: ReactNode;
}
/**
 * Auth Provider component that wraps the application and provides auth context
 */
export declare const AuthProvider: React.FC<AuthProviderProps>;
/**
 * Hook to use the auth context in components
 * @returns Auth context with state and methods
 * @throws Error if used outside of AuthProvider
 */
export declare const useAuthContext: () => AuthContextType;
/**
 * Higher-order component that wraps a component with the AuthProvider
 * @param Component Component to wrap
 * @param platformSlug Platform slug for authentication
 * @param redirectUrl Optional redirect URL
 * @returns Wrapped component with auth context
 */
export declare function withAuth<P extends object>(Component: React.ComponentType<P>, platformSlug: PlatformSlug, redirectUrl?: string): {
    (props: P): React.JSX.Element;
    displayName: string;
};
export default AuthProvider;
//# sourceMappingURL=AuthProvider.d.ts.map