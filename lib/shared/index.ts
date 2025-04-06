/**
 * Shared Components and Utilities
 * 
 * This library contains reusable components and utilities that are
 * shared across all NeoThink platforms. By centralizing these components,
 * we ensure consistent behavior and reduce code duplication.
 * 
 * To use in any platform, import directly from this library:
 * import { useTenant, PlatformSwitcher } from '../lib/shared';
 */

// Authentication
export { default as CrossPlatformAuth } from '../components/auth/CrossPlatformAuth';
export { default as PermissionGate, withPermission } from '../components/auth/PermissionGate';

// Navigation
export { default as PlatformSwitcher } from '../components/navigation/PlatformSwitcher';

// Layouts
export { default as PlatformLayout } from '../layouts/PlatformLayout';

// Theming
export { 
  ThemeProvider,
  useTheme,
  applyThemeColor,
  type ThemeColors 
} from '../theme/ThemeProvider';

// Hooks
export { useTenant } from '../context/TenantContext';
export { usePermissions } from '../hooks/usePermissions';
export { useTenantQuery } from '../hooks/useTenantQuery';
export { useAnalytics } from '../hooks/useAnalytics';
export { useNotifications } from '../hooks/useNotifications';
export { useSharedContent } from '../hooks/useSharedContent';

// Content Utilities
export {
  getSharedContentForTenant,
  getSharedContentBySlug,
  getSharedContentById,
  createSharedContent,
  updateSharedContent,
  shareContentWithTenant,
  removeSharedContentFromTenant,
  createContentCategory,
  getContentCategoriesForTenant,
  updateContentCategory,
  deleteContentCategory,
  type ContentType,
  type ContentStatus,
  type SharedContent,
  type TenantContent,
  type ContentCategory
} from '../utils/shared-content';

// Tenant Utilities
export { 
  getTenantBySlug,
  getUserAccessibleTenants,
  addUserToTenant,
  removeUserFromTenant,
  createTenant,
  getTenantAnalytics,
  checkUserTenantAccess,
  type TenantDetails,
  type UserTenant
} from '../utils/tenant-utils';

// Analytics Utilities
export {
  trackEvent,
  getPlatformAnalytics,
  getTenantAnalytics as getAnalyticsForTenant,
  getUserAnalytics,
  getActiveUserCount,
  type AnalyticsEvent
} from '../utils/analytics-service';

// Notification Utilities
export {
  createNotification,
  getUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
  type Notification,
  type NotificationType,
  type NotificationTarget
} from '../utils/notification-service'; 