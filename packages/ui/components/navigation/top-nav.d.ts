import { type Platform } from '@neothink/types';
import { type User } from '@supabase/supabase-js';
interface TopNavProps {
    platform: Platform;
    user: User | null;
    platformName: string;
    platformColor: string;
}
export declare function TopNav({ platform, user, platformName, platformColor, }: TopNavProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=top-nav.d.ts.map