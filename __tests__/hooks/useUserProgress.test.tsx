import { renderHook, act } from '@testing-library/react-hooks';
import { useUserProgress } from '@neothink/hooks';
import { createClient } from '@neothink/core';

// Mock the Supabase client and auth helpers
jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockUserProgress, error: null }))
          }))
        }))
      })),
      rpc: jest.fn((fnName, params) => {
        if (fnName === 'update_user_progress') {
          return Promise.resolve({ data: true, error: null });
        }
        if (fnName === 'advance_user_week') {
          return Promise.resolve({ data: true, error: null });
        }
        return Promise.resolve({ data: null, error: new Error('Unknown function') });
      })
    })),
  })),
  useUser: jest.fn(() => mockUser)
}));

// Mock createClient
jest.mock('@neothink/core', () => ({
  createClient: jest.fn(() => ({}))
}));

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com'
};

// Mock user progress data
const mockUserProgress = {
  id: 'progress-123',
  user_id: 'user-123',
  platform: 'hub',
  week_number: 1,
  unlocked_features: {
    discover: true,
    onboard: false
  },
  last_updated: new Date().toISOString()
};

describe('useUserProgress hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct feature status for Hub platform', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserProgress('hub'));
    
    // Wait for the hook to fetch data
    await waitForNextUpdate();
    
    // Test feature statuses for Hub platform
    expect(result.current.checkFeatureStatus('discover')).toBe('unlocked');
    expect(result.current.checkFeatureStatus('onboard')).toBe('locked');
    expect(result.current.checkFeatureStatus('progress')).toBe('hidden');
    expect(result.current.checkFeatureStatus('endgame')).toBe('hidden');
  });

  it('should return the correct feature status for Neothinkers platform', async () => {
    // Update mock data for neothinkers test
    const neothinkersProgress = {
      ...mockUserProgress,
      platform: 'neothinkers'
    };
    
    // Update the mock response
    jest.mocked(useSupabaseClient)().from().select().eq().eq().single.mockResolvedValueOnce({
      data: neothinkersProgress,
      error: null
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useUserProgress('neothinkers'));
    
    // Wait for the hook to fetch data
    await waitForNextUpdate();
    
    // Test feature statuses for Neothinkers platform
    expect(result.current.checkFeatureStatus('revolution')).toBe('unlocked');
    expect(result.current.checkFeatureStatus('fellowship')).toBe('locked');
    expect(result.current.checkFeatureStatus('curriculum')).toBe('locked');
  });

  it('should handle feature unlocking correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserProgress('hub'));
    
    // Wait for the hook to fetch data
    await waitForNextUpdate();
    
    // Attempt to unlock a feature
    await act(async () => {
      const success = await result.current.unlockFeature('onboard');
      expect(success).toBe(true);
    });
    
    // The RPC function should have been called with the right parameters
    expect(jest.mocked(useSupabaseClient)().rpc).toHaveBeenCalledWith(
      'update_user_progress',
      {
        p_user_id: mockUser.id,
        p_platform: 'hub',
        p_feature: 'onboard',
        p_unlock: true
      }
    );
  });

  it('should handle week advancement correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserProgress('hub'));
    
    // Wait for the hook to fetch data
    await waitForNextUpdate();
    
    // Attempt to advance week
    await act(async () => {
      const success = await result.current.advanceWeek();
      expect(success).toBe(true);
    });
    
    // The RPC function should have been called with the right parameters
    expect(jest.mocked(useSupabaseClient)().rpc).toHaveBeenCalledWith(
      'advance_user_week',
      {
        p_user_id: mockUser.id,
        p_platform: 'hub'
      }
    );
  });

  it('should return correct week number', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserProgress('hub'));
    
    // Wait for the hook to fetch data
    await waitForNextUpdate();
    
    // Check week number
    expect(result.current.weekNumber).toBe(mockUserProgress.week_number);
  });

  it('should handle error states gracefully', async () => {
    // Mock an error response
    jest.mocked(useSupabaseClient)().from().select().eq().eq().single.mockResolvedValueOnce({
      data: null,
      error: new Error('Database error')
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useUserProgress('hub'));
    
    // Wait for the hook to fetch data
    await waitForNextUpdate();
    
    // Should have an error state
    expect(result.current.error).not.toBeNull();
    expect(result.current.userProgress).toBeNull();
    
    // Default feature status should be 'hidden' when there's an error
    expect(result.current.checkFeatureStatus('discover')).toBe('hidden');
  });
}); 