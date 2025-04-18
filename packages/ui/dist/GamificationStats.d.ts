import React from 'react';
export type GamificationStatsData = {
    points: number | null | undefined;
    role: string | null | undefined;
    streak: number | null | undefined;
    lastActive?: string | null | undefined;
};
interface GamificationStatsProps {
    stats: GamificationStatsData | null;
    isLoading?: boolean;
    error?: string | null;
}
export declare const GamificationStats: React.FC<GamificationStatsProps>;
export {};
//# sourceMappingURL=GamificationStats.d.ts.map