import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Types for mocks
type MockFunction = jest.Mock;
type AchievementHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

// Mock user data for testing
export const mockAchievementUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'user',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

// Mock achievement data generator
export const createMockAchievement = (platform: string, index: number) => ({
  id: String(index),
  name: `Test Achievement ${index}`,
  description: 'This is a test achievement',
  points: 100 * index,
  platform,
  created_at: new Date(2023, 0, index).toISOString(),
});

// Shared mock setup for achievement tests
export const setupAchievementMocks = (platform: string) => {
  const mockSelect: MockFunction = jest.fn();
  const mockFrom: MockFunction = jest.fn(() => ({ select: mockSelect }));
  const mockEq: MockFunction = jest.fn();
  const mockOrder: MockFunction = jest.fn();
  const mockRange: MockFunction = jest.fn();

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
  (createClient as unknown as MockFunction).mockReturnValue({
    from: mockFrom,
  });

  // Set up user authentication mock
  (jest.requireMock('@neothink/hooks/api').getUser as MockFunction)
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
export const createAchievementTests = (
  platform: string,
  handler: AchievementHandler
) => {
  describe(`${platform} Achievements API`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
      setupAchievementMocks(platform);
    });

    it('returns method not allowed for non-GET requests', async () => {
      const { req, res } = createMocks({
        method: 'POST' as RequestMethod,
      });
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
    });

    it('returns achievements for authenticated users', async () => {
      const { req, res } = createMocks({
        method: 'GET' as RequestMethod,
      });
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.achievements).toHaveLength(2);
      expect(data.achievements[0].platform).toBe(platform);
    });

    // Add more shared test cases as needed
  });
}; 