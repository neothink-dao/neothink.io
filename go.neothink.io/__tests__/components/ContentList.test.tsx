import { render, screen, fireEvent } from '@neothink/testing';
import { ContentList } from '../../components/ContentList';

// Mock the analytics hooks
jest.mock('@neothink/analytics', () => ({
  useContentView: jest.fn().mockReturnValue(jest.fn()),
  useProgressTracker: jest.fn().mockReturnValue(jest.fn()),
}));

/**
 * Tests for the ContentList component
 * 
 * @see DEVELOPMENT.md - Testing with packages/testing
 */
describe('ContentList', () => {
  const mockContent = [
    {
      id: '1',
      title: 'Test Article 1',
      description: 'This is a test article',
      platform: 'hub',
      created_at: '2023-01-01T12:00:00Z',
    },
    {
      id: '2',
      title: 'Test Article 2',
      description: 'This is another test article',
      platform: 'hub',
      created_at: '2023-01-02T12:00:00Z',
    },
  ];

  it('renders content items correctly', () => {
    render(<ContentList items={mockContent} platform="hub" />);
    
    // Check that content titles are displayed
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    
    // Check that descriptions are displayed
    expect(screen.getByText('This is a test article')).toBeInTheDocument();
    expect(screen.getByText('This is another test article')).toBeInTheDocument();
  });

  it('shows "No content available" when there are no items', () => {
    render(<ContentList items={[]} platform="hub" />);
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('expands an item when clicked and tracks the view', () => {
    const trackContentMock = jest.fn();
    const { useContentView } = require('@neothink/analytics');
    useContentView.mockReturnValue(trackContentMock);
    
    render(<ContentList items={mockContent} platform="hub" />);
    
    // Click on the first item
    fireEvent.click(screen.getByText('Test Article 1'));
    
    // Check that expanded content is displayed
    expect(screen.getByText('This is the expanded content for Test Article 1.')).toBeInTheDocument();
    
    // Check that analytics tracking was called
    expect(trackContentMock).toHaveBeenCalledWith('hub', {
      content_id: '1',
      content_title: 'Test Article 1',
      content_type: 'article',
    });
  });

  it('tracks progress when "Mark Complete" is clicked', () => {
    const trackProgressMock = jest.fn();
    const { useProgressTracker } = require('@neothink/analytics');
    useProgressTracker.mockReturnValue(trackProgressMock);
    
    render(<ContentList items={mockContent} platform="hub" />);
    
    // Click on the first item to expand it
    fireEvent.click(screen.getByText('Test Article 1'));
    
    // Click the "Mark Complete" button
    fireEvent.click(screen.getByText('Mark Complete'));
    
    // Check that progress tracking was called
    expect(trackProgressMock).toHaveBeenCalledWith('hub', {
      content_id: '1',
      progress_percentage: 100,
      completed: true,
    });
  });
}); 