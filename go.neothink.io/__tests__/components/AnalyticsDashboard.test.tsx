import { render, screen, waitFor, fireEvent } from '@neothink/testing';
import { AnalyticsDashboard } from '../../components/AnalyticsDashboard';
import { getAnalyticsSummary } from '@neothink/analytics';

// Mock the analytics getAnalyticsSummary function
jest.mock('@neothink/analytics', () => ({
  getAnalyticsSummary: jest.fn(),
}));

/**
 * Tests for the AnalyticsDashboard component
 * 
 * @see DEVELOPMENT.md#testing - Testing with packages/testing
 */
describe('AnalyticsDashboard', () => {
  // Mock analytics summary data
  const mockSummary = {
    totalEvents: 100,
    platforms: [
      {
        platform: 'hub',
        totalEvents: 50,
        events: {
          page_view: 30,
          content_view: 20,
        },
      },
      {
        platform: 'ascenders',
        totalEvents: 30,
        events: {
          page_view: 20,
          content_view: 10,
        },
      },
      {
        platform: 'neothinkers',
        totalEvents: 20,
        events: {
          page_view: 15,
          content_view: 5,
        },
      },
    ],
    eventCounts: [
      { platform: 'hub', event: 'page_view', count: 30 },
      { platform: 'hub', event: 'content_view', count: 20 },
      { platform: 'ascenders', event: 'page_view', count: 20 },
      { platform: 'ascenders', event: 'content_view', count: 10 },
      { platform: 'neothinkers', event: 'page_view', count: 15 },
      { platform: 'neothinkers', event: 'content_view', count: 5 },
    ],
    period: {
      startDate: '2023-01-01T00:00:00Z',
      endDate: '2023-01-07T23:59:59Z',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    (getAnalyticsSummary as jest.Mock).mockResolvedValue(mockSummary);
  });

  it('shows loading state initially', async () => {
    // Delay the resolution of getAnalyticsSummary
    (getAnalyticsSummary as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockSummary), 100))
    );
    
    render(<AnalyticsDashboard />);
    
    // Check that loading state is shown
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('loading-placeholder')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('displays analytics summary data', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });
    
    // Check that total events are displayed
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Check that platform buttons are displayed
    expect(screen.getByText('All platforms')).toBeInTheDocument();
    expect(screen.getByText('hub')).toBeInTheDocument();
    expect(screen.getByText('ascenders')).toBeInTheDocument();
    expect(screen.getByText('neothinkers')).toBeInTheDocument();
    
    // Check that event table has the right data
    expect(screen.getByText('Event Type')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
    
    // Check that the date range is displayed
    expect(screen.getByText(/Data from/)).toBeInTheDocument();
  });

  it('filters data by platform when a platform button is clicked', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });
    
    // Initially should show total events across all platforms
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Click on the 'hub' platform button
    fireEvent.click(screen.getByText('hub'));
    
    // Should now show only hub events (50)
    expect(screen.getByText('50')).toBeInTheDocument();
    
    // Should show hub-specific page views (30)
    expect(screen.getAllByText('30')).toHaveLength(1);
    
    // Click back to 'All platforms'
    fireEvent.click(screen.getByText('All platforms'));
    
    // Should show total events again
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
    
    // Clear the mock to track new calls
    (getAnalyticsSummary as jest.Mock).mockClear();
    
    // Click refresh button
    fireEvent.click(screen.getByText('Refresh'));
    
    // Should call getAnalyticsSummary again
    expect(getAnalyticsSummary).toHaveBeenCalledTimes(1);
  });

  it('handles data fetching errors gracefully', async () => {
    // Mock error response
    (getAnalyticsSummary as jest.Mock).mockRejectedValue(new Error('Failed to fetch analytics data'));
    
    render(<AnalyticsDashboard />);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error loading analytics')).toBeInTheDocument();
    });
    
    // Should show error message and retry button
    expect(screen.getByText('Failed to fetch analytics data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    
    // Mock successful response for retry
    (getAnalyticsSummary as jest.Mock).mockResolvedValue(mockSummary);
    
    // Click retry button
    fireEvent.click(screen.getByText('Retry'));
    
    // Should load data successfully
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });
  });

  it('accepts initialPlatform prop to pre-filter data', async () => {
    render(<AnalyticsDashboard initialPlatform="ascenders" />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });
    
    // Should filter to ascenders platform (30 events)
    expect(screen.getByText('30')).toBeInTheDocument();
    
    // The ascenders button should be highlighted (have the blue background class)
    const ascendersButton = screen.getByText('ascenders');
    expect(ascendersButton).toHaveClass('bg-blue-600');
  });
}); 