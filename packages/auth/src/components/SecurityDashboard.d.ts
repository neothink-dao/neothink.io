import React from 'react';
interface SecurityDashboardProps {
    platformSlug: string;
    limit?: number;
}
/**
 * Security Dashboard Component
 *
 * Displays recent security events with filtering options
 * This is an admin-only component and should be protected by authentication
 */
export default function SecurityDashboard({ platformSlug, limit }: SecurityDashboardProps): React.JSX.Element;
export {};
//# sourceMappingURL=SecurityDashboard.d.ts.map