import { getAnalyticsSummary } from '../src/summary';
import { supabase } from '@neothink/core';

// Mock the Supabase client
jest.mock('@neothink/core', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  },
}));

/**
 * Tests for the getAnalyticsSummary function
 * 
 * @see DEVELOPMENT.md#testing - Testing analytics functionality
 * @see SUPABASE.md#analytics - Analytics data structure
 */
describe('getAnalyticsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (supabase.from as jest.Mock).mockReturnThis();
    (supabase.select as jest.Mock).mockReturnThis();
    (supabase.gte as jest.Mock).mockReturnThis();
    (supabase.lte as jest.Mock).mockReturnThis();
    (supabase.in as jest.Mock).mockReturnThis();
    (supabase.limit as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });
  });

  it('returns empty summary when no events exist', async () => {
    // Mock empty data response
    (supabase.limit as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });
    
    const summary = await getAnalyticsSummary();
    
    expect(summary.totalEvents).toBe(0);
    expect(summary.platforms).toEqual([]);
    expect(summary.eventCounts).toEqual([]);
    expect(summary.period).toBeDefined();
    expect(summary.period.startDate).toBeDefined();
    expect(summary.period.endDate).toBeDefined();
  });

  it('correctly aggregates events by platform and type', async () => {
    // Mock analytics events data
    const mockEvents = [
      { event: 'page_view', platform: 'hub', properties: {}, created_at: '2023-01-01T12:00:00Z' },
      { event: 'page_view', platform: 'hub', properties: {}, created_at: '2023-01-01T12:01:00Z' },
      { event: 'content_view', platform: 'hub', properties: {}, created_at: '2023-01-01T12:02:00Z' },
      { event: 'page_view', platform: 'ascenders', properties: {}, created_at: '2023-01-01T12:03:00Z' },
      { event: 'signup', platform: 'neothinkers', properties: {}, created_at: '2023-01-01T12:04:00Z' },
    ];
    
    (supabase.limit as jest.Mock).mockResolvedValue({
      data: mockEvents,
      error: null,
    });
    
    const summary = await getAnalyticsSummary();
    
    // Check total events
    expect(summary.totalEvents).toBe(5);
    
    // Check platform breakdown
    expect(summary.platforms).toHaveLength(3);
    expect(summary.platforms.find(p => p.platform === 'hub')?.totalEvents).toBe(3);
    expect(summary.platforms.find(p => p.platform === 'ascenders')?.totalEvents).toBe(1);
    expect(summary.platforms.find(p => p.platform === 'neothinkers')?.totalEvents).toBe(1);
    
    // Check event counts
    expect(summary.eventCounts).toHaveLength(4); // 3 unique event types across platforms
    
    // Check that the most common event type appears first (page_view in hub)
    expect(summary.eventCounts[0].platform).toBe('hub');
    expect(summary.eventCounts[0].event).toBe('page_view');
    expect(summary.eventCounts[0].count).toBe(2);
  });

  it('applies date range filters correctly', async () => {
    // Setup test parameters
    const startDate = '2023-01-01T00:00:00Z';
    const endDate = '2023-01-31T23:59:59Z';
    
    // Get analytics summary with date range
    await getAnalyticsSummary({ startDate, endDate });
    
    // Verify that date range filters were applied
    expect(supabase.from).toHaveBeenCalledWith('analytics_events');
    expect(supabase.gte).toHaveBeenCalledWith('created_at', startDate);
    expect(supabase.lte).toHaveBeenCalledWith('created_at', endDate);
  });

  it('applies platform filters correctly', async () => {
    // Setup test parameters
    const platforms = ['hub', 'ascenders'];
    
    // Get analytics summary with platform filter
    await getAnalyticsSummary({ platforms });
    
    // Verify that platform filter was applied
    expect(supabase.from).toHaveBeenCalledWith('analytics_events');
    expect(supabase.in).toHaveBeenCalledWith('platform', platforms);
  });

  it('applies event type filters correctly', async () => {
    // Setup test parameters
    const eventTypes = ['page_view', 'content_view'];
    
    // Get analytics summary with event type filter
    await getAnalyticsSummary({ eventTypes });
    
    // Verify that event type filter was applied
    expect(supabase.from).toHaveBeenCalledWith('analytics_events');
    expect(supabase.in).toHaveBeenCalledWith('event', eventTypes);
  });

  it('handles database errors gracefully', async () => {
    // Mock database error
    (supabase.limit as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Database connection error' },
    });
    
    // Expect the function to throw with the error message
    await expect(getAnalyticsSummary()).rejects.toThrow('Failed to fetch analytics events');
  });
}); 