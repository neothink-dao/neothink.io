import { PlatformAccess, PlatformSlug, PlatformState, SwitchError } from '../types';
export declare class PlatformSwitchService {
    private client;
    private userId;
    constructor(supabaseUrl: string, supabaseKey: string);
    initialize(userId: string): Promise<void>;
    checkAccess(platformSlug: PlatformSlug): Promise<boolean>;
    preserveState(platformSlug: PlatformSlug, customState?: Partial<PlatformState>): Promise<boolean>;
    restoreState(platformSlug: PlatformSlug): Promise<PlatformState | null>;
    switchPlatform(targetPlatform: PlatformSlug, preserveCurrentState?: boolean, currentPlatform?: PlatformSlug): Promise<{
        success: boolean;
        error?: SwitchError;
        state?: PlatformState;
    }>;
    getPlatformAccess(): Promise<PlatformAccess[]>;
}
//# sourceMappingURL=PlatformSwitchService.d.ts.map