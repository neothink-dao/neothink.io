/**
 * Security Testing Helpers
 *
 * This file contains utilities to help test the security features of the application.
 * DO NOT include this in production builds!
 */
import { PlatformSlug } from '@neothink/database';
/**
 * Get recent security logs for testing and development
 */
export declare function getRecentSecurityLogs(platformSlug?: PlatformSlug, limit?: number): Promise<any>;
/**
 * Get rate limit records for testing
 */
export declare function getRateLimitRecords(identifier: string, platformSlug?: PlatformSlug): Promise<any>;
/**
 * Generate test security logs for development and testing
 */
export declare function generateTestSecurityLogs(count?: number, platformSlug?: PlatformSlug): Promise<void>;
/**
 * Clear test security logs (for cleanup)
 */
export declare function clearTestSecurityLogs(platformSlug?: PlatformSlug): Promise<void>;
//# sourceMappingURL=securityTestingHelpers.d.ts.map