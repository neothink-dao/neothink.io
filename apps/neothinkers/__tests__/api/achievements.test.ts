import { createMocks } from 'node-mocks-http';
import { createClient } from '@neothink/core';
import { analytics } from '@neothink/analytics';
import { getUser } from '@neothink/hooks/api';
import achievementsHandler from '../../pages/api/achievements';

// Mock the @neothink/core createClient function
jest.mock('@neothink/core', () => ({
  createClient: jest.fn(),
}));

// Mock the @neothink/analytics module
jest.mock('@neothink/analytics', () => ({
  analytics: {
    track: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock the @neothink/hooks/api module
jest.mock('@neothink/hooks/api', () => ({
  getUser: jest.fn(),
}));

describe('Achievements API', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'user',
  };
  
  // Mock Supabase client
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect }));
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockRange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up user authentication mock
    (getUser as jest.Mock).mockResolvedValue({ user: mockUser, error: null });
    
    // Configure the mocked Supabase client
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ range: mockRange });
    mockRange.mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Test Achievement 1',
          description: 'This is a test achievement',
          points: 100,
          platform: 'neothinkers',
          created_at: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Test Achievement 2',
          description: 'This is another test achievement',
          points: 200,
          platform: 'neothinkers',
          created_at: '2023-01-02T00:00:00.000Z',
        },
      ],
      error: null,
      count: 2,
    });
    
    // Set up the mock Supabase client
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
  });

  it('returns method not allowed for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });
    
    await achievementsHandler(req, res);
    
    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('returns unauthorized when user authentication fails', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce({ user: null, error: 'Unauthorized' });
    
    const { req, res } = createMocks({
      method: 'GET',
    });
    
    await achievementsHandler(req, res);
    
    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Unauthorized' });
  });

  it('returns achievements with default pagination', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    
    await achievementsHandler(req, res);
    
    // Verify Supabase client was called correctly
    expect(mockFrom).toHaveBeenCalledWith('achievements');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('platform', 'neothinkers');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockRange).toHaveBeenCalledWith(0, 9);
    
    // Verify response
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data).toHaveLength(2);
    expect(data.pagination).toEqual({
      limit: 10,
      offset: 0,
      total: 2,
    });
    
    // Verify analytics was called
    expect(analytics.track).toHaveBeenCalledWith('api_achievements_fetched', expect.objectContaining({
      platform: 'neothinkers',
      user_id: mockUser.id,
      limit: 10,
      offset: 0,
      count: 2,
    }));
  });

  it('applies custom pagination parameters', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        limit: '5',
        offset: '10',
        sort: 'name',
        order: 'asc',
      },
    });
    
    await achievementsHandler(req, res);
    
    // Verify Supabase client was called with custom parameters
    expect(mockOrder).toHaveBeenCalledWith('name', { ascending: true });
    expect(mockRange).toHaveBeenCalledWith(10, 14);
    
    // Verify response pagination
    const data = JSON.parse(res._getData());
    expect(data.pagination).toEqual({
      limit: 5,
      offset: 10,
      total: 2,
    });
  });

  it('handles database errors properly', async () => {
    // Set up error case
    mockRange.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
      count: 0,
    });
    
    const { req, res } = createMocks({
      method: 'GET',
    });
    
    await achievementsHandler(req, res);
    
    // Verify error response
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to fetch achievements',
      message: 'Database error',
    });
    
    // Verify error is tracked
    expect(analytics.track).toHaveBeenCalledWith('api_error', expect.objectContaining({
      platform: 'neothinkers',
      endpoint: '/api/achievements',
    }));
  });

  it('handles unexpected errors properly', async () => {
    // Set up unexpected error
    mockRange.mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });
    
    const { req, res } = createMocks({
      method: 'GET',
    });
    
    await achievementsHandler(req, res);
    
    // Verify error response
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to fetch achievements',
      message: 'Unexpected error',
    });
  });
}); 