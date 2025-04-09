import { renderHook, waitFor } from '@neothink/testing';
import { useData } from '../src/useData';
import { supabase } from '@neothink/core';

// Mock the Supabase client
jest.mock('@neothink/core', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: jest.fn(),
  },
}));

/**
 * Tests for the useData hook
 * 
 * @see DEVELOPMENT.md - Testing with packages/testing
 * @see SUPABASE.md - Row Level Security implementation
 */
describe('useData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initially returns loading state and undefined data', () => {
    // Set up mock to not resolve immediately
    (supabase.then as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useData('content', { platform: 'hub' }));
    
    // Initial state should be loading with no data or error
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('fetches data from Supabase', async () => {
    // Mock successful response
    const mockData = [{ id: '1', title: 'Test Content' }];
    (supabase.then as jest.Mock).mockImplementation((callback) => {
      callback({ data: mockData, error: null });
      return Promise.resolve();
    });
    
    const { result } = renderHook(() => useData('content', { platform: 'hub' }));
    
    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have the data and no error
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    
    // Should have called Supabase with the correct table and filter
    expect(supabase.from).toHaveBeenCalledWith('content');
    expect(supabase.eq).toHaveBeenCalledWith('platform', 'hub');
  });

  it('handles Supabase errors', async () => {
    // Mock error response
    const mockError = { message: 'Database error' };
    (supabase.then as jest.Mock).mockImplementation((callback) => {
      callback({ data: null, error: mockError });
      return Promise.resolve();
    });
    
    const { result } = renderHook(() => useData('content', { platform: 'hub' }));
    
    // Wait for the hook to update
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have the error and no data
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('re-fetches when filters change', async () => {
    // Mock successful response
    const mockData = [{ id: '1', title: 'Test Content' }];
    (supabase.then as jest.Mock).mockImplementation((callback) => {
      callback({ data: mockData, error: null });
      return Promise.resolve();
    });
    
    const { result, rerender } = renderHook(
      (props) => useData('content', props.filters),
      { initialProps: { filters: { platform: 'hub' } } }
    );
    
    // Wait for the initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Initial Supabase calls
    expect(supabase.from).toHaveBeenCalledWith('content');
    expect(supabase.eq).toHaveBeenCalledWith('platform', 'hub');
    
    // Reset call count
    jest.clearAllMocks();
    
    // Change filters and rerender
    rerender({ filters: { platform: 'ascenders' } });
    
    // Should have called Supabase again with the new filter
    expect(supabase.from).toHaveBeenCalledWith('content');
    expect(supabase.eq).toHaveBeenCalledWith('platform', 'ascenders');
  });
}); 