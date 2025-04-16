'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
// Create the context with a default value
const AuthContext = createContext(undefined);
/**
 * Auth Provider component that wraps the application and provides auth context
 */
export const AuthProvider = ({ children, platformSlug, redirectUrl, }) => {
    // Use the auth hook to get auth state and methods
    const auth = useAuth({ platformSlug, redirectUrl });
    // Memoize the context value to prevent unnecessary rerenders
    const contextValue = useMemo(() => auth, [auth]);
    return (<AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>);
};
/**
 * Hook to use the auth context in components
 * @returns Auth context with state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
/**
 * Higher-order component that wraps a component with the AuthProvider
 * @param Component Component to wrap
 * @param platformSlug Platform slug for authentication
 * @param redirectUrl Optional redirect URL
 * @returns Wrapped component with auth context
 */
export function withAuth(Component, platformSlug, redirectUrl) {
    const WithAuthComponent = (props) => (<AuthProvider platformSlug={platformSlug} redirectUrl={redirectUrl}>
      <Component {...props}/>
    </AuthProvider>);
    // Set display name for better debugging
    WithAuthComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;
    return WithAuthComponent;
}
export default AuthProvider;
//# sourceMappingURL=AuthProvider.js.map