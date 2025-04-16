import { createMocks } from 'node-mocks-http';
import { createClient } from '@supabase/supabase-js';
// Mock user data for testing
export const mockAchievementUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'user',
    aud: 'authenticated',
    created_at: new Date().toISOString(),
};
// Mock achievement data generator
export const createMockAchievement = (platform, index) => ({
    id: String(index),
    name: `Test Achievement ${index}`,
    description: 'This is a test achievement',
    points: 100 * index,
    platform,
    created_at: new Date(2023, 0, index).toISOString(),
});
// Shared mock setup for achievement tests
export const setupAchievementMocks = (platform) => {
    const mockSelect = jest.fn();
    const mockFrom = jest.fn(() => ({ select: mockSelect }));
    const mockEq = jest.fn();
    const mockOrder = jest.fn();
    const mockRange = jest.fn();
    // Configure mock responses
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ range: mockRange });
    mockRange.mockResolvedValue({
        data: [
            createMockAchievement(platform, 1),
            createMockAchievement(platform, 2),
        ],
        error: null,
        count: 2,
    });
    // Set up the mock Supabase client
    createClient.mockReturnValue({
        from: mockFrom,
    });
    // Set up user authentication mock
    jest.requireMock('@neothink/hooks/api').getUser
        .mockResolvedValue({ user: mockAchievementUser, error: null });
    return {
        mockSelect,
        mockFrom,
        mockEq,
        mockOrder,
        mockRange,
    };
};
// Shared test suite for achievement handlers
export const createAchievementTests = (platform, handler) => {
    describe(`${platform} Achievements API`, () => {
        beforeEach(() => {
            jest.clearAllMocks();
            setupAchievementMocks(platform);
        });
        it('returns method not allowed for non-GET requests', async () => {
            const { req, res } = createMocks({
                method: 'POST',
            });
            await handler(req, res);
            expect(res._getStatusCode()).toBe(405);
            expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
        });
        it('returns achievements for authenticated users', async () => {
            const { req, res } = createMocks({
                method: 'GET',
            });
            await handler(req, res);
            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.achievements).toHaveLength(2);
            expect(data.achievements[0].platform).toBe(platform);
        });
        // Add more shared test cases as needed
    });
};
//# sourceMappingURL=achievements.js.map