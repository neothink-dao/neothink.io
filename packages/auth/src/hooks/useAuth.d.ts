import type { PlatformSlug } from '@neothink/database';
/**
 * Auth hook properties
 */
export interface UseAuthProps {
    /**
     * Platform identifier
     */
    platformSlug: PlatformSlug;
    /**
     * Optional redirect URL after auth actions
     */
    redirectUrl?: string;
}
/**
 * Authentication hook for managing user auth state and operations
 * @param props Configuration properties
 * @returns Authentication state and methods
 */
export declare const useAuth: ({ platformSlug, redirectUrl }: UseAuthProps) => any;
export default useAuth;
//# sourceMappingURL=useAuth.d.ts.map