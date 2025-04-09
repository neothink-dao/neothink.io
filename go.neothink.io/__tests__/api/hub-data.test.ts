import { NextRequest } from 'next/server';
import { GET } from '../../app/api/hub-data/route';
import { getAuthenticatedSupabase } from '@neothink/core';
import { analytics } from '@neothink/analytics';

// Mock the core and analytics modules
jest.mock('@neothink/core', () => ({
  getAuthenticatedSupabase: jest.fn(),
}));

jest.mock('@neothink/analytics', () => ({
  analytics: {
    track: jest.fn().mockResolvedValue({}),
  },
}));

/**
 * Tests for the hub-data API route
 * 
 * @see DEVELOPMENT.md - Testing API routes
 */
describe('GET /api/hub-data', () => {
  // Mock Supabase response
  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockImplementation(() => ({
      data: [],
      error: null,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (getAuthenticatedSupabase as jest.Mock).mockReturnValue(mockSupabaseClient);
    
    // Setup content query mock
    mockSupabaseClient.limit.mockImplementation(function(this: any) {
      if (this._table === 'content') {
        return {
          data: [
            { id: '1', title: 'Test Content', platform: 'hub' },
          ],
          error: null,
        };
      } else if (this._table === 'progress') {
        return {
          data: [
            { id: '1', content_id: '1', progress: 50 },
          ],
          error: null,
        };
      }
      return { data: [], error: null };
    });
    
    // Track which table was queried
    mockSupabaseClient.from.mockImplementation((table) => {
      mockSupabaseClient._table = table;
      return mockSupabaseClient;
    });
  });

  it('returns 401 if no authorization header is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/hub-data', {
      method: 'GET',
      headers: new Headers(),
    });
    
    const response = await GET(request);
    expect(response.status).toBe(401);
    
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 if token format is invalid', async () => {
    const request = new NextRequest('http://localhost:3000/api/hub-data', {
      method: 'GET',
      headers: new Headers({
        authorization: 'InvalidFormat',
      }),
    });
    
    const response = await GET(request);
    expect(response.status).toBe(401);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid token format');
  });

  it('fetches content and progress data with a valid token', async () => {
    const request = new NextRequest('http://localhost:3000/api/hub-data', {
      method: 'GET',
      headers: new Headers({
        authorization: 'Bearer valid-token',
      }),
    });
    
    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.content).toEqual([{ id: '1', title: 'Test Content', platform: 'hub' }]);
    expect(data.progress).toEqual([{ id: '1', content_id: '1', progress: 50 }]);
    
    // Verify Supabase client was called with correct parameters
    expect(getAuthenticatedSupabase).toHaveBeenCalledWith('valid-token');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('content');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('platform', 'hub');
    
    // Verify analytics was tracked
    expect(analytics.track).toHaveBeenCalledWith('api_call', {
      platform: 'hub',
      endpoint: 'hub-data',
      method: 'GET',
    });
  });

  it('handles Supabase errors correctly', async () => {
    // Override the mock to simulate an error
    mockSupabaseClient.limit.mockImplementation(function(this: any) {
      if (this._table === 'content') {
        return {
          data: null,
          error: { message: 'Database error' },
        };
      }
      return { data: [], error: null };
    });
    
    const request = new NextRequest('http://localhost:3000/api/hub-data', {
      method: 'GET',
      headers: new Headers({
        authorization: 'Bearer valid-token',
      }),
    });
    
    const response = await GET(request);
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch data');
  });
}); 