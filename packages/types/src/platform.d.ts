export type Platform = 'ascenders' | 'neothinkers' | 'immortals' | 'hub';
export interface PlatformConfig {
    name: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    gradientFrom: string;
    gradientTo: string;
    features: string[];
}
export declare const platformConfigs: Record<Platform, PlatformConfig>;
//# sourceMappingURL=platform.d.ts.map