import React from 'react';
import { PlatformSlug } from '@neothink/platform-bridge';
interface PlatformSwitchLoaderProps {
    isLoading: boolean;
    fromPlatform: PlatformSlug | null;
    toPlatform: PlatformSlug | null;
    error?: {
        message: string;
        code: string;
    } | null;
}
export declare function PlatformSwitchLoader({ isLoading, fromPlatform, toPlatform, error }: PlatformSwitchLoaderProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=PlatformSwitchLoader.d.ts.map