import { render, screen, waitFor, fireEvent } from '@neothink/testing';
import { createClient } from '@neothink/core';
import { analytics } from '@neothink/analytics';
import HomePage from '../pages/index';

// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the @neothink/core createClient function
jest.mock('@neothink/core', () => ({
  createClient: jest.fn(),
}));

// Mock the @neothink/analytics module
jest.mock('@neothink/analytics', () => ({
  analytics: {
    page: jest.fn(),
    track: jest.fn(),
  },
}));

// Mock the @neothink/hooks useAuth hook
jest.mock('@neothink/hooks', () => ({
  useAuth: jest.fn(() => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isAdmin: false,
  })),
}));

// Mock the RealtimeUpdates component
jest.mock('../components/RealtimeUpdates', () => ({
  RealtimeUpdates: () => <div data-testid="realtime-updates">Realtime Updates Mock</div>,
}));

describe('Neothinkers HomePage', () => {
  // Mock Supabase client
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect }));
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockLimit = jest.fn();
  
  // Set up the mock Supabase client
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configure the mocked Supabase client
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue({
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
    });
    
    // Set up the mock Supabase client
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
  });

  it('renders the page title', () => {
    render(<HomePage />);
    expect(screen.getByText('Neothinkers Platform')).toBeInTheDocument();
  });

  it('tracks page view on initial render', () => {
    render(<HomePage />);
    expect(analytics.page).toHaveBeenCalledWith('neothinkers', '/');
  });

  it('fetches and displays achievements', async () => {
    render(<HomePage />);
    
    // Check loading state
    expect(screen.getByTestId('loading-achievements')).toBeInTheDocument();
    
    // Wait for achievements to load
    await waitFor(() => {
      expect(screen.getByText('Test Achievement 1')).toBeInTheDocument();
    });
    
    // Verify Supabase client was called correctly
    expect(mockFrom).toHaveBeenCalledWith('achievements');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('platform', 'neothinkers');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(5);
    
    // Check achievements are displayed
    expect(screen.getByText('Test Achievement 1')).toBeInTheDocument();
    expect(screen.getByText('This is a test achievement')).toBeInTheDocument();
    expect(screen.getByText('100 points')).toBeInTheDocument();
    
    expect(screen.getByText('Test Achievement 2')).toBeInTheDocument();
    expect(screen.getByText('This is another test achievement')).toBeInTheDocument();
    expect(screen.getByText('200 points')).toBeInTheDocument();
  });

  it('displays error message when fetching fails', async () => {
    // Set up error case
    mockLimit.mockResolvedValueOnce({
      data: null,
      error: { message: 'Failed to fetch achievements' },
    });
    
    render(<HomePage />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });
    
    // Check error message
    expect(screen.getByText('Failed to fetch achievements')).toBeInTheDocument();
    
    // Check error is tracked
    expect(analytics.track).toHaveBeenCalledWith('data_fetch_error', expect.objectContaining({
      platform: 'neothinkers',
      component: 'HomePage',
    }));
  });

  it('displays the RealtimeUpdates component', async () => {
    render(<HomePage />);
    
    // Check RealtimeUpdates component is rendered
    expect(screen.getByTestId('realtime-updates')).toBeInTheDocument();
  });

  it('displays fallback UI when no achievements are found', async () => {
    // Set up empty data case
    mockLimit.mockResolvedValueOnce({
      data: [],
      error: null,
    });
    
    render(<HomePage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-achievements')).not.toBeInTheDocument();
    });
    
    // Check fallback message
    expect(screen.getByText('No achievements found.')).toBeInTheDocument();
  });

  // Additional tests could be added for:
  // - Testing admin view with AnalyticsDashboard
  // - Testing navigation buttons
  // - Testing error boundary behavior
  // - Testing network failures
}); 