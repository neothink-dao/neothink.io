import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@supabase/supabase-js';
type AchievementHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export declare const mockAchievementUser: User;
export declare const createMockAchievement: (platform: string, index: number) => {
    id: string;
    name: string;
    description: string;
    points: number;
    platform: string;
    created_at: string;
};
export declare const setupAchievementMocks: (platform: string) => {
    mockSelect: jest.Mock;
    mockFrom: jest.Mock;
    mockEq: jest.Mock;
    mockOrder: jest.Mock;
    mockRange: jest.Mock;
};
export declare const createAchievementTests: (platform: string, handler: AchievementHandler) => void;
export {};
//# sourceMappingURL=achievements.d.ts.map