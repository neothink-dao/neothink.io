// DEPRECATED: Use PlatformSlug from @neothink/database instead
// export type PlatformSlug = 'hub' | 'ascenders' | 'immortals' | 'neothinkers';
import type { PlatformSlug } from '@neothink/database';
export interface UseProtectedRouteProps {
    /**
     * Platform identifier
     */
    platformSlug: PlatformSlug;
    /**
     * Route to redirect to when not authenticated (default: /auth/login)
     */
    redirectTo?: string;
    /**
     * Route to redirect to when authenticated (for auth pages)
     * If provided, this will redirect authenticated users away from this page
     */
    authenticatedRedirectTo?: string;
    /**
     * Whether to check for platform access (default: true)
     */
    checkPlatformAccess?: boolean;
}
/**
 * Hook to protect routes from unauthenticated users
 * @param props Configuration properties
 * @returns Authentication state to help with conditional rendering
 */
export declare const useProtectedRoute: ({ platformSlug, redirectTo, authenticatedRedirectTo, checkPlatformAccess, }: UseProtectedRouteProps) => {
    isLoading: any;
    isAuthenticated: any;
    user: any;
};
export default useProtectedRoute;
//# sourceMappingURL=useProtectedRoute.d.ts.map