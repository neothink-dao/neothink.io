import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
/**
 * Hook to protect routes from unauthenticated users
 * @param props Configuration properties
 * @returns Authentication state to help with conditional rendering
 */
export const useProtectedRoute = ({ platformSlug, redirectTo = '/auth/login', authenticatedRedirectTo, checkPlatformAccess = true, }) => {
    const router = useRouter();
    const { isLoading, isAuthenticated, user } = useAuth({ platformSlug });
    useEffect(() => {
        const handleRouteAccess = async () => {
            // Wait for auth state to be determined
            if (isLoading)
                return;
            // If this is a page that authenticated users shouldn't see 
            // (like login or signup), redirect them away
            if (isAuthenticated && authenticatedRedirectTo) {
                router.push(authenticatedRedirectTo);
                return;
            }
            // If the user is not authenticated, redirect to login
            if (!isAuthenticated) {
                const loginUrl = new URL(redirectTo, window.location.origin);
                // Add current URL as returnUrl param
                loginUrl.searchParams.set('returnUrl', window.location.pathname);
                router.push(loginUrl.toString());
                return;
            }
            // If we need to check platform access
            if (checkPlatformAccess && user) {
                // Check if user has platform access
                const hasPlatformAccess = await checkUserPlatformAccess(user.id, platformSlug);
                // If the user doesn't have access to this platform, redirect to access denied
                if (!hasPlatformAccess) {
                    router.push('/access-denied');
                    return;
                }
            }
        };
        handleRouteAccess();
    }, [
        isLoading,
        isAuthenticated,
        user,
        router,
        platformSlug,
        redirectTo,
        authenticatedRedirectTo,
        checkPlatformAccess,
    ]);
    return {
        isLoading,
        isAuthenticated,
        user,
    };
};
/**
 * Check if a user has access to a specific platform
 * @param userId User ID to check
 * @param platformSlug Platform to check access for
 * @returns Boolean indicating whether user has access
 */
async function checkUserPlatformAccess(userId, platformSlug) {
    // We'll assume everyone has access to the hub
    if (platformSlug === 'hub')
        return true;
    try {
        // In a real implementation, this would check the database
        // For now, we'll use local storage to mock platform access
        const platforms = localStorage.getItem(`user-${userId}-platforms`);
        if (platforms) {
            const parsedPlatforms = JSON.parse(platforms);
            return parsedPlatforms.includes(platformSlug);
        }
        // Implement your actual platform access check here using Supabase
        // Example:
        // const { data } = await supabase.rpc('user_has_platform_access', {
        //   _user_id: userId,
        //   _platform_slug: platformSlug
        // });
        // return !!data;
        // Default to true in development 
        return process.env.NODE_ENV !== 'production';
    }
    catch (error) {
        console.error('Error checking platform access:', error);
        return false;
    }
}
export default useProtectedRoute;
//# sourceMappingURL=useProtectedRoute.js.map