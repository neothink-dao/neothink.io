import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '../app/api/hub-data/route';
import { supabase, getAuthenticatedSupabase } from '@neothink/core/database/client';
import { analytics } from '@neothink/analytics';

// Mock the imports
jest.mock('@neothink/core/database/client', () => ({
  supabase: {
    from: jest.fn(),
  },
  getAuthenticatedSupabase: jest.fn(),
}));

jest.mock('@neothink/analytics', () => ({
  analytics: {
    track: jest.fn(),
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('Hub Data API', () => {
  let mockRequest: Partial<NextRequest>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mocks
    mockRequest = {
      headers: {
        get: jest.fn().mockImplementation((header) => {
          if (header === 'authorization') return 'Bearer test-token';
          return null;
        }),
      },
      json: jest.fn().mockResolvedValue({
        title: 'Test Content',
        content: 'Test content description',
        route: '/test',
      }),
    };
    
    (NextResponse.json as jest.Mock).mockImplementation((data) => ({ data }));
    
    // Mock authenticated client
    const mockAuthClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: [{ id: '1', title: 'Test' }],
              error: null,
            }),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: '1', title: 'Test Content' },
              error: null,
            }),
          }),
        }),
      }),
    };
    
    (getAuthenticatedSupabase as jest.Mock).mockReturnValue(mockAuthClient);
    
    // Mock analytics
    (analytics.track as jest.Mock).mockResolvedValue(undefined);
  });
  
  describe('GET', () => {
    it('returns 401 if authorization header is missing', async () => {
      // Create a request without authorization header
      const request = {
        ...mockRequest,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest;
      
      await GET(request);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    });
    
    it('returns 401 if token format is invalid', async () => {
      // Create a request with invalid token format
      const request = {
        ...mockRequest,
        headers: {
          get: jest.fn().mockReturnValue('InvalidFormat'),
        },
      } as unknown as NextRequest;
      
      await GET(request);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    });
    
    it('fetches content and progress data successfully', async () => {
      const mockContentData = [
        { id: '1', title: 'Content 1' },
        { id: '2', title: 'Content 2' },
      ];
      
      const mockProgressData = [
        { id: '1', status: 'completed' },
        { id: '2', status: 'in-progress' },
      ];
      
      // Mock the auth client with content data
      const mockAuthClient = {
        from: jest.fn().mockImplementation((table) => {
          if (table === 'content') {
            return {
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  limit: jest.fn().mockResolvedValue({
                    data: mockContentData,
                    error: null,
                  }),
                }),
              }),
            };
          } else if (table === 'progress') {
            return {
              select: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue({
                  data: mockProgressData,
                  error: null,
                }),
              }),
            };
          }
          return {
            select: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          };
        }),
      };
      
      (getAuthenticatedSupabase as jest.Mock).mockReturnValue(mockAuthClient);
      
      await GET(mockRequest as NextRequest);
      
      // Verify analytics was tracked
      expect(analytics.track).toHaveBeenCalledWith('api_call', {
        platform: 'hub',
        endpoint: 'hub-data',
        method: 'GET',
      });
      
      // Verify response contains the expected data
      expect(NextResponse.json).toHaveBeenCalledWith({
        content: mockContentData,
        progress: mockProgressData,
        features: {
          readReplicaRouting: true,
          dedicatedPooler: true,
        },
      });
    });
    
    it('handles errors when fetching data', async () => {
      // Mock the auth client with an error
      const mockAuthClient = {
        from: jest.fn().mockImplementation(() => ({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: null,
                error: new Error('Database error'),
              }),
            }),
          }),
        })),
      };
      
      (getAuthenticatedSupabase as jest.Mock).mockReturnValue(mockAuthClient);
      
      await GET(mockRequest as NextRequest);
      
      // Verify response contains the error
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    });
  });
  
  describe('POST', () => {
    it('returns 401 if authorization header is missing', async () => {
      // Create a request without authorization header
      const request = {
        ...mockRequest,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest;
      
      await POST(request);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    });
    
    it('returns 400 if required fields are missing', async () => {
      // Mock request with missing fields
      const request = {
        ...mockRequest,
        json: jest.fn().mockResolvedValue({
          // Missing title and content
          route: '/test',
        }),
      } as unknown as NextRequest;
      
      await POST(request);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    });
    
    it('creates content successfully', async () => {
      const newContent = {
        id: 'new-content-id',
        title: 'New Content',
        content: 'New content description',
        route: '/new',
        platform: 'hub',
      };
      
      // Mock the auth client for content creation
      const mockAuthClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: newContent,
                error: null,
              }),
            }),
          }),
        }),
      };
      
      (getAuthenticatedSupabase as jest.Mock).mockReturnValue(mockAuthClient);
      
      await POST(mockRequest as NextRequest);
      
      // Verify analytics was tracked
      expect(analytics.track).toHaveBeenCalledWith('content_created', {
        platform: 'hub',
        content_id: newContent.id,
        content_title: newContent.title,
      });
      
      // Verify response contains the success message
      expect(NextResponse.json).toHaveBeenCalledWith({
        success: true,
        content: newContent,
      });
    });
    
    it('handles errors when creating content', async () => {
      // Mock the auth client with an error
      const mockAuthClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: new Error('Insert error'),
              }),
            }),
          }),
        }),
      };
      
      (getAuthenticatedSupabase as jest.Mock).mockReturnValue(mockAuthClient);
      
      await POST(mockRequest as NextRequest);
      
      // Verify response contains the error
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to create content' },
        { status: 500 }
      );
    });
  });
}); 