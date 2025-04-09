import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthentication } from '../src/useAuthentication';
import { supabase } from '@neothink/core/database/client';

// Mock the Supabase client
jest.mock('@neothink/core/database/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('useAuthentication hook', () => {
  // Test user data
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };
  
  // Test session data
  const mockSession = {
    user: mockUser,
    access_token: 'test-token',
  };
  
  // Test profile data
  const mockProfile = {
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    is_ascender: true,
    is_neothinker: false,
    is_immortal: false,
    platforms: ['hub', 'ascenders'],
  };
  
  // Setup for each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock getSession to return a session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    
    // Mock onAuthStateChange to return a subscription
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
    
    // Mock the from, select, eq, and single calls for profile fetching
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });
  });

  it('should initialize with session and user data', async () => {
    // Render the hook
    const { result } = renderHook(() => useAuthentication());
    
    // Initially should be loading
    expect(result.current.loading).toBe(true);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify user and session are set
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.isAuthenticated).toBe(true);
    
    // Verify Supabase calls
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });

  it('should handle sign in', async () => {
    // Mock the signInWithPassword method
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { session: mockSession, user: mockUser },
      error: null,
    });
    
    // Render the hook
    const { result } = renderHook(() => useAuthentication());
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Call sign in method
    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });
    
    // Verify Supabase call
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should handle sign out', async () => {
    // Mock the signOut method
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    // Render the hook
    const { result } = renderHook(() => useAuthentication());
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Call sign out method
    await act(async () => {
      await result.current.signOut();
    });
    
    // Verify Supabase call
    expect(supabase.auth.signOut).toHaveBeenCalled();
    
    // Verify state is reset
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should check platform access correctly', async () => {
    // Render the hook
    const { result } = renderHook(() => useAuthentication());
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify platform access based on profile data
    expect(result.current.hasPlatformAccess('hub')).toBe(true);
    expect(result.current.hasPlatformAccess('ascenders')).toBe(true);
    expect(result.current.hasPlatformAccess('neothinkers')).toBe(false);
    expect(result.current.hasPlatformAccess('immortals')).toBe(false);
  });

  it('should apply platform filters when specified', async () => {
    // Mock profile query chain
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });
    
    // Render the hook with platform specified
    const { result } = renderHook(() => useAuthentication({
      platform: 'ascenders'
    }));
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify the platform filter was used in the profile query
    expect(mockEq).toHaveBeenCalledWith('id', mockUser.id);
    
    // The second eq call should be for the platform filter
    expect(mockEq).toHaveBeenCalledWith('is_ascender', true);
  });
}); 