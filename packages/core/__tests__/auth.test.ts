import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedSupabase } from '../auth/client';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

/**
 * Tests for authentication functionality in the core package
 * 
 * @see DEVELOPMENT.md - Testing with packages/testing
 * @see SUPABASE.md - Authentication setup
 */
describe('Authentication', () => {
  const mockToken = 'mock-auth-token';
  const mockSupabaseClient = { from: jest.fn() };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock createClient to return our mock Supabase client
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    
    // Set up environment variables for tests
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });
  
  afterEach(() => {
    // Clean up environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });
  
  describe('getAuthenticatedSupabase', () => {
    it('creates a Supabase client with the provided token', () => {
      const client = getAuthenticatedSupabase(mockToken);
      
      // Should have called createClient with correct arguments
      expect(createClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.objectContaining({
          global: {
            headers: {
              Authorization: `Bearer ${mockToken}`,
            },
          },
        })
      );
      
      // Should return the client
      expect(client).toBe(mockSupabaseClient);
    });
    
    it('throws an error if SUPABASE_URL is not defined', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      expect(() => {
        getAuthenticatedSupabase(mockToken);
      }).toThrow('Supabase URL is not defined');
    });
    
    it('throws an error if SUPABASE_ANON_KEY is not defined', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      expect(() => {
        getAuthenticatedSupabase(mockToken);
      }).toThrow('Supabase anon key is not defined');
    });
    
    it('configures nearest read replica routing', () => {
      const client = getAuthenticatedSupabase(mockToken);
      
      // Should have configured read replica routing
      expect(createClient).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          db: {
            routeToNearestReadReplica: true,
          },
        })
      );
    });
  });
}); 