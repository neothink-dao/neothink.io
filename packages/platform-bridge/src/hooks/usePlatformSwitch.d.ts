import { PlatformSlug, SwitchError } from '../types';
interface UsePlatformSwitchReturn {
    switchPlatform: (targetPlatform: PlatformSlug) => Promise<void>;
    isLoading: boolean;
    error: SwitchError | null;
    currentPlatform: PlatformSlug | null;
    switchingFrom: PlatformSlug | null;
    switchingTo: PlatformSlug | null;
}
export declare function usePlatformSwitch(): UsePlatformSwitchReturn;
export {};
//# sourceMappingURL=usePlatformSwitch.d.ts.map