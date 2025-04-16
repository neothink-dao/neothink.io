import React from 'react';
type PlatformType = 'hub' | 'ascenders' | 'immortals' | 'neothinkers' | 'all';
interface PlatformStatusProps {
    platform?: PlatformType;
    showDetails?: boolean;
    className?: string;
}
/**
 * Component to display platform status information
 * Used to show users if there are any ongoing issues with the platform
 */
export declare function PlatformStatus({ platform, showDetails, className }: PlatformStatusProps): React.JSX.Element;
export default PlatformStatus;
//# sourceMappingURL=PlatformStatus.d.ts.map