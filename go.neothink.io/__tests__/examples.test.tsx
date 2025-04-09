import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExamplesPage from '../app/examples/page';
import { usePageView } from '@neothink/analytics/hooks';
import { analytics } from '@neothink/analytics';
import { useData, useAuthentication } from '@neothink/hooks';

// Mock the hooks and analytics
jest.mock('@neothink/analytics/hooks', () => ({
  usePageView: jest.fn(),
}));

jest.mock('@neothink/analytics', () => ({
  analytics: {
    track: jest.fn(),
  },
}));

jest.mock('@neothink/hooks', () => ({
  useData: jest.fn(),
  useAuthentication: jest.fn(),
}));

// Mock the HubAnalyticsExample component
jest.mock('../examples/HubAnalyticsExample', () => () => (
  <div data-testid="hub-analytics-example">Hub Analytics Example Component</div>
));

describe('ExamplesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock values
    (usePageView as jest.Mock).mockImplementation(() => {});
    
    (useData as jest.Mock).mockImplementation(() => ({
      data: [
        { id: '1', title: 'Test Content 1', content: 'Test content 1 description' },
        { id: '2', title: 'Test Content 2', content: 'Test content 2 description' },
      ],
      loading: false,
      error: null,
    }));
    
    (useAuthentication as jest.Mock).mockImplementation(() => ({
      user: { id: 'test-user-id', email: 'test@example.com' },
      profile: { full_name: 'Test User', id: 'test-user-id' },
      loading: false,
      error: null,
      isAuthenticated: true,
    }));
    
    (analytics.track as jest.Mock).mockImplementation(() => Promise.resolve());
  });

  it('tracks page view on load', () => {
    render(<ExamplesPage />);
    expect(usePageView).toHaveBeenCalledWith('hub');
  });

  it('renders welcome message with user name', () => {
    render(<ExamplesPage />);
    expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument();
  });

  it('renders analytics tab by default', () => {
    render(<ExamplesPage />);
    expect(screen.getByText('Analytics Tracking Example')).toBeInTheDocument();
    expect(screen.getByTestId('hub-analytics-example')).toBeInTheDocument();
  });

  it('changes tab when clicked and tracks analytics', async () => {
    render(<ExamplesPage />);
    
    // Initially on analytics tab
    expect(screen.getByText('Analytics Tracking Example')).toBeInTheDocument();
    
    // Click on data tab
    fireEvent.click(screen.getByText('Data Fetching'));
    
    // Should show data fetching content
    expect(screen.getByText('Data Fetching Example')).toBeInTheDocument();
    
    // Should track the tab change
    expect(analytics.track).toHaveBeenCalledWith('tab_view', {
      platform: 'hub',
      tab_name: 'data',
    });
    
    // Click on realtime tab
    fireEvent.click(screen.getByText('Realtime Updates'));
    
    // Should show realtime updates content
    expect(screen.getByText('Realtime Updates Example')).toBeInTheDocument();
    
    // Should track the tab change again
    expect(analytics.track).toHaveBeenCalledWith('tab_view', {
      platform: 'hub',
      tab_name: 'realtime',
    });
  });

  it('renders loading state when authentication is loading', () => {
    (useAuthentication as jest.Mock).mockImplementation(() => ({
      user: null,
      profile: null,
      loading: true,
      error: null,
      isAuthenticated: false,
    }));
    
    render(<ExamplesPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we load your data')).toBeInTheDocument();
  });

  it('renders login prompt when user is not authenticated', () => {
    (useAuthentication as jest.Mock).mockImplementation(() => ({
      user: null,
      profile: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    }));
    
    render(<ExamplesPage />);
    
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to access this page')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('displays content items when data tab is active', () => {
    render(<ExamplesPage />);
    
    // Click on data tab
    fireEvent.click(screen.getByText('Data Fetching'));
    
    // Should show content items
    expect(screen.getByText('Test Content 1')).toBeInTheDocument();
    expect(screen.getByText('Test Content 2')).toBeInTheDocument();
  });

  it('shows loading state when content is loading', () => {
    (useData as jest.Mock).mockImplementation(() => ({
      data: null,
      loading: true,
      error: null,
    }));
    
    render(<ExamplesPage />);
    
    // Click on data tab
    fireEvent.click(screen.getByText('Data Fetching'));
    
    // Should show loading state
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('shows empty state when no content items are found', () => {
    (useData as jest.Mock).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
    }));
    
    render(<ExamplesPage />);
    
    // Click on data tab
    fireEvent.click(screen.getByText('Data Fetching'));
    
    // Should show empty state
    expect(screen.getByText('No content items found')).toBeInTheDocument();
  });

  it('tracks analytics when clicking the demo update button', () => {
    render(<ExamplesPage />);
    
    // Click on realtime tab
    fireEvent.click(screen.getByText('Realtime Updates'));
    
    // Click the demo update button
    fireEvent.click(screen.getByText('Trigger Demo Update'));
    
    // Should track the demo update
    expect(analytics.track).toHaveBeenCalledWith('realtime_demo', {
      platform: 'hub',
      action: 'trigger_update',
    });
  });
}); 